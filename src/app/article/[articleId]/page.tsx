"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

interface Article {
	id: number;
	title: string;
	content: string;
	date: string;
	category: string;
	realArticleUrl: string;
}

// Sample article data - in a real app, this would come from an API
const sampleArticles: Record<string, Article> = {
	"1": {
		id: 1,
		title: "Apple's New iCar Requires AppleCare+ Just to Start the Engine",
		content: `
      <p>In a move surprising absolutely nobody, Apple's new automotive venture requires a subscription just to perform basic functions like starting the engine and using the turn signals.</p>
      
      <p>The sleek new vehicle, which Apple executives describe as "a revolutionary reimagining of transportation," comes with a starting price of just $89,999 - but that's before you add essential features like "wheels" ($4,999), "steering" ($7,999), and "the ability to stop" ($12,999).</p>
      
      <p>At yesterday's product launch, Apple CEO Tim Cook beamed with pride as he showcased the car's minimalist interior, which features exactly one button labeled "Apple" that controls everything from acceleration to climate control.</p>
      
      <p>"We've truly simplified the driving experience," Cook explained, demonstrating how users need only tap the button in Morse code to access different functions. "Three short taps, two long taps, and another short tap will open the glove compartment. We think users are going to love it."</p>
      
      <p>Industry analysts noted that the iCar requires users to subscribe to Apple Music, as the vehicle refuses to operate if it detects unauthorized audio streaming services. Additionally, the car will only drive on Apple-approved roads, which the company plans to announce at a later date.</p>
      
      <p>When asked about compatibility with non-Apple devices, Cook simply chuckled and walked away.</p>
    `,
		date: "2023-05-15",
		category: "Products",
		realArticleUrl: "https://techcrunch.com/2023/05/15/apple-car-rumor",
	},
	"2": {
		id: 2,
		title: "Meta Unveils 'Actual Reality' Platform for Users Who Need a Break from the Metaverse",
		content: `
      <p>In a shocking departure from its usual strategy, Mark Zuckerberg announced a new platform that encourages people to look up from their screens.</p>
      
      <p>The new program, dubbed "Actual Reality," involves radical technology concepts like "going outside," "talking to people face to face," and "experiencing the world through human senses rather than a headset."</p>
      
      <p>During the unveiling, Zuckerberg appeared visibly uncomfortable as he explained that users would need to "manually render their environment" using "built-in biological processing units" that come standard with "being a person."</p>
      
      <p>"Our research shows that some users occasionally express interest in experiencing life directly, without our helpful mediation," Zuckerberg said, blinking rapidly. "While we don't personally understand this desire, we're willing to explore this market niche."</p>
      
      <p>The initiative comes with several caveats, including the warning that Meta will not be responsible for any "unfiltered human interactions" that may occur while using Actual Reality.</p>
      
      <p>Meta's stock immediately dropped 17% following the announcement, with investors questioning whether encouraging less screen time aligned with the company's core business model of "harvesting every millisecond of human attention for advertising purposes."</p>
    `,
		date: "2023-05-12",
		category: "Social Media",
		realArticleUrl:
			"https://techcrunch.com/2023/05/12/meta-reality-platform",
	},
};

const Page = () => {
	const { articleId } = useParams<{ articleId: string }>();
	const [article, setArticle] = useState<Article | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate API fetch with setTimeout
		const fetchArticle = () => {
			setIsLoading(true);
			setTimeout(() => {
				if (articleId && sampleArticles[articleId]) {
					setArticle(sampleArticles[articleId]);
				}
				setIsLoading(false);

				// Set page title
				if (articleId && sampleArticles[articleId]) {
					document.title = `${sampleArticles[articleId].title} - SatiricTech`;
				} else {
					document.title = "Article Not Found - SatiricTech";
				}
			}, 500);
		};

		fetchArticle();
	}, [articleId]);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow pt-24">
				{isLoading ? (
					<div className="container mx-auto px-6 py-24 text-center">
						<div className="animate-pulse space-y-4 max-w-3xl mx-auto">
							<div className="h-8 bg-secondary rounded w-3/4 mx-auto"></div>
							<div className="h-4 bg-secondary rounded w-1/4 mx-auto"></div>
							<div className="h-4 bg-secondary rounded w-1/3 mx-auto"></div>
							<div className="space-y-2 mt-10">
								<div className="h-4 bg-secondary rounded"></div>
								<div className="h-4 bg-secondary rounded"></div>
								<div className="h-4 bg-secondary rounded w-5/6"></div>
							</div>
						</div>
					</div>
				) : article ? (
					<>
						<article className="container mx-auto px-6 py-16">
							<div className="max-w-3xl mx-auto">
								{/* Top disclaimer */}
								<div className="mb-10 p-4 border border-border rounded-lg bg-secondary/30">
									<p className="text-sm text-muted-foreground text-center">
										This is AI-generated satire based on
										real tech news. Don't take it seriously!
										All content is algorithmically created
										for entertainment purposes only.
									</p>
								</div>

								{/* Article header */}
								<header className="mb-10 space-y-6">
									<h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-balance">
										{article.title}
									</h1>

									<div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-4 sm:gap-6">
										<time dateTime={article.date}>
											{new Date(
												article.date
											).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</time>

										<div className="flex items-center">
											<span className="flex-shrink-0 w-1 h-1 bg-muted-foreground/70 rounded-full hidden sm:block"></span>
											<span className="px-3 py-1 ml-0 sm:ml-6 text-xs rounded-full bg-secondary">
												{article.category}
											</span>
										</div>
									</div>
								</header>

								{/* Original article link */}
								<div className="mb-10">
									<a
										href={article.realArticleUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center group text-sm font-medium transition-colors text-primary hover:text-primary/80"
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
											<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
											<polyline points="15 3 21 3 21 9"></polyline>
											<line
												x1="10"
												y1="14"
												x2="21"
												y2="3"
											></line>
										</svg>
										Read the real story on TechCrunch
										<span className="inline-block transition-transform group-hover:translate-x-1 ml-1">
											→
										</span>
									</a>
								</div>

								{/* Article content */}
								<div
									className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-headings:text-foreground"
									dangerouslySetInnerHTML={{
										__html: article.content,
									}}
								/>

								{/* Bottom navigation */}
								<div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
									<Link
										href="/"
										className="inline-flex items-center text-sm font-medium transition-colors text-primary hover:text-primary/80"
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
											<line
												x1="19"
												y1="12"
												x2="5"
												y2="12"
											></line>
											<polyline points="12 19 5 12 12 5"></polyline>
										</svg>
										Back to Home
									</Link>

									<Link
										href="/archive"
										className="inline-flex items-center text-sm font-medium transition-colors text-primary hover:text-primary/80"
									>
										Browse Archive
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
											className="ml-2"
										>
											<line
												x1="5"
												y1="12"
												x2="19"
												y2="12"
											></line>
											<polyline points="12 5 19 12 12 19"></polyline>
										</svg>
									</Link>
								</div>
							</div>
						</article>

						{/* Bottom disclaimer */}
						<div className="container mx-auto px-6 pb-16">
							<Disclaimer />
						</div>
					</>
				) : (
					<div className="container mx-auto px-6 py-24 text-center">
						<div className="max-w-md mx-auto">
							<div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6">
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
									<line x1="12" y1="8" x2="12" y2="12"></line>
									<line
										x1="12"
										y1="16"
										x2="12.01"
										y2="16"
									></line>
								</svg>
							</div>
							<h1 className="text-2xl font-medium mb-4">
								Article Not Found
							</h1>
							<p className="text-muted-foreground mb-8">
								We couldn't find the article you're looking for.
								It may have been removed or you might have
								followed a bad link.
							</p>
							<Link
								href="/archive"
								className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
							>
								Browse All Articles
							</Link>
						</div>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
};

export default Page;
