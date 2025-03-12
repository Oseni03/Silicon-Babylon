// /c:/Users/USER/Documents/projects/satirical-techscape/app/api/articles/route.ts
import {
	createArticle,
	createCategory,
	getArticleBySlug,
	getArticles,
} from "@/lib/db";
import { generateSlug, generateUniqueSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const articles = await getArticles();
		return NextResponse.json(articles);
	} catch (error) {
		return NextResponse.json(
			{ error: "Error fetching articles" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const data = await request.json();

		// Generate unique slug for article
		const articleSlug = await generateUniqueSlug(
			data.title,
			async (slug) => {
				const exists = await getArticleBySlug(slug);
				return !exists;
			}
		);

		// Handle categories
		const categoryPromises = data.categories.map(
			async (categoryName: string) => {
				const categorySlug = generateSlug(categoryName);
				return createCategory({
					name: categoryName,
					slug: categorySlug,
				});
			}
		);

		const categories = await Promise.all(categoryPromises);

		const article = await createArticle({
			...data,
			slug: articleSlug,
			categories,
		});
		return NextResponse.json(article);
	} catch (error) {
		console.error("Error creating article:", error);
		return NextResponse.json(
			{ error: "Error creating article" },
			{ status: 500 }
		);
	}
}
