import { createCategory } from "@/lib/db";
import logger from "@/lib/logger";
import { generateSlug } from "@/lib/utils";
import { Category } from "@/types/types";
import Parser from "rss-parser";

const parser = new Parser();

export async function fetchFeed(feedUrl: string) {
	try {
		const feed = await parser.parseURL(feedUrl);
		return feed;
	} catch (error) {
		logger.warn(`Failed to fetch feed: ${feedUrl}`, { error });
		return null;
	}
}

export async function ensureCategories(
	categories: string[]
): Promise<Category[]> {
	logger.debug("Ensuring categories exist", { categories });
	const categoryObjects = [];

	for (const category of categories) {
		const slug = generateSlug(category);
		const categoryObject = await createCategory({ name: category, slug });
		categoryObjects.push(categoryObject);
	}

	return categoryObjects;
}
