import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/config";
import { getAllCategories } from "@/lib/db";
import { MetadataRoute } from "next";
import logger from "@/lib/logger";

async function generateSitemaps() {
	const categories = await getAllCategories();
	const sitemaps = categories.map((category) => ({
		id: category.slug,
		url: `${siteUrl}/archive/sitemap/${category.slug}.xml`,
	}));
	return sitemaps;
}

export async function GET() {
	try {
		const dynamicSitemaps = await generateSitemaps();

		const sitemaps = [
			`${siteUrl}/sitemap.xml`,
			`${siteUrl}/archive/sitemap.xml`,
			...dynamicSitemaps.map((sitemap) => sitemap.url),
		];

		logger.info("generated sitemaps: ", sitemaps);

		const sitemapIndexXML = await buildSitemapIndex(sitemaps);

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

async function buildSitemapIndex(sitemaps) {
	let xml = "<?xml version='1.0' encoding='UTF-8'?>";
	xml += `<sitemapIndex xlms="http://www.sitemaps.org/schemas/0.9">`;

	for (const sitemap of sitemaps) {
		xml += `<sitemap><loc>${sitemap}</loc></sitemap>`;
	}
	xml += `</sitemapIndex>`;
	return xml;
}
