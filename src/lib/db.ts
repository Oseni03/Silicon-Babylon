"use server";

import { type Article, type Category } from "@/types/types";
import { prisma } from "./prisma";

export async function createArticle(data: Article) {
	return prisma.article.upsert({
		where: {
			originalUrl: data.originalUrl,
		},
		update: {
			slug: data.slug, // Add slug to update
			title: data.title,
			content: data.content,
			keywords: data.keywords,
			publishedAt: new Date(data.publishedAt),
			categories: {
				connect: data.categories.map((category) => ({
					slug: category.slug,
				})),
			},
		},
		create: {
			slug: data.slug,
			title: data.title,
			content: data.content,
			keywords: data.keywords,
			originalUrl: data.originalUrl,
			originalTitle: data.originalTitle,
			publishedAt: new Date(data.publishedAt),
			categories: {
				connect: data.categories.map((category) => ({
					slug: category.slug,
				})),
			},
		},
		include: {
			categories: true,
		},
	});
}

export async function getArticles() {
	return prisma.article.findMany({
		include: {
			categories: true,
		},
		orderBy: {
			publishedAt: "desc",
		},
	});
}

export async function getArticleBySlug(slug: string) {
	return prisma.article.findFirst({
		where: { slug },
		include: {
			categories: true,
		},
	});
}

export async function getArticleByOriginalUrl(url: string) {
	return prisma.article.findFirst({
		where: { originalUrl: url },
		include: {
			categories: true,
		},
	});
}

export async function createCategory(data: Category) {
	return prisma.category.upsert({
		where: { slug: data.slug },
		update: {},
		create: {
			name: data.name,
			slug: data.slug,
		},
	});
}

export async function getAllCategories() {
	return prisma.category.findMany();
}

export async function getArticlesByCategory(categorySlug: string) {
	return prisma.article.findMany({
		where: {
			categories: {
				some: {
					slug: categorySlug,
				},
			},
		},
		include: {
			categories: true,
		},
		orderBy: {
			publishedAt: "desc",
		},
	});
}

export async function subscribeToNewsletter(email: string) {
	return prisma.newsletter.create({
		data: {
			email,
		},
	});
}

export async function isEmailSubscribed(email: string) {
	const subscriber = await prisma.newsletter.findUnique({
		where: { email },
	});
	return !!subscriber;
}

export async function createContactMessage(data: {
	name: string;
	email: string;
	subject: string;
	message: string;
}) {
	return prisma.contact.create({
		data,
	});
}
