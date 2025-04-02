import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticles, getAllCategories } from "@/lib/db";
import { siteName } from "@/lib/config";
import { getRandomAffiliate } from "@/lib/affiliates";
import ArticleArchive from "@/components/ArticleArchive";
import CTA from "@/components/CTA";

export const metadata = {
	title: `Archive - ${siteName}`,
};

const Page = async () => {
	const [articlesData, categoriesData] = await Promise.all([
		getArticles(),
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
			<main className="flex-grow pt-24">
				<ArticleArchive
					initialArticles={withAffiliates}
					categories={categoriesData}
				/>
			</main>
			<CTA />
			<Footer />
		</div>
	);
};

export default Page;
