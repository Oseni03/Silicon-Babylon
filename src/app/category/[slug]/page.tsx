import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import CTA from "@/components/CTA";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { unslugify } from "@/lib/utils";
import { getRandomAffiliate } from "@/lib/affiliates";
import { getPaginatedArticlesByCategory } from "@/lib/db";
import CategoryClient from "./CategoryClient";
import { Metadata } from "next";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const categoryName = unslugify(slug);

	return {
		title: `${categoryName} News`,
		description: `Browse our collection of satirical articles about ${categoryName}`,
	};
}

const Page = async ({ params }: PageProps) => {
	const { slug } = await params;
	const pageSize = 15;

	const data = await getPaginatedArticlesByCategory({
		categorySlug: slug,
		limit: pageSize,
		offset: 0,
	});

	if (!data || data.length === 0) {
		notFound();
	}

	const withAffiliates = [];
	for (let i = 0; i < data.length; i++) {
		withAffiliates.push(data[i]);
		if ((i + 1) % 4 === 0) {
			withAffiliates.push(getRandomAffiliate());
		}
	}

	const categoryName = unslugify(slug);

	return (
		<div className="flex flex-col min-h-screen font-sans">
			<Header />
			<main className="flex-grow pt-12 md:pt-24 pb-12 md:pb-16 border-t border-black">
				<section className="container mx-auto px-4 md:px-6">
					<div className="mb-12 md:mb-20">
						<Breadcrumb className="mb-8">
							<BreadcrumbList className="gap-2">
								<BreadcrumbItem>
									<BreadcrumbLink
										href="/"
										className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-black transition-colors"
									>
										Index
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="text-muted-foreground" />
								<BreadcrumbItem>
									<BreadcrumbPage className="text-[10px] uppercase tracking-widest font-black text-black">
										{categoryName}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>

						<h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6">
							{categoryName}
						</h1>
						<div className="w-16 h-1 bg-black mb-8"></div>
						<p className="text-muted-foreground text-lg max-w-xl">
							Selected reporting and satirical analysis on {categoryName.toLowerCase()}.
						</p>
					</div>

					<CategoryClient
						initialArticles={withAffiliates}
						categorySlug={slug}
					/>
				</section>
			</main>
			<CTA />
			<Footer />
		</div>
	);
};

export default Page;
