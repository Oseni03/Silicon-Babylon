import { NextResponse } from "next/server";
import { getArticlesByCategory } from "@/lib/db"; // Removed getAllCategories since it's not needed
import { siteName, siteUrl } from "@/lib/config";
import { escapeXml, stripHtml } from "@/lib/utils/xml";

export const dynamic = "force-dynamic"; // Keep this for dynamic rendering
export const dynamicParams = true; // Allow all dynamic params (no pre-defined list)

type Props = {
	params: {
		category: string;
	};
};

export async function GET(
	_request: Request,
	{ params }: Props
): Promise<Response> {
	try {
		const { category } = await params; // Destructure params safely
		const articles = await getArticlesByCategory(category);

		if (!articles.length) {
			return new NextResponse("Not Found", { status: 404 });
		}

		const categoryName = articles[0]?.categories[0]?.name || category;
		const rssXml = generateCategoryFeed(articles, categoryName);

		return new NextResponse(rssXml, {
			headers: {
				"Content-Type": "application/rss+xml",
				"Cache-Control": "public, max-age=3600",
			},
		});
	} catch (error) {
		console.error("Error generating RSS feed:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

function generateCategoryFeed(articles: any[], categoryName: string): string {
	const latestPost = articles[0];
	const lastBuildDate = new Date(
		latestPost?.publishedAt || new Date()
	).toUTCString();

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(`${siteName} - ${categoryName}`)}</title>
    <link>${escapeXml(`${siteUrl}/archive?category=${categoryName}`)}</link>
    <description>Satirical takes on ${categoryName} news and trends</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(
		`${siteUrl}/rss/${categoryName}.xml`
	)}" rel="self" type="application/rss+xml"/>
    ${articles
		.map((article) => {
			const plainTextContent = stripHtml(article.content);
			const summary =
				plainTextContent.length > 500
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
