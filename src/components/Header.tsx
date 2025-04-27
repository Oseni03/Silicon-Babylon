"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AuthModal from "./AuthModal";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/utils";
import { Logo } from "./Logo";
import { AuthAction } from "./AuthAction";

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
		<header className="relative z-50 w-full">
			<div className={cn(
				"w-full py-2 md:py-4 px-4 md:px-6 transition-all duration-300 ease-in-out bg-background",
				scrolled ? "fixed top-0 left-0 right-0 shadow-sm border-b border-border" : ""
			)}>
				<div className="w-full bg-background py-1 md:py-2 md:px-6">
					<div className="container">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
							<Logo />
							<AuthAction setIsAuthOpen={setIsAuthOpen} />
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Menu */}
			{
				isMenuOpen && (
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
							<div className="pt-2 border-t border-border">
								<Link
									href="/newsletter"
									className="flex items-center text-base font-medium py-2 hover:text-primary transition-colors"
									onClick={() => setIsMenuOpen(false)}
								>
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
										className="mr-2"
									>
										<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
										<polyline points="22,6 12,13 2,6"></polyline>
									</svg>
									Newsletter
								</Link>
							</div>
						</nav>
					</div>
				)
			}

			<AuthModal
				isOpen={isAuthOpen}
				onClose={() => setIsAuthOpen(false)}
				redirectPath={pathname}
			/>
		</header>
	);
};

export default Header;
