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
import { postToBluesky, createSession } from "./social/bluesky";
import { postToLinkedIn } from "./social/linkedin";
import { type SessionResponse } from "./social/bluesky";
import { siteUrl } from "./config";
import { stripHtml } from "./utils/xml";
import { prisma } from "./prisma"; // Assuming prisma is imported from the database module

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
): Promise<SatiricalResult | null> {
	try {
		logger.info("Generating satirical version", { originalTitle });
		// System prompt to instruct the model about JSON formatting
		const systemPrompt = `You are a witty and sarcastic tech journalist. You will create satirical versions of tech news articles.
	Always respond with valid JSON that matches this format exactly:
	{
	  "title": "The SEO optimized funny title",
	  "content": "The SEO optimized satirical/funny content in HTML format (around 1500 words, with paragraphs wrapped in <p> tags and other HTML elements as needed)",
	  "description": "The short SEO optimized and captivating meta description in without HTML formatting",
	  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", ...]
	}`;

		// User prompt with the specific article context
		const userPrompt = `Create a satirical version of this tech news article using humor techniques such as exaggeration, irony, parody, or absurdism. Make it funny and entertaining while keeping it relevant to the original topic. Avoid offensive content. Format the content in HTML, with paragraphs wrapped in <p> tags and other HTML elements (e.g., <strong>, <em>, <ul>, <li>) as needed.

	Original Title: ${originalTitle}
	Original Content: ${originalContent}...

	Respond with ONLY valid JSON in this exact format:
	{
	"title": "The SEO optimized satirical/funny title",
	"content": "The SEO optimized satirical/funny content in HTML format (around 1500 words, with paragraphs wrapped in <p> tags and other HTML elements as needed)",
	"description": "The SEO optimized, captivating meta description that interests people to read the full article",
	"keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", ...]
	}

	The keywords should be SEO-optimized terms related to the article that would help with search engine ranking.`;

		const completion = await openai.chat.completions.create({
			model: "deepseek-chat",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			temperature: 1.5,
			max_tokens: 2500,
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
				return null;
			}
		}

		if (!response.title || !response.content) {
			logger.error("Invalid response format", { response });
			return null;
		}

		return {
			title: response.title,
			content: response.content,
			description: response.description || "",
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
		return null;
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

async function checkExistingArticles(urls: string[]): Promise<Set<string>> {
	try {
		const articles = await prisma.article.findMany({
			where: {
				originalUrl: {
					in: urls,
				},
			},
			select: {
				originalUrl: true,
			},
		});

		return new Set(articles.map((article) => article.originalUrl));
	} catch (error) {
		logger.error("Error checking existing articles", { error });
		return new Set();
	}
}

async function fetchAndProcessFeeds() {
	try {
		// Ensure database connection
		await prisma.$connect();

		logger.info("Starting feed processing");
		// Create Bluesky session once for all articles
		let blueskySession: SessionResponse;
		try {
			blueskySession = await createSession();
			logger.info("Successfully created Bluesky session");
		} catch (error) {
			logger.error("Failed to create Bluesky session", { error });
		}

		// Check LinkedIn credentials
		const linkedInAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
		const linkedInUrn = process.env.LINKEDIN_URN;
		const linkedInEnabled = !!(linkedInAccessToken && linkedInUrn);
		if (!linkedInEnabled) {
			logger.warn(
				"LinkedIn credentials not configured, skipping LinkedIn posts"
			);
		}

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
				return items;
			});

		// Batch check for existing articles and filter by date
		const allUrls = Array.from(new Set(allItems.map((item) => item.link)));
		logger.info(`Received ${allItems.length} unfiltered feeds`);
		const existingUrls = await checkExistingArticles(allUrls);

		const newItems = allItems.filter((item) => {
			// Check if URL exists
			if (existingUrls.has(item.link)) {
				logger.debug(`Skipping existing article: ${item.title}`);
				return false;
			}

			// Check if item has required fields
			if (!item.title || !item.content || !item.link) {
				logger.debug(
					`Skipping article with missing fields: ${item.title}`
				);
				return false;
			}

			// Check if published date is valid and recent (within last 48 hours)
			const pubDate = new Date(item.isoDate);
			const now = new Date();
			const hoursDiff =
				(now.getTime() - pubDate.getTime()) / (1000 * 3600);
			if (isNaN(pubDate.getTime()) || hoursDiff > 48) {
				logger.debug(
					`Skipping old or invalid date article: ${item.title}`
				);
				return false;
			}

			return true;
		});

		logger.info(`Retrieved ${newItems.length} new items from feeds`);

		if (newItems.length === 0) {
			logger.info("No new articles to process");
			return;
		}

		const BATCH_SIZE = 2; // Reduce batch size

		for (let i = 0; i < newItems.length; i += BATCH_SIZE) {
			const batch = newItems.slice(i, i + BATCH_SIZE);
			logger.debug(`Processing batch ${i / BATCH_SIZE + 1}`, {
				batchSize: batch.length,
			});

			// Add delay between batches to prevent connection pool exhaustion
			if (i > 0) {
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}

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

						if (!satirical) {
							logger.info(
								"Skipping article due to failed generation",
								{
									title: item.title,
								}
							);
							return;
						}

						const slug = generateSlug(satirical.title);
						const articleUrl = `${siteUrl}/article/${slug}`;

						await Promise.all(
							[
								createArticle({
									title: satirical.title,
									slug,
									content: satirical.content,
									description: satirical.description,
									keywords: satirical.keywords,
									publishedAt: new Date(item.isoDate),
									categories: categories,
									originalUrl: item.link,
									originalTitle: item.title,
								}),
								// Post to Bluesky if session is available
								blueskySession &&
									postToBluesky(
										satirical.title,
										satirical.description ||
											stripHtml(
												satirical.content
											).substring(0, 300) + "...",
										articleUrl,
										item.categories,
										blueskySession
									).catch((blueskyError) => {
										logger.error(
											"Error posting to Bluesky",
											{
												title: satirical.title,
												error: blueskyError,
											}
										);
									}),
								// Post to LinkedIn if enabled
								linkedInEnabled &&
									postToLinkedIn(
										satirical.title,
										articleUrl,
										satirical.description ||
											stripHtml(
												satirical.content
											).substring(0, 300) + "...",
										item.categories,
										linkedInAccessToken!,
										linkedInUrn!
									).catch((linkedInError) => {
										logger.error(
											"Error posting to LinkedIn",
											{
												title: satirical.title,
												error: linkedInError,
											}
										);
									}),
							].filter(Boolean)
						);

						logger.info("Successfully processed article", {
							title: satirical.title,
						});
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

			// Increase delay between batches
			if (i + BATCH_SIZE < newItems.length) {
				await new Promise((resolve) => setTimeout(resolve, 3000));
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
	} finally {
		// Clean up connection
		await prisma.$disconnect();
	}
}

export { fetchAndProcessFeeds };
