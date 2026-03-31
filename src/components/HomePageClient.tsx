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
import AnimatedSection from "@/components/AnimatedSection";

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
                <button className="flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest font-bold hover:text-primary transition-colors">
                    <Search className="w-3 h-3" />
                    <span>Search</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-none border-black shadow-none" align="end">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full pl-9 pr-4 py-4 text-sm rounded-none border-0 bg-background focus:outline-none focus:ring-0 transition-all font-sans"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );

    const featuredArticle = articles?.[0];
    const moreArticles = articles?.slice(1);

    return (
        <>
            <header className={cn(
                "relative z-50 w-full bg-background border-b border-black transition-all",
                scrolled ? "sticky top-0 py-2 shadow-none" : "py-4 md:py-8"
            )}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <Logo className="md:items-start" />
                            <div className="flex items-center gap-4">
                                <div className="hidden md:block">
                                    <AuthAction setIsAuthOpen={setIsAuthOpen} />
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 py-5 uppercase text-[10px] font-bold tracking-widest hidden sm:flex"
                                    onClick={() => setIsAuthOpen(true)}
                                >
                                    Subscribe
                                </Button>
                                <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
                                    <div className="w-6 h-0.5 bg-black mb-1.5"></div>
                                    <div className="w-6 h-0.5 bg-black mb-1.5"></div>
                                    <div className="w-6 h-0.5 bg-black"></div>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold hidden md:block">
                                {currentDate}
                            </span>

                            <nav className="hidden md:flex items-center space-x-8">
                                <Link href="/" className={cn(
                                    "text-[10px] uppercase tracking-widest font-black hover:text-primary transition-colors",
                                    !pathname.includes("/category/") && "border-b-2 border-black"
                                )}>
                                    All
                                </Link>
                                {mainCategories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        href={`/category/${category.slug}`}
                                        className="text-[10px] uppercase tracking-widest font-black hover:text-primary transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                                {moreCategories.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="text-[10px] uppercase tracking-widest font-black flex items-center hover:text-primary transition-colors">
                                                More
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="rounded-none border-black">
                                            {moreCategories.map((category) => (
                                                <DropdownMenuItem key={category.slug}>
                                                    <Link href={`/category/${category.slug}`} className="w-full text-[10px] uppercase tracking-widest font-black">
                                                        {category.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </nav>

                            <div className="flex-1 md:flex-none flex justify-end">
                                {searchComponent}
                            </div>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-black animate-fade-in z-50">
                        <nav className="container mx-auto py-8 flex flex-col space-y-6 px-6 items-center">
                            <Link href="/" className="text-xl font-serif" onClick={() => setIsMenuOpen(false)}>All</Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/category/${category.slug}`}
                                    className="text-xl font-serif"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            <main className="container mx-auto px-4 md:px-6 py-12">
                {isLoading && page === 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-96 bg-gray-100 animate-pulse border-b border-black pb-8"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Featured Hero Article */}
                        {featuredArticle && page === 1 && !searchQuery && (
                            <AnimatedSection direction="up" distance={30} className="pb-16 text-foreground">
                                <ArticleCard
                                    slug={featuredArticle.slug}
                                    title={featuredArticle.title}
                                    excerpt={featuredArticle.description || featuredArticle.content.substring(0, 250) + "..."}
                                    date={new Date(featuredArticle.publishedAt).toISOString()}
                                    categories={featuredArticle.categories}
                                    index={0}
                                    isAffiliate={featuredArticle.isAffiliate}
                                    originalUrl={featuredArticle.originalUrl}
                                    image={featuredArticle.image}
                                />
                            </AnimatedSection>
                        )}

                        {/* Article Grid */}
                        <AnimatedSection delay={0.2} direction="none" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                            {(page === 1 && !searchQuery ? moreArticles : articles).map((article, index) => (
                                <ArticleCard
                                    key={`${article.slug}-${index}`}
                                    slug={article.slug}
                                    title={article.title}
                                    excerpt={article.description || article.content.substring(0, 200) + "..."}
                                    date={new Date(article.publishedAt).toISOString()}
                                    categories={article.categories}
                                    index={index + 1}
                                    isAffiliate={article.isAffiliate}
                                    originalUrl={article.originalUrl}
                                    image={article.image}
                                />
                            ))}
                        </AnimatedSection>
                    </div>
                )}

                <div className="flex justify-center mt-20">
                    {hasMore && (
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={isLoading}
                            className="group flex flex-col items-center gap-2"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-primary transition-colors">
                                {isLoading ? "Loading..." : "Load More"}
                            </span>
                            <div className="w-12 h-px bg-black group-hover:w-24 transition-all duration-500"></div>
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-black/40 mr-2 inline" />}
                        </button>
                    )}
                </div>
            </main>

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                redirectPath={pathname}
            />
        </>
    );
}
