import { siteUrl } from "@/lib/config";
import { getArticlesByCategory, getAllCategories } from "@/lib/db";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { buildSitemapXML } from "@/lib/utils";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const categories = await getAllCategories();

	if (!categories || categories.length === 0) {
		return [{ slug: "" }]; // or return [] depending on your needs
	}

	return categories
		.filter((category) => category?.slug) // ensure slug exists
		.map((category) => ({
			slug: category.slug,
		}));
}

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const { slug } = await params;
		const articles = await getArticlesByCategory(slug);

		const entries = [
			{
				url: `${siteUrl}/category/${slug}`,
				lastModified: new Date().toISOString(),
				changeFrequency: "daily",
				priority: 0.8,
			},
			...articles.map((article) => ({
				url: `${siteUrl}/article/${article.slug}`,
				lastModified: (
					article.updatedAt || article.createdAt
				).toISOString(),
				changeFrequency: "weekly",
				priority: 0.7,
			})),
		];

		const sitemapXML = await buildSitemapXML(entries);

		return new NextResponse(sitemapXML, {
			headers: {
				"Content-Type": "application/xml",
				"Content-Length": Buffer.byteLength(sitemapXML).toString(),
			},
		});
	} catch (error) {
		logger.error("Error generating category sitemap: ", error);
		return NextResponse.error();
	}
}
