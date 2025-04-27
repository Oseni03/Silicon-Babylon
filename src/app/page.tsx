"use client";

import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { getArticles } from "@/lib/db";
import { type Article } from "@/types/types";
import { getRandomAffiliate } from "@/lib/affiliates";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AuthModal from "@/components/AuthModal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { SearchPopover } from "@/components/SearchPopover";
import { Logo } from "@/components/Logo";
import { AuthAction } from "@/components/AuthAction";
import { categories } from "@/lib/utils";

const Page = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [scrolled, setScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const pathname = usePathname();
	const currentDate = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

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

	const [mainCategoryCount, setMainCategoryCount] = useState(8);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 768) { // mobile
				setMainCategoryCount(3);
			} else if (width < 1024) { // tablet
				setMainCategoryCount(5);
			} else { // desktop
				setMainCategoryCount(8);
			}
		};

		handleResize(); // Initial check
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Adjust categories based on screen size
	const mainCategories = categories.slice(0, mainCategoryCount);
	const moreCategories = categories.slice(mainCategoryCount);

	useEffect(() => {
		async function loadArticles() {
			try {
				const data = await getArticles();
				const withAffiliates = [];
				for (let i = 0; i < data.length; i++) {
					withAffiliates.push(data[i]);
					if ((i + 1) % 4 === 0) {
						withAffiliates.push(getRandomAffiliate());
					}
				}
				setArticles(withAffiliates);
			} catch (error) {
				console.error("Failed to fetch articles:", error);
			} finally {
				setIsLoading(false);
			}
		}

		loadArticles();
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<header className="relative z-50 w-full">

				{/* Main header with logo and navigation */}
				<div className={cn(
					"w-full py-4 px-6 transition-all duration-300 ease-in-out bg-background",
					scrolled ? "sticky top-0 shadow-sm border-b border-border" : ""
				)}>
					<div className="container mx-auto">
						{/* Logo section */}
						<Logo />

						<div className="w-full bg-background py-2 px-6">
							<div className="container mx-auto flex items-center justify-between text-sm">

								<div className="flex items-center">
									<span className="mr-2 hidden md:block">{currentDate}</span>
								</div>

								<div className="hidden md:block">
									<AuthAction setIsAuthOpen={setIsAuthOpen} />

								</div>
								<div className="w-full flex justify-between md:hidden">
									<AuthAction setIsAuthOpen={setIsAuthOpen} />
									{/* Mobile Menu Button */}
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
														<line x1="18" y1="6" x2="6" y2="18" />
														<line x1="6" y1="6" x2="18" y2="18" />
													</>
												) : (
													<>
														<line x1="4" x2="20" y1="12" y2="12" />
														<line x1="4" x2="20" y1="6" y2="6" />
														<line x1="4" x2="20" y1="18" y2="18" />
													</>
												)}
											</svg>
										</button>
									</div>

								</div>
							</div>
						</div>

						{/* Navigation section */}
						<div className="flex items-center justify-between">
							{/* Desktop Navigation */}
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
												<button type="button" className="text-base font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary py-1 flex items-center">
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
												{moreCategories.map((category) => (
													<DropdownMenuItem key={category.slug}>
														<Link href={`/category/${category.slug}`}>
															{category.name}
														</Link>
													</DropdownMenuItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>
									)}

									<SearchPopover filteredArticles={articles} setFilteredArticles={setArticles} />
								</nav>
							</div>

						</div>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
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
			<main className="flex-grow">
				<section id="latest-articles" className="container mx-auto px-4 md:px-6 pt-4 md:pt-8 pb-12 md:pb-16">
					{isLoading ? (
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
									excerpt={article.description || article.content.substring(0, 200) + "..."}
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
				<CTA />
			</main>
			<Footer />
		</div>
	);
};

export default Page;
