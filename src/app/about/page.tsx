"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { siteName } from "@/lib/config";

const Page = () => {
	const [isVisible, setIsVisible] = useState({
		section1: false,
		section2: false,
		section3: false,
	});

	const section1Ref = useRef<HTMLDivElement>(null);
	const section2Ref = useRef<HTMLDivElement>(null);
	const section3Ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.title = `About - ${siteName}`;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target === section1Ref.current) {
							setIsVisible((prev) => ({
								...prev,
								section1: true,
							}));
						} else if (entry.target === section2Ref.current) {
							setIsVisible((prev) => ({
								...prev,
								section2: true,
							}));
						} else if (entry.target === section3Ref.current) {
							setIsVisible((prev) => ({
								...prev,
								section3: true,
							}));
						}
						observer.unobserve(entry.target);
					}
				});
			},
			{
				root: null,
				rootMargin: "0px",
				threshold: 0.1,
			}
		);

		if (section1Ref.current) observer.observe(section1Ref.current);
		if (section2Ref.current) observer.observe(section2Ref.current);
		if (section3Ref.current) observer.observe(section3Ref.current);

		return () => {
			if (section1Ref.current) observer.unobserve(section1Ref.current);
			if (section2Ref.current) observer.unobserve(section2Ref.current);
			if (section3Ref.current) observer.unobserve(section3Ref.current);
		};
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow pt-8">
				<section className="container mx-auto px-6 py-16">
					<div className="max-w-3xl mx-auto">
						<div className="text-center space-y-4 mb-16">
							<div className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium">
								About Us
							</div>
							<h1 className="text-4xl font-medium tracking-tight">
								The Story Behind {siteName}
							</h1>
							<p className="text-lg text-muted-foreground">
								Where technology and creativity come together
							</p>
						</div>

						<div
							ref={section1Ref}
							className={cn(
								"space-y-8 animate-on-scroll fade-in",
								isVisible.section1 && "active"
							)}
						>
							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									Our Mission
								</h2>
								<p>
									{siteName} was created to bring a fresh and
									unique perspective to the world of
									technology. In a rapidly evolving industry,
									we aim to provide content that informs,
									entertains, and inspires.
								</p>
								<p>
									Our mission is to explore the latest tech
									trends, industry movements, and product
									launches with a creative lens. We believe
									that technology is not just about innovation
									– it's about understanding its impact on our
									lives and the world around us.
								</p>
							</div>
						</div>

						<div
							ref={section2Ref}
							className={cn(
								"space-y-8 mt-16 animate-on-scroll fade-in",
								isVisible.section2 && "active"
							)}
						>
							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									How It Works
								</h2>
								<p>
									{siteName} curates insights and stories from
									trusted sources like TechCrunch. We analyze
									key trends, announcements, and industry
									movements to craft engaging content that
									highlights the most interesting aspects of
									the tech world.
								</p>
								<p>
									Our team ensures that every piece of content
									is relevant, high-quality, and
									thought-provoking. We strive to deliver a
									blend of creativity and insight that
									resonates with our audience.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
								<div className="bg-card border border-border rounded-lg p-6 space-y-2">
									<div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<circle
												cx="12"
												cy="12"
												r="10"
											></circle>
											<line
												x1="2"
												y1="12"
												x2="22"
												y2="12"
											></line>
											<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
										</svg>
									</div>
									<h3 className="font-medium">
										News Collection
									</h3>
									<p className="text-sm text-muted-foreground">
										We gather the latest tech news from
										reputable sources across the web.
									</p>
								</div>

								<div className="bg-card border border-border rounded-lg p-6 space-y-2">
									<div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
											<path d="m15.5 9-4.5 4.5L7.5 11"></path>
										</svg>
									</div>
									<h3 className="font-medium">
										Trend Analysis
									</h3>
									<p className="text-sm text-muted-foreground">
										Our team identifies patterns, concepts,
										and opportunities to create engaging
										content.
									</p>
								</div>

								<div className="bg-card border border-border rounded-lg p-6 space-y-2">
									<div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center mb-4">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
										</svg>
									</div>
									<h3 className="font-medium">
										Content Creation
									</h3>
									<p className="text-sm text-muted-foreground">
										We transform insights into content that
										informs and entertains our audience.
									</p>
								</div>
							</div>
						</div>

						<div
							ref={section3Ref}
							className={cn(
								"space-y-8 mt-16 animate-on-scroll fade-in",
								isVisible.section3 && "active"
							)}
						>
							<div className="space-y-4">
								<h2 className="text-2xl font-medium">
									Our Principles
								</h2>
								<div className="space-y-6">
									<div className="flex gap-4">
										<div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
											<span className="text-xs font-medium">
												1
											</span>
										</div>
										<div>
											<h3 className="text-lg font-medium">
												Engaging Content
											</h3>
											<p className="text-muted-foreground mt-1">
												Our goal is to create content
												that captivates and inspires
												readers, encouraging them to
												think critically about the tech
												world.
											</p>
										</div>
									</div>

									<div className="flex gap-4">
										<div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
											<span className="text-xs font-medium">
												2
											</span>
										</div>
										<div>
											<h3 className="text-lg font-medium">
												Transparency
											</h3>
											<p className="text-muted-foreground mt-1">
												We are committed to being clear
												and honest about the nature of
												our content, ensuring readers
												know what to expect.
											</p>
										</div>
									</div>

									<div className="flex gap-4">
										<div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
											<span className="text-xs font-medium">
												3
											</span>
										</div>
										<div>
											<h3 className="text-lg font-medium">
												Respectful Approach
											</h3>
											<p className="text-muted-foreground mt-1">
												We focus on ideas, trends, and
												industry movements, ensuring our
												content remains respectful and
												constructive.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default Page;
