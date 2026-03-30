"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AuthModal from "./AuthModal";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/utils";
import { Logo } from "./Logo";
import { AuthAction } from "./AuthAction";
import { Button } from "./ui/button";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => {
			const offset = window.scrollY;
			setScrolled(offset > 30);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header className={cn(
			"relative z-50 w-full bg-background border-b border-black transition-all",
			scrolled ? "fixed top-0 left-0 right-0 py-2 shadow-none" : "py-4 md:py-6"
		)}>
			<div className="container mx-auto px-4 md:px-6">
				<div className="flex items-center justify-between gap-4">
					{/* Logo */}
					<Logo className="md:items-start" />

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center space-x-8">
						<Link href="/" className="text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors">
							All
						</Link>
						{categories.slice(0, 5).map((category) => (
							<Link
								key={category.slug}
								href={`/category/${category.slug}`}
								className="text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors"
							>
								{category.name}
							</Link>
						))}
					</nav>

					{/* Auth and CTA */}
					<div className="flex items-center gap-4">
						<div className="hidden md:block">
							<AuthAction setIsAuthOpen={setIsAuthOpen} />
						</div>
						<Button 
							size="sm" 
							className="bg-black text-white hover:bg-black/90 rounded-full px-6 py-5 uppercase text-[10px] font-bold tracking-widest hidden sm:flex"
							onClick={() => setIsAuthOpen(true)}
						>
							Subscribe
						</Button>

						{/* Mobile Menu Toggle */}
						<button
							className="lg:hidden p-2"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<div className="w-6 h-0.5 bg-black mb-1.5 transition-all"></div>
							<div className="w-6 h-0.5 bg-black mb-1.5 transition-all"></div>
							<div className="w-6 h-0.5 bg-black transition-all"></div>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Menu */}
			{isMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-black animate-fade-in z-50">
					<nav className="container mx-auto py-8 flex flex-col space-y-6 px-6 items-center">
						<Link
							href="/"
							className="text-xl font-serif hover:text-primary transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							All
						</Link>
						{categories.map((category) => (
							<Link
								key={category.slug}
								href={`/category/${category.slug}`}
								className="text-xl font-serif hover:text-primary transition-colors"
								onClick={() => setIsMenuOpen(false)}
							>
								{category.name}
							</Link>
						))}
						<div className="pt-4 w-full flex justify-center border-t border-black/10">
							<AuthAction setIsAuthOpen={setIsAuthOpen} />
						</div>
					</nav>
				</div>
			)}

			<AuthModal
				isOpen={isAuthOpen}
				onClose={() => setIsAuthOpen(false)}
				redirectPath={pathname}
			/>
		</header>
	);
};

export default Header;
