import { siteUrl } from "@/lib/config";
import { getAllCategories, getArticlesByCategory } from "@/lib/db";
import { MetadataRoute } from "next";

export const revalidate = 7200;

export async function generateSitemaps() {
	const categories = await getAllCategories();
	return categories.map((category) => ({
		id: category.slug,
	}));
}

export default async function sitemap({ id }): Promise<MetadataRoute.Sitemap> {
	// Get all dynamic articles
	const articles = await getArticlesByCategory(id);

	// Generate article URLs
	const categorySitemaps = articles.map((article) => ({
		url: `${siteUrl}/article/${article.slug}`,
		lastModified: new Date(article.publishedAt),
		changeFrequency: "daily" as const,
		priority: 0.9,
	}));
	return [...categorySitemaps];
}
