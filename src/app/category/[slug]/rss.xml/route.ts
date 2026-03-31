import { getArticlesByCategory } from "@/lib/db";
import { siteName, siteUrl } from "@/lib/config";
import { escapeXml, stripHtml } from "@/lib/utils/xml";
import { type Article } from "@/types/types";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }) {
	const { slug } = await params;
	const articles = await getArticlesByCategory(slug);

	if (!articles.length) {
		return new Response("Not Found", {
			status: 404,
			headers: {
				"Content-Type": "text/plain",
			},
		});
	}

	const rssXml = generateCategoryFeed(articles, slug);

	return new Response(rssXml, {
		headers: {
			"Content-Type": "application/xml;charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}

function generateCategoryFeed(
	articles: Article[],
	categoryName: string
): string {
	const latestPost = articles[0];
	const lastBuildDate = new Date(
		latestPost?.publishedAt || new Date()
	).toUTCString();

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(`${siteName} - ${categoryName}`)}</title>
    <link>${escapeXml(`${siteUrl}/category/${categoryName}`)}</link>
    <description>Mythical takes on ${categoryName} news and trends</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(
		`${siteUrl}/rss/${categoryName}`
	)}" rel="self" type="application/rss+xml"/>
    ${articles
		.map((article) => {
			const plainTextContent = stripHtml(article.content);
			const summary =
				article.description || plainTextContent.length > 500
					? plainTextContent.substring(0, 497) + "..."
					: plainTextContent;
			const imageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(
				article.title
			)}`;

			return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(`${siteUrl}/article/${article.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(
			`${siteUrl}/article/${article.slug}`
		)}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(summary)}</description>
      <media:content 
        url="${escapeXml(imageUrl)}"
        medium="image"
        type="image/png"
        width="1000"
        height="1500"
      />
      ${article.categories
			.map((cat) => `<category>${escapeXml(cat.name)}</category>`)
			.join("")}
    </item>`;
		})
		.join("")}
  </channel>
</rss>`;
}
