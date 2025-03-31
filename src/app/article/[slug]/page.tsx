import { getArticleBySlug, getArticles, getRelatedArticles } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteName, siteUrl } from "@/lib/config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { cache } from "react";

const getArticle = cache(getArticleBySlug);

export async function generateStaticParams() {
	const articles = await getArticles();

	return articles.map((article) => ({
		slug: article.slug,
	}));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { slug } = await Promise.resolve(params);
	const article = await getArticle(slug);

	if (!article) {
		return {
			title: `Article Not Found - ${siteName}`,
		};
	}

	const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(
		article.title
	)}&width=1200&height=630`;

	const newKeywords = article.categories.map((article) => [`${article.name.toLocaleLowerCase()} articles`, `${article.name.toLowerCase()} news`]);

	return {
		title: `${article.title}`,
		description: article.content.substring(0, 160),
		keywords: [
			...article.keywords,
			...article.categories.map((cat) => cat.name.toLowerCase()),
			...newKeywords.flat(),
			siteName,
		].join(", "),
		openGraph: {
			title: article.title,
			description: article.content.substring(0, 160),
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
		const { slug } = await Promise.resolve(params);
		const article = await getArticle(slug);

		if (!article) {
			notFound();
		}

		const relatedArticles = await getRelatedArticles(
			article.id,
			article.categories.map((cat) => cat.id)
		);

		return (
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow pt-24">
					<ArticleView
						article={article}
						relatedArticles={relatedArticles}
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
