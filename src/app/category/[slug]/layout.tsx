import { Metadata } from "next";
import { getAllCategories } from "@/lib/db"; // Adjust import path as needed
import { unslugify } from "@/lib/utils"; // Adjust import path as needed
import { siteName, siteKeywords } from "@/lib/config"; // Adjust import paths as needed

interface CategoryLayoutProps {
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}

interface CategoryPageParams {
	slug: string;
}

export async function generateStaticParams() {
	const categories = await getAllCategories();
	return categories.map((category) => ({
		slug: category.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<CategoryPageParams>;
}): Promise<Metadata> {
	const { slug } = await params;
	const categoryName = unslugify(slug);
	const title = `${categoryName} News`;
	const description = `Explore our curated collection of mythical tech news about ${categoryName}. Get your daily dose of tech humor and insights.`;
	const keywords = [
		categoryName,
		"mythical tech news",
		"tech humor",
		`${categoryName} articles`,
		`${categoryName} news`,
		`${categoryName} funny articles`,
		`${categoryName} funny news`,
		`${categoryName} myth articles`,
		`${categoryName} myth news`,
		`${categoryName} newsletter`,
		...siteKeywords.slice(0, 5), // Use slice instead of splice to avoid mutating
	].join(", ");

	return {
		title,
		description,
		keywords,
		openGraph: {
			title,
			description,
			type: "website",
			siteName,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
	return <>{children}</>;
}
