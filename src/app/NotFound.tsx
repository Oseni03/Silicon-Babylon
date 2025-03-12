"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow flex items-center justify-center py-24">
				<div className="container px-6">
					<div className="max-w-md mx-auto text-center">
						{/* 404 Icon */}
						<div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center mb-8">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10"></circle>
								<path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
								<line x1="9" y1="9" x2="9.01" y2="9"></line>
								<line x1="15" y1="9" x2="15.01" y2="9"></line>
							</svg>
						</div>

						{/* Error Message */}
						<h1 className="text-4xl font-bold mb-4">404</h1>
						<h2 className="text-2xl font-medium mb-4">
							Page Not Found
						</h2>
						<p className="text-muted-foreground mb-8">
							Looks like our AI got a bit too creative and made
							this page disappear. Don't worry, we have plenty of
							real satirical content for you!
						</p>

						{/* Navigation Links */}
						<div className="space-y-4">
							<Link
								href="/"
								className="block w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
							>
								Back to Home
							</Link>
							<Link
								href="/archive"
								className="block w-full px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
							>
								Browse Articles
							</Link>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
