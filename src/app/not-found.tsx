"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NotFound = () => {
	const pathname = usePathname();

	useEffect(() => {
		console.error(
			"404 Error: User attempted to access non-existent route:",
			pathname
		);
	}, [pathname]);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow flex items-center justify-center px-6 py-32">
				<div className="max-w-md w-full text-center space-y-6">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
						<span className="text-2xl font-medium">404</span>
					</div>

					<h1 className="text-3xl font-medium">Page Not Found</h1>

					<p className="text-muted-foreground">
						We couldn't find the page you were looking for. Perhaps
						it was satirically removed.
					</p>

					<div className="pt-4">
						<Link
							href="/"
							className="inline-flex items-center justify-center rounded-md px-6 py-3 bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
						>
							Back to Home
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default NotFound;
