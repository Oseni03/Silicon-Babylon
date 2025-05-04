import { getArticleBySlug, getArticles, getRelatedArticles } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteName, siteUrl } from "@/lib/config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { cache } from "react";

// Cache the article fetch
const getArticle = cache(async (slug: string) => {
	const article = await getArticleBySlug(slug);
	if (!article) return null;

	// Only fetch related articles if the main article exists
	const relatedArticles = await getRelatedArticles(
		article.id,
		article.categories.map((cat) => cat.id),
		3 // Limit to 3 related articles for initial load
	);

	return { article, relatedArticles };
});

// Cache the static params generation
const getStaticParams = cache(async () => {
	const articles = await getArticles();
	return articles.map((article) => ({
		slug: article.slug,
	}));
});

export async function generateStaticParams() {
	return getStaticParams();
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { slug } = params;
	const data = await getArticle(slug);

	if (!data?.article) {
		return {
			title: `Article Not Found - ${siteName}`,
		};
	}

	const { article } = data;
	const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(
		article.title
	)}&width=1200&height=630`;

	const newKeywords = article.categories.map((category) => [
		`${category.name.toLowerCase()} articles`,
		`${category.name.toLowerCase()} news`
	]);

	return {
		title: article.title,
		description: article.description || article.content.substring(0, 160),
		keywords: [
			...article.keywords,
			...newKeywords.flat(),
			siteName,
		].join(", "),
		openGraph: {
			title: article.title,
			description: article.description || article.content.substring(0, 160),
			images: [{
				url: ogImageUrl.toString(),
				width: 1200,
				height: 630,
				alt: article.title
			}]
		}
	};
}

const Page = async ({ params }) => {
	try {
		const { slug } = params;
		const data = await getArticle(slug);

		if (!data?.article) {
			notFound();
		}

		return (
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow pt-4 md:pt-8">
					<ArticleView
						article={data.article}
						relatedArticles={data.relatedArticles}
					/>
				</main>
				<Footer />
			</div>
		);
	} catch (error) {
		notFound();
	}
};

export default Page;
