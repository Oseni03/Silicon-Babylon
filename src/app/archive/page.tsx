import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPaginatedArticles, getAllCategories } from "@/lib/db";
import { getRandomAffiliate } from "@/lib/affiliates";
import CTA from "@/components/CTA";
import ArchiveClient from "./ArchiveClient";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Archive",
	description: "Browse our collection of satirical tech articles.",
};

const Page = async () => {
	const pageSize = 15;

	try {
		const [articlesData, categoriesData] = await Promise.all([
			getPaginatedArticles({ limit: pageSize, offset: 0 }),
			getAllCategories(),
		]);

		// Insert affiliate content every 4 articles
		const withAffiliates = [];
		for (let i = 0; i < articlesData.length; i++) {
			withAffiliates.push(articlesData[i]);
			if ((i + 1) % 4 === 0) {
				withAffiliates.push(getRandomAffiliate());
			}
		}

		return (
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow pt-4 md:pt-8 pb-12 md:pb-16">
					<ArchiveClient
						initialArticles={withAffiliates}
						categories={categoriesData}
					/>
				</main>
				<CTA />
				<Footer />
			</div>
		);
	} catch (error) {
		console.error("Failed to load initial data:", error);
		return (
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow flex items-center justify-center">
					<p>Failed to load articles. Please try again later.</p>
				</main>
				<Footer />
			</div>
		);
	}
};

export default Page;
