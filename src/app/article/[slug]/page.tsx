import { getArticleBySlug } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteKeywords, siteName } from "@/lib/config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
	const articles = await prisma.article.findMany({
		select: {
			slug: true,
		},
	});

	return articles.map((article) => ({
		slug: article.slug,
	}));
}

interface Props {
	params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	try {
		const { slug } = await Promise.resolve(params);
		const article = await getArticleBySlug(slug);

		if (!article) {
			return {
				title: `Article Not Found - ${siteName}`,
			};
		}

		// Create temporary div server-side
		const div = new DOMParser().parseFromString(
			article.content,
			"text/html"
		);
		const plainText = div.body.textContent || "";

		return {
			title: `${article.title} - ${siteName}`,
			description: plainText.substring(0, 160),
			keywords: [
				...article.keywords,
				...article.categories.map((cat) => cat.name.toLowerCase()),
				...siteKeywords,
				siteName,
			].join(", "),
		};
	} catch (error) {
		return {
			title: `Error - ${siteName}`,
		};
	}
}

const Page = async ({ params }: Props) => {
	try {
		const { slug } = await Promise.resolve(params);
		const article = await getArticleBySlug(slug);

		if (!article) {
			notFound();
		}

		return (
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow pt-24">
					<ArticleView article={article} />
				</main>
				<Footer />
			</div>
		);
	} catch (error) {
		notFound();
	}
};

export default Page;
