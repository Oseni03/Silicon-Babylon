"use client";

import { getRandomAffiliate } from "@/lib/affiliates";
import { getPaginatedArticles } from "@/lib/db";
import { categories } from "@/lib/utils";
import { Article } from "@/types/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useArticle = (initialArticles: Article[]) => {
	const [articles, setArticles] = useState<Article[]>(initialArticles);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const [mainCategoryCount, setMainCategoryCount] = useState(8);
	const pathname = usePathname();
	const pageSize = 15;

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Scroll detection
	useEffect(() => {
		const handleScroll = () => {
			const offset = window.scrollY;
			setScrolled(offset > 30);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Responsive category count
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 768) {
				setMainCategoryCount(3);
			} else if (width < 1024) {
				setMainCategoryCount(5);
			} else {
				setMainCategoryCount(8);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const mainCategories = categories.slice(0, mainCategoryCount);
	const moreCategories = categories.slice(mainCategoryCount);

	// Load more articles
	useEffect(() => {
		async function loadMoreArticles() {
			if (page === 1) return;

			try {
				setIsLoading(true);
				const data = await getPaginatedArticles({
					limit: pageSize,
					offset: (page - 1) * pageSize,
				});

				const withAffiliates = [];
				for (let i = 0; i < data.length; i++) {
					withAffiliates.push(data[i]);
					if ((i + 1) % 4 === 0) {
						withAffiliates.push(getRandomAffiliate());
					}
				}

				const filtered = searchQuery
					? withAffiliates.filter(
							(article) =>
								article.title
									.toLowerCase()
									.includes(searchQuery.toLowerCase()) ||
								article.content
									.toLowerCase()
									.includes(searchQuery.toLowerCase()),
						)
					: withAffiliates;

				setArticles((prev) => [...prev, ...filtered]);
				setHasMore(data.length === pageSize);
			} catch (error) {
				console.error("Failed to fetch articles:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadMoreArticles();
	}, [page, searchQuery]);
	return {
		page,
		isAuthOpen,
		searchQuery,
		scrolled,
		isMenuOpen,
		mainCategories,
		moreCategories,
		pathname,
		isLoading,
		articles,
		hasMore,
		setSearchQuery,
		setIsAuthOpen,
		toggleMenu,
		setIsMenuOpen,
		setPage,
	};
};
