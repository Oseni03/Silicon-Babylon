"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import { getArticleBySlug } from "@/lib/db";
import CTA from "@/components/CTA";
import { siteName } from "@/lib/config";
import ArticleInteractions from "@/components/ArticleInteractions";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface Article {
	id: string;
	slug: string;
	title: string;
	content: string;
	originalUrl: string;
	originalTitle: string;
	publishedAt: Date;
	categories: Category[];
}

const Page = () => {
	const { slug } = useParams<{ slug: string }>();
	const [article, setArticle] = useState<Article | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchArticle() {
			setIsLoading(true);
			try {
				const data = await getArticleBySlug(slug as string);
				if (data) {
					setArticle(data);
					// Update metadata
					const metaKeywords = [
						...data.keywords,
						...data.categories.map((cat) => cat.name.toLowerCase()),
						"satire",
						"tech news",
						"parody",
						siteName,
					];
					document.title = `${data.title} - SatiricTech`;

					// Strip HTML tags for meta description
					const tempDiv = document.createElement("div");
					tempDiv.innerHTML = data.content;
					const plainText =
						tempDiv.textContent || tempDiv.innerText || "";

					updateMetaTags(metaKeywords, plainText.substring(0, 160));
				} else {
					document.title = "Article Not Found - SatiricTech";
				}
			} catch (error) {
				console.error("Failed to fetch article:", error);
			} finally {
				setIsLoading(false);
			}
		}

		function updateMetaTags(keywords: string[], description: string) {
			// Update keywords meta tag
			let metaKeywords = document.querySelector('meta[name="keywords"]');
			if (!metaKeywords) {
				metaKeywords = document.createElement("meta");
				metaKeywords.setAttribute("name", "keywords");
				document.head.appendChild(metaKeywords);
			}
			metaKeywords.setAttribute("content", keywords.join(", "));

			// Update description meta tag
			let metaDescription = document.querySelector(
				'meta[name="description"]'
			);
			if (!metaDescription) {
				metaDescription = document.createElement("meta");
				metaDescription.setAttribute("name", "description");
				document.head.appendChild(metaDescription);
			}
			metaDescription.setAttribute("content", description);
		}

		if (slug) {
			fetchArticle();
		}
	}, [slug]);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow pt-24">
				{isLoading ? (
					<div className="container mx-auto px-6 py-24 text-center">
						<div className="animate-pulse space-y-4 max-w-3xl mx-auto">
							<div className="h-8 bg-secondary rounded w-3/4 mx-auto"></div>
							<div className="h-4 bg-secondary rounded w-1/4 mx-auto"></div>
							<div className="h-4 bg-secondary rounded w-1/3 mx-auto"></div>
							<div className="space-y-2 mt-10">
								<div className="h-4 bg-secondary rounded"></div>
								<div className="h-4 bg-secondary rounded"></div>
								<div className="h-4 bg-secondary rounded w-5/6"></div>
							</div>
						</div>
					</div>
				) : article ? (
					<>
						<article className="container mx-auto px-6 py-16">
							<div className="max-w-3xl mx-auto">
								{/* Top disclaimer */}
								<div className="mb-10 p-4 border border-border rounded-lg bg-secondary/30">
									<p className="text-sm text-muted-foreground text-center">
										This is AI-generated satire based on
										real tech news. Don't take it seriously!
										All content is algorithmically created
										for entertainment purposes only.
									</p>
								</div>

								{/* Article header */}
								<header className="mb-10 space-y-6">
									<h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-balance">
										{article.title}
									</h1>

									<div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-4 sm:gap-6">
										<time
											dateTime={article.publishedAt.toISOString()}
										>
											{new Date(
												article.publishedAt
											).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</time>

										<div className="flex items-center">
											<span className="flex-shrink-0 w-1 h-1 bg-muted-foreground/70 rounded-full hidden sm:block"></span>
											<span className="px-3 py-1 ml-0 sm:ml-6 text-xs rounded-full bg-secondary">
												{article.categories
													.map(
														(category) =>
															category.name
													)
													.join(", ")}
											</span>
										</div>
									</div>
								</header>

								{/* Original article link */}
								<div className="mb-10">
									<a
										href={article.originalUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center group text-sm font-medium transition-colors text-primary hover:text-primary/80"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="mr-2"
										>
											<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
											<polyline points="15 3 21 3 21 9"></polyline>
											<line
												x1="10"
												y1="14"
												x2="21"
												y2="3"
											></line>
										</svg>
										Read the real story on TechCrunch
										<span className="inline-block transition-transform group-hover:translate-x-1 ml-1">
											→
										</span>
									</a>
								</div>

								{/* Article content */}
								<div
									className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-headings:text-foreground"
									dangerouslySetInnerHTML={{
										__html: article.content,
									}}
								/>

								<ArticleInteractions articleId={article.id} />

								{/* Bottom navigation */}
								<div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
									<Link
										href="/"
										className="inline-flex items-center text-sm font-medium transition-colors text-primary hover:text-primary/80"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="mr-2"
										>
											<line
												x1="19"
												y1="12"
												x2="5"
												y2="12"
											></line>
											<polyline points="12 19 5 12 12 5"></polyline>
										</svg>
										Back to Home
									</Link>

									<Link
										href="/archive"
										className="inline-flex items-center text-sm font-medium transition-colors text-primary hover:text-primary/80"
									>
										Browse Archive
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="ml-2"
										>
											<line
												x1="5"
												y1="12"
												x2="19"
												y2="12"
											></line>
											<polyline points="12 5 19 12 12 19"></polyline>
										</svg>
									</Link>
								</div>
							</div>
						</article>

						<CTA />

						{/* Bottom disclaimer */}
						<div className="container mx-auto px-6 pb-16">
							<Disclaimer />
						</div>
					</>
				) : (
					<div className="container mx-auto px-6 py-24 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="8" x2="12" y2="12"></line>
									<line
										x1="12"
										y1="16"
										x2="12.01"
										y2="16"
									></line>
								</svg>
							</div>
							<h1 className="text-2xl font-medium mb-4">
								Article Not Found
							</h1>
							<p className="text-muted-foreground mb-8">
								We couldn't find the article you're looking for.
								It may have been removed or you might have
								followed a bad link.
							</p>
							<Link
								href="/archive"
								className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
							>
								Browse All Articles
							</Link>
						</div>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
};

export default Page;
