import Parser from "rss-parser";
import { OpenAI } from "openai";
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "../src/lib/utils";
import logger from "../src/lib/logger";

const prisma = new PrismaClient();
const parser = new Parser();
const openai = new OpenAI({
	baseURL: "https://api.deepseek.com",
	apiKey: process.env.DEEPSEEK_API_KEY,
});

interface TechCrunchItem {
	title: string;
	link: string;
	content: string;
	isoDate: string;
	categories: string[];
}

interface SatiricalResult {
	title: string;
	content: string;
	keywords: string[];
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
      "content": "The satirical content (around 500 words)",
      "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    }`;

		// User prompt with the specific article context
		const userPrompt = `Create a satirical version of this tech news article using humor techniques such as exaggeration, irony, parody, or absurdism. Make it funny and entertaining while keeping it relevant to the original topic. Avoid offensive content.
    
    Original Title: ${originalTitle}
    Original Content: ${originalContent.substring(0, 500)}...
    
    Respond with ONLY valid JSON in this exact format:
    {
      "title": "The satirical title",
      "content": "The satirical content (around 500 words)",
      "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    }
    
    The keywords should be SEO-optimized terms related to the article that would help with search engine ranking.`;

		const completion = await openai.chat.completions.create({
			model: "deepseek-chat",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			temperature: 0.9,
			max_tokens: 1000, // Increased to ensure complete response
			response_format: {
				type: "json_object",
			},
		});

		const responseText = completion.choices[0].message.content || "{}";
		let response;

		try {
			response = JSON.parse(responseText);
		} catch (jsonError) {
			logger.error("Error parsing Deepseek JSON response", {
				error: jsonError,
				responseText,
			});
			console.error("Error parsing Deepseek JSON response:", jsonError);
			console.log("Raw response:", responseText);

			// Even with response_format, we'll keep the fallback mechanism just in case
			response = {
				title: originalTitle + " (Satirical Version)",
				content:
					"Failed to generate satirical content. Our AI satirist is taking an unscheduled coffee break.",
				keywords: ["satire", "tech", "humor"],
			};
		}

		// Validate the response structure
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
		// Return fallback content in case of error
		return {
			title: originalTitle + " (Satirical Version)",
			content:
				"Our AI humorist is currently on coffee break. Please check back later for your satirical tech news.",
			keywords: ["satire", "tech", "humor"],
		};
	}
}

// Add this function before fetchAndProcessFeeds
async function ensureCategories(categories: string[]): Promise<void> {
	logger.debug("Ensuring categories exist", { categories });
	for (const category of categories) {
		const slug = generateSlug(category);
		await prisma.category.upsert({
			where: { slug },
			update: {},
			create: {
				name: category,
				slug,
			},
		});
	}
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

		// Parse all feeds concurrently
		const feedPromises = TECHCRUNCH_FEEDS.map((feedUrl) =>
			parser.parseURL(feedUrl)
		);
		const feeds = await Promise.all(feedPromises);

		// Collect all items from all feeds
		const allItems: TechCrunchItem[] = feeds.flatMap(
			(feed) => feed.items as TechCrunchItem[]
		);

		logger.info(`Retrieved ${allItems.length} items from feeds`);

		// Process items in batches to respect rate limits while maintaining some concurrency
		const BATCH_SIZE = 3;

		for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
			const batch = allItems.slice(i, i + BATCH_SIZE);
			logger.debug(`Processing batch ${i / BATCH_SIZE + 1}`, {
				batchSize: batch.length,
			});

			// Process each batch concurrently
			await Promise.all(
				batch.map(async (item) => {
					try {
						// Ensure categories exist before creating/updating article
						await ensureCategories(item.categories);

						// Generate satirical version with keywords
						const satirical = await generateSatiricalVersion(
							item.title,
							item.content
						);

						// Updated upsert command
						await prisma.article.upsert({
							where: {
								originalUrl: item.link,
							},
							update: {
								title: satirical.title,
								content: satirical.content,
								keywords: satirical.keywords,
								publishedAt: new Date(item.isoDate),
								categories: {
									connect: item.categories.map(
										(category) => ({
											slug: generateSlug(category),
										})
									),
								},
							},
							create: {
								title: satirical.title,
								content: satirical.content,
								keywords: satirical.keywords,
								originalUrl: item.link,
								originalTitle: item.title,
								publishedAt: new Date(item.isoDate),
								categories: {
									connect: item.categories.map(
										(category) => ({
											slug: generateSlug(category),
										})
									),
								},
							},
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

			// Add a small delay between batches
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

// // Run at 16:45 UTC daily (during the discount window)
// cron.schedule("45 16 * * *", async () => {
// 	logger.info("Starting scheduled feed processing");
// 	console.log("Starting feed processing...");
// 	await fetchAndProcessFeeds();
// 	logger.info("Scheduled feed processing completed");
// 	console.log("Feed processing completed.");
// });

// Also export for manual running
export { fetchAndProcessFeeds };

// Add this block to allow manual execution
if (require.main === module) {
	(async () => {
		try {
			logger.info("Starting manual feed processing");
			console.log("Starting manual feed processing...");
			await fetchAndProcessFeeds();
			logger.info("Manual feed processing completed");
			console.log("Manual feed processing completed.");
		} catch (error) {
			logger.error("Error during manual feed processing", { error });
			console.error("Error during manual feed processing:", error);
		} finally {
			await prisma.$disconnect();
		}
	})();
}
