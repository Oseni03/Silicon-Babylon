"use client";

import { useState, useEffect } from "react";
import ArticleCard from "@/components/ArticleCard";
import { type Article, type Category } from "@/types/types";

interface ArticleArchiveProps {
	initialArticles: Article[];
	categories: Category[];
}

const ArticleArchive = ({
	initialArticles,
	categories,
}: ArticleArchiveProps) => {
	const [filteredArticles, setFilteredArticles] =
		useState<Article[]>(initialArticles);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		// Filter articles based on category and search query
		let filtered = [...initialArticles];

		if (selectedCategory) {
			filtered = filtered.filter((article) =>
				article.categories.some(
					(category) => category.slug === selectedCategory
				)
			);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(article) =>
					article.title.toLowerCase().includes(query) ||
					article.content.toLowerCase().includes(query)
			);
		}

		setFilteredArticles(filtered);
	}, [selectedCategory, searchQuery, initialArticles]);

	return (
		<section className="container mx-auto px-6 py-16">
			<div className="max-w-4xl mx-auto text-center mb-12 space-y-2">
				<h1 className="text-4xl font-medium tracking-tight">
					Article Archive
				</h1>
				<p className="text-muted-foreground">
					Browse our complete collection of satirical tech articles
				</p>
			</div>

			<div className="max-w-5xl mx-auto mb-10 space-y-6">
				{/* Search and filters */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-grow">
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
						<input
							type="text"
							placeholder="Search articles..."
							className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<select
						aria-label="Filter articles by category"
						className="px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
						value={selectedCategory || ""}
						onChange={(e) =>
							setSelectedCategory(e.target.value || null)
						}
					>
						<option value="">All Categories</option>
						{categories.map((category) => (
							<option key={category.slug} value={category.slug}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				{/* Results info */}
				<div className="text-sm text-muted-foreground">
					Showing {filteredArticles.length} articles
					{selectedCategory && ` in ${selectedCategory}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</div>
			</div>

			{/* Articles grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredArticles.length > 0 ? (
					filteredArticles.map((article, index) => (
						<ArticleCard
							key={`${article.slug}-${index}`}
							title={article.title}
							excerpt={article.content.substring(0, 200) + "..."}
							date={article.publishedAt.toString()}
							category={article.categories
								.map((category) => category.name)
								.join(", ")}
							index={index}
							slug={article.slug}
							isAffiliate={article.isAffiliate}
							originalUrl={article.originalUrl}
						/>
					))
				) : (
					<div className="col-span-full text-center py-12">
						{/* ... existing no results UI code ... */}
					</div>
				)}
			</div>
		</section>
	);
};

export default ArticleArchive;
