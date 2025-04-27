import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticlesByCategory, getAllCategories } from "@/lib/db";
import { siteName, siteKeywords } from "@/lib/config";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import ArticlesGrid from "@/components/ArticlesGrid";
import CTA from "@/components/CTA";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

const unslugify = (slug: string): string => {
  // Special cases
  const specialCases: Record<string, string> = {
    ai: "AI",
  };

  if (specialCases[slug]) {
    return specialCases[slug];
  }

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = unslugify(slug);
  const title = `${categoryName} News`;
  const description = `Explore our curated collection of satirical tech news about ${categoryName}. Get your daily dose of tech humor and insights.`;
  const keywords = [
    categoryName,
    "satirical tech news",
    "tech humor",
    `${categoryName} articles`,
    `${categoryName} news`,
    `${categoryName} funny articles`,
    `${categoryName} funny news`,
    `${categoryName} satire articles`,
    `${categoryName} satire news`,
    `${categoryName} newsletter`,
    ...siteKeywords.splice(0, 5), // Limit to 5 keywords
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

const Page = async ({ params }) => {
  const { slug } = await params;
  const articles = await getArticlesByCategory(slug);

  if (!articles.length) {
    notFound();
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
                  <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">
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
              Browse our collection of satirical articles about {categoryName}
            </p>
          </div>

          <ArticlesGrid filteredArticles={articles} />
        </section>
      </main>
      <CTA />
      <Footer />
    </div>
  );
};

export default Page;
