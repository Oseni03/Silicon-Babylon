"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";

interface Article {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	category: string;
}

// Extended sample articles data for archive
const allArticles: Article[] = [
	{
		id: 1,
		title: "Apple's New iCar Requires AppleCare+ Just to Start the Engine",
		excerpt:
			"In a move surprising absolutely nobody, Apple's new automotive venture requires a subscription just to perform basic functions.",
		date: "2023-05-15",
		category: "Products",
	},
	{
		id: 2,
		title: "Meta Unveils 'Actual Reality' Platform for Users Who Need a Break from the Metaverse",
		excerpt:
			"In a shocking departure from its usual strategy, Mark Zuckerberg announced a new platform that encourages people to look up from their screens.",
		date: "2023-05-12",
		category: "Social Media",
	},
	{
		id: 3,
		title: "Amazon's New Delivery Drones Now Come With Complimentary Therapy Sessions",
		excerpt:
			"After detecting concerning levels of anxiety in most American households, Amazon's drones will now offer basic counseling alongside your packages.",
		date: "2023-05-10",
		category: "E-commerce",
	},
	{
		id: 4,
		title: "Microsoft's New AI Assistant Keeps Taking Smoke Breaks and Calling in Sick",
		excerpt:
			"Users report that the latest AI from Microsoft frequently claims to 'have a thing' and needs to 'step out for a minute.'",
		date: "2023-05-08",
		category: "AI & ML",
	},
	{
		id: 5,
		title: "Google's Latest Algorithm Update Ranks Websites Based on How Many Cats They Feature",
		excerpt:
			"SEO experts are scrambling to add feline content to every page after Google's surprise 'Purr-Core' update changed the search landscape overnight.",
		date: "2023-05-05",
		category: "Search",
	},
	{
		id: 6,
		title: "Tesla Announces Self-Driving Feature That Just Drives Back to the Dealership When It's Had Enough",
		excerpt:
			"The latest update from Tesla includes an 'I Quit' function that activates when the car detects it's being asked to parallel park for the third time in a day.",
		date: "2023-05-02",
		category: "Automotive",
	},
	{
		id: 7,
		title: "SpaceX Launches New Rocket That Comes Back With More Fuel Than It Left With",
		excerpt:
			"Scientists baffled as Elon Musk claims to have broken the laws of physics with SpaceX's latest reusable rocket that 'just keeps getting better with age.'",
		date: "2023-04-28",
		category: "Space",
	},
	{
		id: 8,
		title: "New Startup Promises to Disrupt the Disruption Industry",
		excerpt:
			"Silicon Valley's newest venture aims to help companies disrupt industries that are already being disrupted by other disruptive startups.",
		date: "2023-04-25",
		category: "Startups",
	},
	{
		id: 9,
		title: "Apple Introduces $999 Charging Cable That Doubles as Designer Fashion Accessory",
		excerpt:
			"Tim Cook insists that the new cable, made from 'responsibly sourced' precious metals, represents the 'future of charging and personal expression.'",
		date: "2023-04-22",
		category: "Products",
	},
	{
		id: 10,
		title: "Twitter Algorithm Now Just Asks Users 'Are You Angry Yet?' Before Showing Content",
		excerpt:
			"In a move towards transparency, Twitter has simplified its algorithm to directly query users about their current rage levels.",
		date: "2023-04-19",
		category: "Social Media",
	},
	{
		id: 11,
		title: "New Blockchain-Based Dating App Requires 51% Consensus from Friends Before You Can Message Someone",
		excerpt:
			"Developers claim the app, called 'ConsensUs,' eliminates bad pickup lines through a democratic review process.",
		date: "2023-04-15",
		category: "Blockchain",
	},
	{
		id: 12,
		title: "Intel Announces New Chip That Runs Entirely on Compliments and Positive Affirmations",
		excerpt:
			"The groundbreaking processor requires users to verbally praise their computer at least once every hour to maintain optimal performance.",
		date: "2023-04-12",
		category: "Hardware",
	},
];

// Get unique categories
const categories = Array.from(
	new Set(allArticles.map((article) => article.category))
);

const Page = () => {
	const [filteredArticles, setFilteredArticles] =
		useState<Article[]>(allArticles);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		document.title = "Archive - SatiricTech";

		// Filter articles based on category and search query
		let filtered = [...allArticles];

		if (selectedCategory) {
			filtered = filtered.filter(
				(article) => article.category === selectedCategory
			);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(article) =>
					article.title.toLowerCase().includes(query) ||
					article.excerpt.toLowerCase().includes(query)
			);
		}

		setFilteredArticles(filtered);
	}, [selectedCategory, searchQuery]);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow pt-24">
				<section className="container mx-auto px-6 py-16">
					<div className="max-w-4xl mx-auto text-center mb-12 space-y-2">
						<h1 className="text-4xl font-medium tracking-tight">
							Article Archive
						</h1>
						<p className="text-muted-foreground">
							Browse our complete collection of satirical tech
							articles
						</p>
					</div>

					<div className="max-w-5xl mx-auto mb-10 space-y-6">
						{/* Search and filters */}
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="relative flex-grow">
								<svg
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="11" cy="11" r="8"></circle>
									<line
										x1="21"
										y1="21"
										x2="16.65"
										y2="16.65"
									></line>
								</svg>
								<input
									type="text"
									placeholder="Search articles..."
									className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
								/>
							</div>

							<select
								className="px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
								value={selectedCategory || ""}
								onChange={(e) =>
									setSelectedCategory(e.target.value || null)
								}
							>
								<option value="">All Categories</option>
								{categories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>

						{/* Results info */}
						<div className="text-sm text-muted-foreground">
							Showing {filteredArticles.length} articles
							{selectedCategory && ` in ${selectedCategory}`}
							{searchQuery && ` matching "${searchQuery}"`}
						</div>
					</div>

					{/* Articles grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredArticles.length > 0 ? (
							filteredArticles.map((article, index) => (
								<ArticleCard
									key={article.id}
									title={article.title}
									excerpt={article.excerpt}
									date={article.date}
									category={article.category}
									index={index}
									id={article.id}
								/>
							))
						) : (
							<div className="col-span-full text-center py-12">
								<div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
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
										<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
										<path d="M8 15h8"></path>
										<path d="M9 9h.01"></path>
										<path d="M15 9h.01"></path>
									</svg>
								</div>
								<h2 className="text-xl font-medium mb-2">
									No articles found
								</h2>
								<p className="text-muted-foreground">
									Try adjusting your search or filter to find
									what you're looking for.
								</p>
							</div>
						)}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default Page;
