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
				category: true,
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

		const categorySlug = generateSlug(data.category);

		// Get or create the category
		const category = await prisma.category.upsert({
			where: { slug: categorySlug },
			update: {},
			create: {
				name: data.category,
				slug: categorySlug,
			},
		});

		const article = await prisma.article.create({
			data: {
				title: data.title,
				slug: articleSlug,
				content: data.content,
				image: data.image,
				categoryId: category.id,
			},
			include: {
				category: true,
			},
		});
		return NextResponse.json(article);
	} catch (error) {
		return NextResponse.json(
			{ error: "Error creating article" },
			{ status: 500 }
		);
	}
}
