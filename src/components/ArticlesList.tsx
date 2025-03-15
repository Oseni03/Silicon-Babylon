"use client";

import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { getArticles } from "@/lib/db";
import { type Article } from "@/types/types";

const ArticlesList = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadArticles() {
			try {
				const data = await getArticles();
				setArticles(data);
			} catch (error) {
				console.error("Failed to fetch articles:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadArticles();
	}, []);

	if (isLoading) {
		return (
			<section className="container mx-auto px-6 py-16">
				<div className="animate-pulse space-y-4">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="h-40 bg-secondary rounded"
						></div>
					))}
				</div>
			</section>
		);
	}

	return (
		<section id="latest-articles" className="container mx-auto px-6 py-16">
			<div className="max-w-4xl mx-auto mb-12 text-center space-y-2">
				<h2 className="text-3xl font-medium tracking-tight">
					Latest Articles
				</h2>
				<p className="text-muted-foreground">
					Playful Perspectives on the Latest Tech Trends
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{articles.map((article, index) => (
					<ArticleCard
						key={article.slug}
						slug={article.slug}
						title={article.title}
						excerpt={article.content.substring(0, 150) + "..."}
						date={article.publishedAt.toISOString()}
						category={
							article.categories[0]?.name || "Uncategorized"
						}
						index={index}
					/>
				))}
			</div>
		</section>
	);
};

export default ArticlesList;
