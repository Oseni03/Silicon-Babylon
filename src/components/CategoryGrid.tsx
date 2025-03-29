import Link from "next/link";
import { Category } from "@/types/types";
import { Badge } from "@/components/ui/badge";

const categories: Category[] = [
    {
        name: "Commerce",
        slug: "commerce"
    },
    {
        name: "Artificial Intelligence",
        slug: "ai"
    },
    {
        name: "Crypto Currency",
        slug: "cryptocurrency"
    },
    {
        name: "Fundraising",
        slug: "fundraising"
    },
    {
        name: "Gaming",
        slug: "gaming"
    },
    {
        name: "Media Entertainment",
        slug: "media-entertainment"
    },
];

const CategoryGrid = () => {
    return (
        <section className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto mb-12 text-center space-y-2">
                <h2 className="text-3xl font-medium tracking-tight text-foreground">Top Categories</h2>
                <p className="text-muted-foreground/80">
                    Explore articles by your favorite tech topics
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {categories.map((category, index) => (
                    <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                    >
                        <Badge
                            variant="secondary"
                            className="py-2 px-4 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                        >
                            {category.name}
                        </Badge>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
