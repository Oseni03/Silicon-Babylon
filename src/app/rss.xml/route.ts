import { getPaginatedArticles } from "@/lib/db";
import { siteName, siteUrl } from "@/lib/config";
import { type Article } from "@/types/types";
import { escapeXml, stripHtml } from "@/lib/utils/xml";
import { cache } from "react";

// Cache the RSS feed generation
const generateRssFeed = cache((articles: Article[]): string => {
	const latestPost = articles[0];
	const lastBuildDate = new Date(
		latestPost?.publishedAt || new Date()
	).toUTCString();

	// Pre-compute common values
	const channelInfo = `
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Mythical takes on the latest tech news and trends</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml"/>`;

	const items = articles
		.map((article) => {
			const plainTextContent = stripHtml(article.content);
			const summary =
				article.description ||
				(plainTextContent.length > 500
					? plainTextContent.substring(0, 497) + "..."
					: plainTextContent);
			const imageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(article.title)}`;
			const articleUrl = `${siteUrl}/article/${article.slug}`;
			const pubDate = new Date(article.publishedAt).toUTCString();
			const categories = article.categories
				.map((cat) => `<category>${escapeXml(cat.name)}</category>`)
				.join("");

			return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(summary)}</description>
      <media:content 
        url="${escapeXml(imageUrl)}"
        medium="image"
        type="image/png"
        width="1000"
        height="1500"
      />
      ${categories}
    </item>`;
		})
		.join("");

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    ${channelInfo}
    ${items}
  </channel>
</rss>`;
});

export async function GET() {
	// Limit to last 50 articles for RSS feed
	const articles = await getPaginatedArticles({ limit: 50, offset: 0 });
	const rssXml = generateRssFeed(articles);

	return new Response(rssXml, {
		headers: {
			"Content-Type": "application/xml;charset=utf-8",
			"Cache-Control":
				"public, max-age=3600, stale-while-revalidate=7200",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
