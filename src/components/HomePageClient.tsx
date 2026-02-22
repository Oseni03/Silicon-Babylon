"use client";

import ArticleCard from "@/components/ArticleCard";
import AuthModal from "@/components/AuthModal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { AuthAction } from "@/components/AuthAction";
import { categories } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Article } from "@/types/types";
import { useArticle } from "@/hooks/use-articles";

interface HomePageClientProps {
	initialArticles: Article[];
}

export default function HomePageClient({
	initialArticles,
}: HomePageClientProps) {
	const {
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
	} = useArticle(initialArticles);

	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const searchComponent = (
		<Popover>
			<PopoverTrigger asChild>
				<button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors duration-200">
					<Search className="w-4 h-4" />
					<span>Search</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search articles..."
						className="w-full pl-9 pr-4 py-3 text-sm rounded-md border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				{searchQuery && (
					<div className="p-2 text-xs text-muted-foreground border-t">
						Press enter to search
					</div>
				)}
			</PopoverContent>
		</Popover>
	);

	return (
		<>
			<header className="relative z-50 w-full">
				<div
					className={cn(
						"w-full py-4 px-6 transition-all duration-300 ease-in-out bg-background",
						scrolled
							? "sticky top-0 shadow-sm border-b border-border"
							: "",
					)}
				>
					<div className="container mx-auto">
						<Logo />

						<div className="w-full bg-background py-2 px-6">
							<div className="container mx-auto flex items-center justify-between text-sm">
								<div className="flex items-center">
									<span className="mr-2 hidden md:block">
										{currentDate}
									</span>
								</div>

								<div className="hidden md:block">
									<AuthAction setIsAuthOpen={setIsAuthOpen} />
								</div>
								<div className="w-full flex justify-between md:hidden">
									<AuthAction setIsAuthOpen={setIsAuthOpen} />
									<div className="md:hidden flex items-center">
										<button
											className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
											aria-label="Toggle menu"
											onClick={toggleMenu}
										>
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
												{isMenuOpen ? (
													<>
														<line
															x1="18"
															y1="6"
															x2="6"
															y2="18"
														/>
														<line
															x1="6"
															y1="6"
															x2="18"
															y2="18"
														/>
													</>
												) : (
													<>
														<line
															x1="4"
															x2="20"
															y1="12"
															y2="12"
														/>
														<line
															x1="4"
															x2="20"
															y1="6"
															y2="6"
														/>
														<line
															x1="4"
															x2="20"
															y1="18"
															y2="18"
														/>
													</>
												)}
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="hidden md:flex items-center justify-center flex-1">
								<nav className="flex items-center space-x-8">
									{mainCategories.map((category) => (
										<Link
											key={category.slug}
											href={`/category/${category.slug}`}
											className="text-base font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1"
										>
											{category.name}
										</Link>
									))}
									{moreCategories.length > 0 && (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													className="text-base font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1 flex items-center"
												>
													More
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="ml-1"
													>
														<polyline points="6 9 12 15 18 9"></polyline>
													</svg>
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												{moreCategories.map(
													(category) => (
														<DropdownMenuItem
															key={category.slug}
														>
															<Link
																href={`/category/${category.slug}`}
															>
																{category.name}
															</Link>
														</DropdownMenuItem>
													),
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									)}

									{searchComponent}
								</nav>
							</div>
						</div>
					</div>
				</div>

				{isMenuOpen && (
					<div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-fade-in z-50">
						<nav className="container mx-auto py-4 flex flex-col space-y-3 px-6">
							{categories.map((category) => (
								<Link
									key={category.slug}
									href={`/category/${category.slug}`}
									className="text-base font-medium py-2 hover:text-primary transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
									{category.name}
								</Link>
							))}
						</nav>
					</div>
				)}

				<AuthModal
					isOpen={isAuthOpen}
					onClose={() => setIsAuthOpen(false)}
					redirectPath={pathname}
				/>
			</header>

			<section className="container mx-auto px-4 md:px-6 pt-4 md:pt-8 pb-12 md:pb-16">
				{isLoading && page === 1 ? (
					<div className="animate-pulse space-y-4">
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className="h-40 bg-secondary rounded"
							></div>
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{articles.map((article, index) => (
							<ArticleCard
								key={`${article.slug}-${index}`}
								slug={article.slug}
								title={article.title}
								excerpt={
									article.description ||
									article.content.substring(0, 200) + "..."
								}
								date={article.publishedAt.toISOString()}
								categories={article.categories}
								index={index}
								isAffiliate={article.isAffiliate}
								originalUrl={article.originalUrl}
							/>
						))}
					</div>
				)}
			</section>

			<div className="flex justify-center mt-4">
				{hasMore && (
					<Button
						variant="outline"
						size="lg"
						onClick={() => setPage(page + 1)}
						disabled={isLoading}
					>
						{"Load More"}
						{isLoading && (
							<Loader2 className="ml-2 h-4 w-4 animate-spin" />
						)}
					</Button>
				)}
			</div>
		</>
	);
}
