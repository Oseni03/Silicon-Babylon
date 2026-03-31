"use client";

import Link from "next/link";
import CTA from "@/components/CTA";
import ArticleInteractions from "@/components/ArticleInteractions";
import AnimatedSection from "@/components/AnimatedSection";
import { type Article } from "@/types/types";
import { cn } from "@/lib/utils";

interface ArticleViewProps {
	article: Article;
	relatedArticles?: Article[];
}

const ArticleView = ({ article, relatedArticles }: ArticleViewProps) => {
	const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<>
			<article className="container mx-auto px-4 md:px-6 py-12 md:py-24 overflow-hidden">
				<div className="max-w-4xl mx-auto">
					{/* Article header */}
					<AnimatedSection direction="up" distance={30}>
						<header className="mb-16 pb-12 border-b border-black">
						<div className="flex flex-col gap-8">
							<div className="flex items-center gap-4">
								{article.categories.map((category) => (
									<Link
										key={category.slug}
										href={`/category/${category.slug}`}
										className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground border-b border-foreground hover:text-primary transition-colors"
									>
										{category.name}
									</Link>
								))}
								<span className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground/40">
									{formattedDate}
								</span>
							</div>

							<h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight">
								{article.title}
							</h1>

							{article.originalUrl && (
								<div className="pt-4">
									<a
										href={article.originalUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="group inline-flex items-center text-[10px] uppercase tracking-widest font-black text-foreground/60 hover:text-foreground transition-colors"
									>
										<span>Read official story on TechCrunch</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="3"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="ml-2 transition-transform group-hover:translate-x-1"
										>
											<line x1="7" y1="17" x2="17" y2="7"></line>
											<polyline points="7 7 17 7 17 17"></polyline>
										</svg>
									</a>
								</div>
							)}
						</div>
					</header>
					</AnimatedSection>

					{/* Article content */}
					<div className="flex flex-col md:flex-row gap-12">
						<div className="w-full md:w-32 flex-shrink-0">
							<div className="sticky top-24 space-y-8">
								<div className="flex flex-col gap-2">
									<span className="text-[10px] uppercase tracking-widest font-black text-foreground/40 whitespace-nowrap">Shared By</span>
									<span className="text-xs font-serif italic text-foreground whitespace-nowrap">Babylon Scribes</span>
								</div>
							</div>
						</div>

						<div className="flex-1">
							<AnimatedSection delay={0.2} direction="none">
								<div
									className="prose prose-xl max-w-none prose-p:font-sans prose-p:text-foreground prose-p:leading-relaxed prose-headings:font-serif prose-headings:font-normal prose-a:text-foreground prose-a:decoration-primary prose-a:underline-offset-4 prose-blockquote:border-l-4 prose-blockquote:border-foreground prose-blockquote:italic prose-blockquote:font-serif"
									dangerouslySetInnerHTML={{ __html: article.content }}
								/>
							</AnimatedSection>

							{/* Interactions Section - Moved here for better positioning and responsiveness */}
							<AnimatedSection delay={0.4} className="mt-24 pt-16 border-t border-black">
								<ArticleInteractions articleId={article.id} />
							</AnimatedSection>
						</div>
					</div>

					{/* Related Articles Section */}
					{relatedArticles && relatedArticles.length > 0 && (
						<AnimatedSection delay={0.2} className="mt-24 pt-16 border-t border-black">
							<h2 className="text-sm uppercase tracking-[0.3em] font-black mb-12">
								Keep Reading
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
								{relatedArticles.map((related) => (
									<Link
										key={related.id}
										href={`/article/${related.slug}`}
										className="group block pb-8 border-b border-black/10"
									>
										<span className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-3 block">
											{new Date(related.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
										</span>
										<h3 className="text-2xl font-serif leading-tight group-hover:underline decoration-1 underline-offset-4 decoration-black">
											{related.title}
										</h3>
									</Link>
								))}
							</div>
						</AnimatedSection>
					)}

					{/* Bottom navigation */}
					<AnimatedSection className="mt-24 pt-12 border-t border-black flex flex-col md:flex-row justify-between items-center gap-8">
						<Link
							href="/"
							className="group flex flex-col items-center md:items-start gap-2"
						>
							<span className="text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">
								Back to Index
							</span>
							<div className="w-12 h-px bg-black group-hover:w-24 transition-all duration-500"></div>
						</Link>

						<Link
							href="/archive"
							className="group flex flex-col items-center md:items-end gap-2"
						>
							<span className="text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">
								Browse Archive
							</span>
							<div className="w-12 h-px bg-black group-hover:w-24 transition-all duration-500"></div>
						</Link>
					</AnimatedSection>
				</div>
			</article>

			<CTA />
		</>
	);
};

export default ArticleView;
