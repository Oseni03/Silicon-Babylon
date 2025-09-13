import logger from "@/lib/logger";
import { inngest } from "../client";
import { TechCrunchItem } from "@/types/types";
import Parser from "rss-parser";
import { checkExistingArticles, createArticle } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { ensureCategories, fetchFeed } from "./utils";
import { siteUrl } from "@/lib/config";
import { stripHtml } from "@/lib/utils/xml";
import { postToLinkedIn } from "@/lib/social/linkedin";
import { prisma } from "@/lib/prisma";
import { ai_agent } from "@/lib/ai";

export const processFeeds = inngest.createFunction(
	{ id: "process-feeds" },
	{ cron: "TZ=Europe/Paris 0 */12 * * *" },
	async ({ step }) => {
		// This function will be called whenever the "satirictech/process-feed" event is sent
		// You can access event data via `event.data`
		// Add your feed processing logic here

		// Ensure database connection
		await prisma.$connect();

		logger.info("Starting feed processing");

		// Check LinkedIn credentials
		const linkedInAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
		const linkedInUrn = process.env.LINKEDIN_URN;
		const linkedInEnabled = !!(linkedInAccessToken && linkedInUrn);
		if (!linkedInEnabled) {
			logger.warn(
				"LinkedIn credentials not configured, skipping LinkedIn posts"
			);
		}

		const feedResults = await step.run("fetch-all-feeds", async () => {
			const TECHCRUNCH_FEEDS = [
				"https://techcrunch.com/category/commerce/feed/",
				"https://techcrunch.com/category/artificial-intelligence/feed/",
				"https://techcrunch.com/category/cryptocurrency/feed/",
				"https://techcrunch.com/category/fundraising/feed/",
				"https://techcrunch.com/category/gaming/feed/",
				"https://techcrunch.com/category/media-entertainment/feed/",
			];

			// Fetch all feeds in parallel with timeout
			const results = await Promise.allSettled(
				TECHCRUNCH_FEEDS.map(fetchFeed)
			);

			// Extract successful feeds and filter items
			const allItems: TechCrunchItem[] = results
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
			return allItems;
		});

		// Batch check for existing articles and filter by date
		const newResults = await step.run("filter-new-items", async () => {
			const allUrls = Array.from(
				new Set(feedResults.map((item) => item.link))
			);
			logger.info(`Received ${feedResults.length} unfiltered feeds`);
			const existingUrls = await checkExistingArticles(allUrls);

			const newItems = feedResults.filter((item) => {
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
			return newItems;
		});

		logger.info(`Retrieved ${newResults.length} new items from feeds`);
		if (newResults.length === 0) {
			logger.info("No new articles to process");
			return;
		}

		await Promise.all(
			newResults.map(async (item: TechCrunchItem) =>
				step.run("process-feed", async () => {
					try {
						const categories = await ensureCategories(
							item.categories
						);

						const satirical =
							await ai_agent.generateSatiricalVersion(
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
							throw new Error("Satirical generation failed");
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
						return { success: true, title: satirical.title };
					} catch (error) {
						logger.error("Error processing article", {
							title: item.title,
							error,
						});
						return { success: false, title: item.title, error };
					}
				})
			)
		);

		logger.info(`Feed processing completed`, {
			totalArticles: newResults.length,
		});

		await prisma.$disconnect();
	}
);
