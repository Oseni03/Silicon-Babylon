import { getArticleBySlug, getArticles, getRelatedArticles } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteKeywords, siteName } from "@/lib/config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";

export async function generateStaticParams() {
	const articles = await getArticles();

	return articles.map((article) => ({
		slug: article.slug,
	}));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const { slug } = await Promise.resolve(params);
	const article = await getArticleBySlug(slug);

	if (!article) {
		return {
			title: `Article Not Found - ${siteName}`,
		};
	}

	return {
		title: `${article.title}`,
		description: article.content.substring(0, 160),
		keywords: [
			...article.keywords,
			...article.categories.map((cat) => cat.name.toLowerCase()),
			...siteKeywords,
			siteName,
		].join(", "),
	};
}

const Page = async ({ params }) => {
	try {
		const { slug } = await Promise.resolve(params);
		const article = await getArticleBySlug(slug);

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
