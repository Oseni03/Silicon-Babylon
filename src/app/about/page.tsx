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

			<main className="flex-grow pt-24">
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
								Where AI meets satire and tech news gets twisted
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
									{siteName} was born from a simple idea: what
									if we could use AI to create satirical
									content based on real tech news? In a world
									where technology advances at breakneck
									speed, sometimes we all need to take a step
									back and laugh at the absurdity of it all.
								</p>
								<p>
									Our mission is to provide a humorous
									perspective on the latest tech trends,
									industry movements, and product launches. We
									believe that satire is not just entertaining
									– it's a powerful lens through which we can
									examine the tech world's promises, failures,
									and occasionally bizarre decision-making.
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
									{siteName} uses advanced AI algorithms to
									analyze real technology news from trusted
									sources like TechCrunch. Our system
									identifies key trends, announcements, and
									industry movements, then transforms them
									into satirical articles that highlight the
									humorous, ironic, or occasionally absurd
									aspects of the tech world.
								</p>
								<p>
									While our content is AI-generated, we
									maintain human oversight to ensure quality,
									relevance, and appropriateness. Think of it
									as a collaboration between artificial
									intelligence and human wit – the best of
									both worlds.
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
									<h3 className="font-medium">AI Analysis</h3>
									<p className="text-sm text-muted-foreground">
										Our AI identifies patterns, concepts,
										and opportunities for satirical content.
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
										Satire Generation
									</h3>
									<p className="text-sm text-muted-foreground">
										We transform real news into satirical
										content that entertains and provides
										perspective.
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
												Entertainment with a Purpose
											</h3>
											<p className="text-muted-foreground mt-1">
												While our primary goal is to
												entertain, we believe satire
												serves a deeper purpose. By
												highlighting the absurdities of
												tech culture, we invite readers
												to think more critically about
												technology's role in our lives.
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
												We're upfront about the nature
												of our content. Every article is
												clearly labeled as AI-generated
												satire, and we make no attempts
												to mislead readers into
												believing our content represents
												actual events or announcements.
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
												Respectful Humor
											</h3>
											<p className="text-muted-foreground mt-1">
												We believe humor doesn't need to
												be harmful. Our satire targets
												institutions, trends, and
												corporate decision-making rather
												than individuals. We aim to make
												you laugh without resorting to
												personal attacks or harmful
												stereotypes.
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
