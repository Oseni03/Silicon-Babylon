import { NextResponse } from "next/server";
import { getArticles } from "@/lib/db";
import { siteName, siteUrl } from "@/lib/config";
import { type Article } from "@/types/types";

export async function GET() {
	const articles = await getArticles();
	const rssXml = generateRssFeed(articles);

	return new NextResponse(rssXml, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600",
		},
	});
}

function generateRssFeed(articles: Article[]): string {
	const latestPost = articles[0];
	const lastBuildDate = new Date(
		latestPost?.publishedAt || new Date()
	).toUTCString();

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>Satirical takes on the latest tech news and trends</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${articles
		.map(
			(article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/article/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.content}]]></description>
      ${article.categories
			.map((cat) => `<category>${cat.name}</category>`)
			.join("")}
    </item>`
		)
		.join("")}
  </channel>
</rss>`;
}
