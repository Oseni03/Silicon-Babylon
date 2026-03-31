"use client";

import { useState, useEffect } from "react";
import { type Article, type Category } from "@/types/types";
import ArticlesGrid from "./ArticlesGrid";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AnimatedSection from "./AnimatedSection";

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
		<section className="container mx-auto px-4 md:px-6 py-8">
			<AnimatedSection direction="up" distance={30} className="mb-12">
				<Breadcrumb className="mb-8">
					<BreadcrumbList className="gap-2">
						<BreadcrumbItem>
							<BreadcrumbLink
								href="/"
								className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-black transition-colors"
							>
								Index
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="text-muted-foreground" />
						<BreadcrumbItem>
							<BreadcrumbPage className="text-[10px] uppercase tracking-widest font-black text-black">
								Archive
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6">
					Article Archive
				</h1>
				<div className="w-16 h-1 bg-black mb-8"></div>
				<p className="text-muted-foreground text-lg max-w-xl">
					Browse our complete collection of satirical tech articles.
				</p>
			</AnimatedSection>

			<AnimatedSection delay={0.2} direction="up" distance={20} className="max-w-5xl mb-12 space-y-8">
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
				<div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
					Found {filteredArticles.length} articles
					{selectedCategory && ` in ${selectedCategory}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</div>
			</AnimatedSection>

			{/* Articles grid */}
			<ArticlesGrid filteredArticles={filteredArticles} />
		</section>
	);
};

export default ArticleArchive;
