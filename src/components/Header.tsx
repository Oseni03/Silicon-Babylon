"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { siteName } from "@/lib/config";
import { usePathname } from "next/navigation";

const Header = () => {
	const [scrolled, setScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const { user, loading, signOut } = useAuth();
	const pathname = usePathname();

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

	const handleSignOut = async () => {
		try {
			await signOut();
			toast.success("Signed out successfully");
		} catch (error) {
			toast.error("Error signing out", {
				description: "There was a problem signing you out.",
			});
		}
	};

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-in-out",
				scrolled
					? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
					: "bg-transparent"
			)}
		>
			<div className="container mx-auto flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2 group">
					<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
						<span className="text-primary-foreground font-semibold text-lg">
							S
						</span>
					</div>
					<span
						className={cn(
							"font-medium text-xl tracking-tight transition-opacity",
							scrolled ? "opacity-100" : "opacity-100"
						)}
					>
						{siteName}
					</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center flex-1 justify-center">
					<nav className="flex items-center space-x-8">
						<Link
							href="/"
							className="text-sm font-medium hover:text-primary/80 transition-colors underline-animate"
						>
							Home
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium hover:text-primary/80 transition-colors underline-animate"
						>
							About
						</Link>
						<Link
							href="/archive"
							className="text-sm font-medium hover:text-primary/80 transition-colors underline-animate"
						>
							Archive
						</Link>
						<Link
							href="/contact"
							className="text-sm font-medium hover:text-primary/80 transition-colors underline-animate"
						>
							Contact
						</Link>
					</nav>
				</div>
				<div className="hidden md:flex items-center space-x-4">
					<ModeToggle />
					{loading ? (
						<div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
					) : user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full p-0"
								>
									<Avatar>
										<AvatarImage
											src={undefined}
											alt={user.username || "User avatar"}
										/>
										<AvatarFallback>
											{(
												user.username?.[0] || "U"
											).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={handleSignOut}>
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button
							variant="default"
							onClick={() => setIsAuthOpen(true)}
						>
							Sign In
						</Button>
					)}
				</div>

				{/* Mobile Menu Button */}
				<div className="flex md:hidden items-center space-x-2">
					<ModeToggle />
					{!loading && (
						<>
							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="relative h-8 w-8 rounded-full p-0"
										>
											<Avatar>
												<AvatarImage
													src={undefined}
													alt={
														user.username ||
														"User avatar"
													}
												/>
												<AvatarFallback>
													{(
														user.username?.[0] ||
														"U"
													).toUpperCase()}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={handleSignOut}
										>
											Sign Out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Button
									variant="default"
									size="sm"
									onClick={() => setIsAuthOpen(true)}
								>
									Sign In
								</Button>
							)}
						</>
					)}
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

			{/* Mobile Navigation Menu */}
			{isMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg animate-fade-in">
					<nav className="container mx-auto py-4 flex flex-col space-y-4 px-6">
						<Link
							href="/"
							className="text-base font-medium py-2 hover:text-primary transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							Home
						</Link>
						<Link
							href="/about"
							className="text-base font-medium py-2 hover:text-primary transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							About
						</Link>
						<Link
							href="/archive"
							className="text-base font-medium py-2 hover:text-primary transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							Archive
						</Link>
						<Link
							href="/contact"
							className="text-base font-medium py-2 hover:text-primary transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							Contact
						</Link>
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
