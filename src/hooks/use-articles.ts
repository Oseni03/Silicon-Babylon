"use client";

import { getRandomAffiliate } from "@/lib/affiliates";
import { getPaginatedArticles } from "@/lib/db";
import { categories } from "@/lib/utils";
import { Article } from "@/types/types";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";

export const useArticle = (initialArticles: Article[]) => {
	const [articles, setArticles] = useState<Article[]>(initialArticles);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const [mainCategoryCount, setMainCategoryCount] = useState(8);
	
	const pathname = usePathname();
	const pageSize = 15;

	const toggleMenu = useCallback(() => {
		setIsMenuOpen((prev) => !prev);
	}, []);

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchQuery);
		}, 500);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Scroll detection
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 30);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
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
		window.addEventListener("resize", handleResize, { passive: true });
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const mainCategories = useMemo(() => categories.slice(0, mainCategoryCount), [mainCategoryCount]);
	const moreCategories = useMemo(() => categories.slice(mainCategoryCount), [mainCategoryCount]);

	// Reset and load articles on search change
	useEffect(() => {
		const fetchInitialArticles = async () => {
			if (debouncedSearch === "" && page === 1) {
				setArticles(initialArticles);
				setHasMore(true);
				return;
			}

			try {
				setIsLoading(true);
				setPage(1); // Reset page on new search
				const data = await getPaginatedArticles({
					limit: pageSize,
					offset: 0,
					search: debouncedSearch,
				});

				const withAffiliates = insertAffiliates(data);
				setArticles(withAffiliates);
				setHasMore(data.length === pageSize);
			} catch (error) {
				console.error("Failed to fetch initial search articles:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchInitialArticles();
	}, [debouncedSearch]);

	// Load more articles
	useEffect(() => {
		if (page === 1) return;

		async function loadMoreArticles() {
			try {
				setIsLoading(true);
				const data = await getPaginatedArticles({
					limit: pageSize,
					offset: (page - 1) * pageSize,
					search: debouncedSearch,
				});

				const withAffiliates = insertAffiliates(data);
				setArticles((prev) => [...prev, ...withAffiliates]);
				setHasMore(data.length === pageSize);
			} catch (error) {
				console.error("Failed to fetch more articles:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadMoreArticles();
	}, [page, debouncedSearch]);

	const insertAffiliates = (data: Article[]) => {
		const result = [];
		for (let i = 0; i < data.length; i++) {
			result.push(data[i]);
			if ((i + 1) % 4 === 0) {
				result.push(getRandomAffiliate());
			}
		}
		return result;
	};

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
