"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPaginatedArticles, getAllCategories } from "@/lib/db";
import { getRandomAffiliate } from "@/lib/affiliates";
import ArticleArchive from "@/components/ArticleArchive";
import CTA from "@/components/CTA";
import { Button } from "@/components/ui/button";
import { type Article, type Category } from "@/types/types";

const Page = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const pageSize = 15; // Number of articles per page

	useEffect(() => {
		async function loadInitialData() {
			try {
				const [articlesData, categoriesData] = await Promise.all([
					getPaginatedArticles({ limit: pageSize, offset: 0 }),
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
				setCategories(categoriesData);
				setHasMore(articlesData.length === pageSize);
			} catch (error) {
				console.error("Failed to load initial data:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadInitialData();
	}, []);

	const loadMore = async () => {
		setIsLoading(true);
		try {
			const newArticles = await getPaginatedArticles({
				limit: pageSize,
				offset: page * pageSize
			});

			const withAffiliates = [];
			for (let i = 0; i < newArticles.length; i++) {
				withAffiliates.push(newArticles[i]);
				if ((i + 1) % 4 === 0) {
					withAffiliates.push(getRandomAffiliate());
				}
			}

			setArticles(prev => [...prev, ...withAffiliates]);
			setHasMore(newArticles.length === pageSize);
			setPage(prev => prev + 1);
		} catch (error) {
			console.error("Failed to load more articles:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow pt-4 md:pt-8 pb-12 md:pb-16">
				<ArticleArchive
					initialArticles={articles}
					categories={categories}
				/>
				<div className="flex justify-center mt-4">
					{hasMore && (
						<Button
							variant="outline"
							size="lg"
							onClick={loadMore}
							disabled={isLoading}
						>
							{isLoading ? "Loading..." : "Load More"}
						</Button>
					)}
				</div>
			</main>
			<CTA />
			<Footer />
		</div>
	);
};

export default Page;
