"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPaginatedArticles } from "@/lib/db";
import { getRandomAffiliate } from "@/lib/affiliates";
import ArticleArchive from "@/components/ArticleArchive";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { type Article, type Category } from "@/types/types";

interface ArchiveClientProps {
	initialArticles: Article[];
	categories: Category[];
}

const PAGE_SIZE = 15;

export default function ArchiveClient({
	initialArticles,
	categories,
}: ArchiveClientProps) {
	// Function to fetch a page of articles
	const fetchArticles = async ({ pageParam = 1 }) => {
		const newArticles = await getPaginatedArticles({
			limit: PAGE_SIZE,
			offset: pageParam * PAGE_SIZE,
		});

		const withAffiliates = [];
		for (let i = 0; i < newArticles.length; i++) {
			withAffiliates.push(newArticles[i]);
			// Insert affiliate content every 4 articles
			if ((i + 1) % 4 === 0) {
				withAffiliates.push(getRandomAffiliate());
			}
		}

		return {
			data: withAffiliates,
			nextPage: newArticles.length === PAGE_SIZE ? pageParam + 1 : undefined,
		};
	};

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ["archive-articles"],
		queryFn: fetchArticles,
		initialPageParam: 0,
		// We use 0 as the initial page param since the server fetched offset 0.
		// Our next fetch should be pageParam = 1 (offset = 15).
		initialData: {
			pages: [
				{
					data: initialArticles,
					nextPage: initialArticles.length >= PAGE_SIZE ? 1 : undefined,
				},
			],
			pageParams: [0],
		},
		getNextPageParam: (lastPage) => lastPage.nextPage,
	});

	// Flatten all pages into a single array of articles
	const allArticles = data?.pages.flatMap((page) => page.data) || initialArticles;

	return (
		<>
			<ArticleArchive
				initialArticles={allArticles as Article[]}
				categories={categories}
			/>
			<div className="flex justify-center mt-4">
				{hasNextPage && (
					<Button
						variant="outline"
						size="lg"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? (
							<>
								Loading...
								<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							</>
						) : (
							"Load More"
						)}
					</Button>
				)}
			</div>
		</>
	);
}
