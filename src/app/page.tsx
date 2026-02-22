import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import HomePageClient from "@/components/HomePageClient";
import { getPaginatedArticles } from "@/lib/db";
import { getRandomAffiliate } from "@/lib/affiliates";

async function Page() {
	// Fetch initial articles server-side
	const initialArticlesData = await getPaginatedArticles({
		limit: 15,
		offset: 0,
	});

	// Add affiliate content
	const initialArticles = [];
	for (let i = 0; i < initialArticlesData.length; i++) {
		initialArticles.push(initialArticlesData[i]);
		if ((i + 1) % 4 === 0) {
			initialArticles.push(getRandomAffiliate());
		}
	}

	return (
		<div className="flex flex-col min-h-screen">
			<HomePageClient initialArticles={initialArticles} />
			<main className="flex-grow">
				<CTA />
			</main>
			<Footer />
		</div>
	);
}

export default Page;
