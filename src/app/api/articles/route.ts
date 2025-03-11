// /c:/Users/USER/Documents/projects/satirical-techscape/app/api/articles/route.ts
import { prisma } from "@/lib/prisma";
import { generateSlug, generateUniqueSlug } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const articles = await prisma.article.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				categories: true,
			},
		});
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
				const exists = await prisma.article.findUnique({
					where: { slug },
				});
				return !exists;
			}
		);

		// Handle categories
		const categoryPromises = data.categories.map(
			async (categoryName: string) => {
				const categorySlug = generateSlug(categoryName);
				return prisma.category.upsert({
					where: { slug: categorySlug },
					update: {},
					create: {
						name: categoryName,
						slug: categorySlug,
					},
				});
			}
		);

		const categories = await Promise.all(categoryPromises);

		const article = await prisma.article.create({
			data: {
				title: data.title,
				slug: articleSlug,
				content: data.content,
				originalUrl: data.originalUrl,
				originalTitle: data.originalTitle,
				publishedAt: new Date(data.publishedAt),
				keywords: data.keywords || [],
				categories: {
					connect: categories.map((category) => ({
						id: category.id,
					})),
				},
			},
			include: {
				categories: true,
			},
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
