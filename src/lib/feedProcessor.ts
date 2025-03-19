import Parser from "rss-parser";
import { OpenAI } from "openai";
import { generateSlug } from "./utils";
import logger from "./logger";
import { postTweet } from "./twitter";
import {
	type TechCrunchItem,
	type SatiricalResult,
	type Category,
} from "@/types/types";
import { createArticle, createCategory, getArticleByOriginalUrl } from "./db";

const parser = new Parser();
const openai = new OpenAI({
	baseURL: "https://api.deepseek.com",
	apiKey: process.env.DEEPSEEK_API_KEY,
});

const FEED_TIMEOUT = 10000; // 10 seconds timeout

async function fetchFeedWithTimeout(feedUrl: string) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), FEED_TIMEOUT);

	try {
		const feed = await parser.parseURL(feedUrl);
		clearTimeout(timeoutId);
		return feed;
	} catch (error) {
		logger.warn(`Failed to fetch feed: ${feedUrl}`, { error });
		return null;
	}
}

async function generateSatiricalVersion(
	originalTitle: string,
	originalContent: string
): Promise<SatiricalResult> {
	try {
		logger.info("Generating satirical version", { originalTitle });
		// System prompt to instruct the model about JSON formatting
		const systemPrompt = `You are a witty and sarcastic tech journalist. You will create satirical versions of tech news articles.
	Always respond with valid JSON that matches this format exactly:
	{
	  "title": "The satirical title",
	  "content": "The satirical content in HTML format (around 500 words, with paragraphs wrapped in <p> tags and other HTML elements as needed)",
	  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
	}`;

		// User prompt with the specific article context
		const userPrompt = `Create a satirical version of this tech news article using humor techniques such as exaggeration, irony, parody, or absurdism. Make it funny and entertaining while keeping it relevant to the original topic. Avoid offensive content. Format the content in HTML, with paragraphs wrapped in <p> tags and other HTML elements (e.g., <strong>, <em>, <ul>, <li>) as needed.

	Original Title: ${originalTitle}
	Original Content: ${originalContent.substring(0, 500)}...

	Respond with ONLY valid JSON in this exact format:
	{
	"title": "The satirical title",
	"content": "The satirical content in HTML format (around 500 words, with paragraphs wrapped in <p> tags and other HTML elements as needed)",
	"keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
	}

	The keywords should be SEO-optimized terms related to the article that would help with search engine ranking.`;

		const completion = await openai.chat.completions.create({
			model: "deepseek-chat",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			temperature: 1.5,
			max_tokens: 1000,
			response_format: {
				type: "json_object",
			},
		});

		const responseText = completion.choices[0].message.content || "{}";
		let response;

		try {
			const sanitizedResponse = responseText
				.replace(/[\n\r]/g, "\\n")
				.replace(/[\t]/g, "\\t")
				.replace(/\u0000-\u001F/g, "");

			response = JSON.parse(sanitizedResponse);
		} catch (jsonError) {
			try {
				response = JSON.parse(responseText.trim());
			} catch {
				logger.error("Error parsing Deepseek JSON response", {
					error: jsonError,
					responseText,
				});
				console.error(
					"Error parsing Deepseek JSON response:",
					jsonError
				);
				console.log("Raw response:", responseText);

				response = {
					title: originalTitle + " (Satirical Version)",
					content:
						"Failed to generate satirical content. Our AI satirist is taking an unscheduled coffee break.",
					keywords: ["satire", "tech", "humor"],
				};
			}
		}

		return {
			title: response.title || originalTitle + " (Satirical Version)",
			content:
				response.content || "Failed to generate satirical content.",
			keywords:
				Array.isArray(response.keywords) && response.keywords.length > 0
					? response.keywords
					: ["satire", "tech", "humor"],
		};
	} catch (error) {
		logger.error("Error generating satirical version", {
			error,
			originalTitle,
		});
		console.error("Error generating satirical version:", error);
		return {
			title: originalTitle + " (Satirical Version)",
			content:
				"Our AI humorist is currently on coffee break. Please check back later for your satirical tech news.",
			keywords: ["satire", "tech", "humor"],
		};
	}
}

async function ensureCategories(categories: string[]): Promise<Category[]> {
	logger.debug("Ensuring categories exist", { categories });
	const categoryObjects = [];

	for (const category of categories) {
		const slug = generateSlug(category);
		const categoryObject = await createCategory({ name: category, slug });
		categoryObjects.push(categoryObject);
	}

	return categoryObjects;
}

function isToday(date: Date): boolean {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}

async function fetchAndProcessFeeds() {
	try {
		logger.info("Starting feed processing");
		const TECHCRUNCH_FEEDS = [
			"https://techcrunch.com/category/commerce/feed/",
			"https://techcrunch.com/category/artificial-intelligence/feed/",
			"https://techcrunch.com/category/cryptocurrency/feed/",
			"https://techcrunch.com/category/fundraising/feed/",
			"https://techcrunch.com/category/gaming/feed/",
			"https://techcrunch.com/category/media-entertainment/feed/",
		];

		// Fetch all feeds in parallel with timeout
		const feedResults = await Promise.allSettled(
			TECHCRUNCH_FEEDS.map(fetchFeedWithTimeout)
		);

		// Extract successful feeds and filter items
		const allItems: TechCrunchItem[] = feedResults
			.filter(
				(
					result
				): result is PromiseFulfilledResult<
					Parser.Output<TechCrunchItem>
				> => result.status === "fulfilled" && result.value !== null
			)
			.flatMap((result) => {
				const items = result.value.items;
				return items.filter((item) => isToday(new Date(item.isoDate)));
			});

		// Batch check for existing articles
		const existingUrls = new Set(
			await Promise.all(
				Array.from(new Set(allItems.map((item) => item.link))).map(
					(url) => getArticleByOriginalUrl(url)
				)
			).then((results) =>
				results.filter(Boolean).map((article) => article.originalUrl)
			)
		);

		const newItems = allItems.filter(
			(item) => !existingUrls.has(item.link)
		);

		logger.info(
			`Retrieved ${newItems.length} new items from today's feeds`
		);

		if (newItems.length === 0) {
			logger.info("No new articles to process today");
			return;
		}

		const BATCH_SIZE = 3;

		for (let i = 0; i < newItems.length; i += BATCH_SIZE) {
			const batch = newItems.slice(i, i + BATCH_SIZE);
			logger.debug(`Processing batch ${i / BATCH_SIZE + 1}`, {
				batchSize: batch.length,
			});

			await Promise.all(
				batch.map(async (item) => {
					try {
						const categories = await ensureCategories(
							item.categories
						);

						const satirical = await generateSatiricalVersion(
							item.title,
							item.content
						);

						const slug = generateSlug(satirical.title);
						await createArticle({
							title: satirical.title,
							slug,
							content: satirical.content,
							keywords: satirical.keywords,
							publishedAt: new Date(item.isoDate),
							categories: categories,
							originalUrl: item.link,
							originalTitle: item.title,
						});

						try {
							// Make tweet posting optional - if it fails, we still consider the article processing successful
							await postTweet(
								satirical.title,
								slug,
								satirical.content
							).catch((error) => {
								logger.warn("Twitter posting skipped", {
									title: satirical.title,
									error: error?.message,
								});
							});

							logger.info("Article processed successfully", {
								title: satirical.title,
								tweetAttempted: true,
							});
						} catch (twitterError) {
							logger.warn(
								"Twitter posting failed but article was saved",
								{
									title: satirical.title,
									error:
										twitterError instanceof Error
											? twitterError.message
											: "Unknown error occurred",
								}
							);
						}

						logger.info(
							"Successfully processed article and posted to Twitter",
							{
								title: satirical.title,
							}
						);
					} catch (error) {
						logger.error("Error processing article", {
							title: item.title,
							error,
						});
						console.error(
							`Error processing item "${item.title}":`,
							error
						);
					}
				})
			);

			if (i + BATCH_SIZE < newItems.length) {
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}
		}

		logger.info(`Feed processing completed`, {
			totalArticles: newItems.length,
		});
		console.log(`Successfully processed ${newItems.length} articles`);
	} catch (error) {
		logger.error("Error in fetchAndProcessFeeds", { error });
		console.error("Error in fetchAndProcessFeeds:", error);
		throw error;
	}
}

export { fetchAndProcessFeeds };
