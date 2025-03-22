"use client";

import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";
import CTA from "@/components/CTA";
import ArticleInteractions from "@/components/ArticleInteractions";
import { type Article } from "@/types/types";

interface ArticleViewProps {
	article: Article;
}

const ArticleView = ({ article }: ArticleViewProps) => {
	return (
		<>
			<article className="container mx-auto px-6 py-16">
				<div className="max-w-3xl mx-auto">
					{/* Top disclaimer */}
					<div className="mb-10 p-4 border border-border rounded-lg bg-secondary/30">
						<p className="text-sm text-muted-foreground text-center">
							This is AI-generated satire based on real tech news.
							Don't take it seriously! All content is
							algorithmically created for entertainment purposes
							only.
						</p>
					</div>

					{/* Article header */}
					<header className="mb-10 space-y-6">
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-balance">
							{article.title}
						</h1>

						<div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-4 sm:gap-6">
							<time dateTime={article.publishedAt.toISOString()}>
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
										.map((category) => category.name)
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
								<line x1="10" y1="14" x2="21" y2="3"></line>
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
						dangerouslySetInnerHTML={{ __html: article.content }}
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
								<line x1="19" y1="12" x2="5" y2="12"></line>
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
								<line x1="5" y1="12" x2="19" y2="12"></line>
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
	);
};

export default ArticleView;
