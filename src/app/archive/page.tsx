"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { getArticles, getAllCategories } from "@/lib/db";
import { type Article, type Category } from "@/types/types";
import { siteName, siteKeywords } from "@/lib/config";
import { getRandomAffiliate } from "@/lib/affiliates";

const Page = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			try {
				const [articlesData, categoriesData] = await Promise.all([
					getArticles(),
					getAllCategories(),
				]);

				// Insert affiliate content every 4 articles
				const withAffiliates = [];
				for (let i = 0; i < articlesData.length; i++) {
					withAffiliates.push(articlesData[i]);
					if ((i + 1) % 4 === 0) {
						withAffiliates.push(getRandomAffiliate());
					}
				}

				setArticles(withAffiliates);
				setFilteredArticles(withAffiliates);
				setCategories(categoriesData);

				// Update meta tags with categories
				const categoryKeywords = categoriesData.map((cat) =>
					cat.name.toLowerCase()
				);
				const metaKeywords = [
					...categoryKeywords,
					"tech satire archive",
					"satirical tech articles",
					"tech news parody collection",
					...siteKeywords,
				];
				updateMetaTags(metaKeywords);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			} finally {
				setIsLoading(false);
			}
		}

		function updateMetaTags(keywords: string[]) {
			let metaKeywords = document.querySelector('meta[name="keywords"]');
			if (!metaKeywords) {
				metaKeywords = document.createElement("meta");
				metaKeywords.setAttribute("name", "keywords");
				document.head.appendChild(metaKeywords);
			}
			metaKeywords.setAttribute("content", keywords.join(", "));
		}

		loadData();
		document.title = `Archive - ${siteName}`;
	}, []);

	useEffect(() => {
		// Filter articles based on category and search query
		let filtered = [...articles];

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
	}, [selectedCategory, searchQuery, articles]);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow pt-24">
				<section className="container mx-auto px-6 py-16">
					<div className="max-w-4xl mx-auto text-center mb-12 space-y-2">
						<h1 className="text-4xl font-medium tracking-tight">
							Article Archive
						</h1>
						<p className="text-muted-foreground">
							Browse our complete collection of satirical tech
							articles
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
									<line
										x1="21"
										y1="21"
										x2="16.65"
										y2="16.65"
									></line>
								</svg>
								<input
									type="text"
									placeholder="Search articles..."
									className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
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
									<option
										key={category.slug}
										value={category.slug}
									>
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
									excerpt={
										article.content.substring(0, 200) +
										"..."
									}
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
								<div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
										<path d="M8 15h8"></path>
										<path d="M9 9h.01"></path>
										<path d="M15 9h.01"></path>
									</svg>
								</div>
								<h2 className="text-xl font-medium mb-2">
									No articles found
								</h2>
								<p className="text-muted-foreground">
									Try adjusting your search or filter to find
									what you're looking for.
								</p>
							</div>
						)}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default Page;
