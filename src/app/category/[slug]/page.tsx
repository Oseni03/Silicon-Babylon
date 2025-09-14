"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound, useParams } from "next/navigation";
import ArticlesGrid from "@/components/ArticlesGrid";
import CTA from "@/components/CTA";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { unslugify } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Article } from "@/types/types";
import { getRandomAffiliate } from "@/lib/affiliates";
import { getPaginatedArticlesByCategory } from "@/lib/db";

interface PageProps {
	params: Promise<{ slug: string }>;
}

const Page = () => {
	const { slug } = useParams();
	const [articles, setArticles] = useState<Article[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const pageSize = 15;

	useEffect(() => {
		if (!slug) {
			return;
		}

		async function loadArticles() {
			try {
				setIsLoading(true);
				const data = await getPaginatedArticlesByCategory({
					categorySlug: slug as string,
					limit: pageSize,
					offset: (page - 1) * pageSize,
				});

				// If no articles found on first load, show 404
				if (page === 1 && data.length === 0) {
					notFound();
					return;
				}

				const withAffiliates = [];
				for (let i = 0; i < data.length; i++) {
					withAffiliates.push(data[i]);
					if ((i + 1) % 4 === 0) {
						withAffiliates.push(getRandomAffiliate());
					}
				}

				if (page === 1) {
					setArticles(withAffiliates);
				} else {
					setArticles((prev) => [...prev, ...withAffiliates]);
				}

				setHasMore(data.length === pageSize);
				setInitialLoadComplete(true);
			} catch (error) {
				console.error("Failed to fetch articles:", error);
				// Only show 404 if it's the first load and there's an error
				if (page === 1) {
					notFound();
				}
			} finally {
				setIsLoading(false);
			}
		}

		loadArticles();
	}, [slug, page]);

	// Show loading state during initial load
	if (!initialLoadComplete && isLoading) {
		return (
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow flex items-center justify-center">
					<div className="flex items-center space-x-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span>Loading articles...</span>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	// If no articles after initial load, this will be handled by notFound() in useEffect
	if (initialLoadComplete && articles.length === 0) {
		notFound();
	}

	const categoryName = unslugify(slug as string);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow pt-4 md:pt-8 pb-12 md:pb-16">
				<section className="container mx-auto px-3 md:px-6">
					<div className="mb-4 md:mb-8">
						<Breadcrumb className="mb-4 md:mb-6">
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink
										href="/"
										className="text-muted-foreground hover:text-foreground"
									>
										Home
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>
										{categoryName}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>

						<h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
							{categoryName} News
						</h1>
						<p className="text-muted-foreground text-lg">
							Browse our collection of satirical articles about{" "}
							{categoryName}
						</p>
					</div>

					<ArticlesGrid filteredArticles={articles} />
				</section>
				<div className="flex justify-center mt-4">
					{hasMore && (
						<Button
							variant="outline"
							size="lg"
							onClick={() => setPage((prev) => prev + 1)}
							disabled={isLoading}
						>
							{"Load More"}
							{isLoading && (
								<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							)}
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
