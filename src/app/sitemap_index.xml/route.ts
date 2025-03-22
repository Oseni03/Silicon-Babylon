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
			...dynamicSitemaps.map((sitemap) => sitemap.url),
		];

		if (!sitemaps.length) {
			logger.warn("No sitemaps found");
			return new NextResponse(null, { status: 404 });
		}

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
	const currentDate = new Date().toISOString();
	let xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const sitemap of sitemaps) {
		xml += "<url>";
		xml += `<loc>${sitemap}</loc>`;
		xml += `<lastmod>${currentDate}</lastmod>`;
		xml += "</url>";
	}
	xml += "</urlset>";
	return xml;
}
