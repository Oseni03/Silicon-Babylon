import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/config";
import { getAllCategories } from "@/lib/db";
import { buildSitemapXML } from "@/lib/utils";
import logger from "@/lib/logger";

async function generateSitemaps() {
	const categories = await getAllCategories();
	return categories.map((category) => ({
		url: `${siteUrl}/category/${category.slug}/sitemap.xml`,
		lastModified: new Date().toISOString(),
		changeFrequency: "daily" as const,
		priority: 0.9,
	}));
}

export async function GET() {
	try {
		const dynamicSitemaps = await generateSitemaps();

		const sitemaps = [
			{
				url: `${siteUrl}/sitemap.xml`,
				lastModified: new Date().toISOString(),
				changeFrequency: "daily" as const,
				priority: 0.9,
			},
			...dynamicSitemaps,
		];

		if (!sitemaps.length) {
			logger.warn("No sitemaps found");
			return new NextResponse(null, { status: 404 });
		}

		logger.info("Sitemap generated");

		const sitemapIndexXML = await buildSitemapXML(sitemaps);

		return new NextResponse(sitemapIndexXML, {
			headers: {
				"Content-Type": "application/xml",
				"Content-length": Buffer.byteLength(sitemapIndexXML).toString(),
			},
		});
	} catch (error) {
		logger.error("Error generating sitemap index: ", error);
		return NextResponse.error();
	}
}
