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

export async function generateMetadata({ params }): Promise<Metadata> {
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

	try {
		const data = await getPaginatedArticlesByCategory({
			categorySlug: slug,
			limit: pageSize,
			offset: 0,
		});

		// If no articles found, show 404
		if (data.length === 0) {
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
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow pt-4 md:pt-8 pb-12 md:pb-16">
					<section className="container mx-auto px-3 md:px-6">
						<div className="mb-4 md:mb-8">
							<Breadcrumb className="mb-4 md:mb-6">
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbLink
											href="/"
											className="text-muted-foreground hover:text-foreground"
										>
											Home
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbPage>
											{categoryName}
										</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>

							<h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
								{categoryName} News
							</h1>
							<p className="text-muted-foreground text-lg">
								Browse our collection of satirical articles about{" "}
								{categoryName}
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
	} catch (error) {
		console.error("Failed to fetch articles:", error);
		notFound();
	}
};

export default Page;
