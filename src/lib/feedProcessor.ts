import Parser from "rss-parser";
import { OpenAI } from "openai";
import { generateSlug } from "./utils";
import logger from "./logger";
import {
	type TechCrunchItem,
	type SatiricalResult,
	type Category,
} from "@/types/types";
import { createArticle, createCategory } from "./db";

const parser = new Parser();
const openai = new OpenAI({
	baseURL: "https://api.deepseek.com",
	apiKey: process.env.DEEPSEEK_API_KEY,
});

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
			"https://techcrunch.com/category/commerce//feed/",
			"https://techcrunch.com/category/artificial-intelligence/feed/",
			"https://techcrunch.com/category/cryptocurrency/feed/",
			"https://techcrunch.com/category/fundraising/feed/",
			"https://techcrunch.com/category/gaming/feed/",
			"https://techcrunch.com/category/media-entertainment/feed/",
		];

		const feedPromises = TECHCRUNCH_FEEDS.map((feedUrl) =>
			parser.parseURL(feedUrl)
		);
		const feeds = await Promise.all(feedPromises);

		const allItems: TechCrunchItem[] = feeds.flatMap((feed) => {
			const items = feed.items as TechCrunchItem[];
			return items.filter((item) => {
				const pubDate = new Date(item.isoDate);
				const isCurrentDay = isToday(pubDate);
				if (!isCurrentDay) {
					logger.debug("Skipping older article", {
						title: item.title,
						publishedAt: item.isoDate,
					});
				}
				return isCurrentDay;
			});
		});

		logger.info(`Retrieved ${allItems.length} items from today's feeds`);

		if (allItems.length === 0) {
			logger.info("No new articles to process today");
			return;
		}

		const BATCH_SIZE = 3;

		for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
			const batch = allItems.slice(i, i + BATCH_SIZE);
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

						await createArticle({
							title: satirical.title,
							slug: generateSlug(satirical.title),
							content: satirical.content,
							keywords: satirical.keywords,
							publishedAt: new Date(item.isoDate),
							categories: categories,
							originalUrl: item.link,
							originalTitle: item.title,
						});

						logger.info("Successfully processed article", {
							title: satirical.title,
						});
						console.log(`Processed: ${satirical.title}`);
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

			if (i + BATCH_SIZE < allItems.length) {
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}
		}

		logger.info(`Feed processing completed`, {
			totalArticles: allItems.length,
		});
		console.log(`Successfully processed ${allItems.length} articles`);
	} catch (error) {
		logger.error("Error in fetchAndProcessFeeds", { error });
		console.error("Error in fetchAndProcessFeeds:", error);
		throw error;
	}
}

export { fetchAndProcessFeeds };
