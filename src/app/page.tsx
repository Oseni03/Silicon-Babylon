import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArticlesList from "@/components/ArticlesList";
import CategoryGrid from "@/components/CategoryGrid";
import Disclaimer from "@/components/Disclaimer";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Page = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow">
				<Hero />
				{/* <Disclaimer /> */}
				<CategoryGrid />
				<ArticlesList />
				<CTA />
			</main>
			<Footer />
		</div>
	);
};

export default Page;
