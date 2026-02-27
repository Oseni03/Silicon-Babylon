"use server";

import { type Article, type Category } from "@/types/types";
import { prisma } from "./prisma";
import { stripHtml } from "./utils/xml";
import logger from "./logger";
import { unstable_cache } from "next/cache";

// Add retry utility
async function withRetry<T>(
	operation: () => Promise<T>,
	retries = 3,
	delay = 1000
): Promise<T> {
	let lastError;
	for (let i = 0; i < retries; i++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error;
			if (i < retries - 1) {
				await new Promise((resolve) =>
					setTimeout(resolve, delay * (i + 1))
				);
			}
		}
	}
	throw lastError;
}

// Add batch check function
export async function checkExistingArticles(
	urls: string[]
): Promise<Set<string>> {
	const batchSize = 10;
	const existingUrls = new Set<string>();

	for (let i = 0; i < urls.length; i += batchSize) {
		const batch = urls.slice(i, i + batchSize);

		const articles = (await withRetry(() =>
			prisma.article.findMany({
				where: {
					originalUrl: {
						in: batch,
					},
				},
				select: {
					originalUrl: true,
				},
			})
		)) as Article[];

		articles.forEach((article) => {
			if (article.originalUrl) {
				existingUrls.add(article.originalUrl);
			}
		});

		if (i + batchSize < urls.length) {
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}

	return existingUrls;
}

export async function createArticle(data: Article) {
	return prisma.article.upsert({
		where: {
			originalUrl: data.originalUrl,
		},
		update: {
			slug: data.slug, // Add slug to update
			title: data.title,
			content: data.content,
			description:
				data.description ||
				stripHtml(data.content).substring(0, 300) + "...",
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
			description:
				data.description ||
				stripHtml(data.content).substring(0, 300) + "...",
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

export const getArticles = unstable_cache(
	async () => {
		return prisma.article.findMany({
			select: {
				id: true,
				slug: true,
				title: true,
				description: true,
				originalUrl: true,
				publishedAt: true,
				categories: true,
				keywords: true,
				content: true,
			},
			orderBy: {
				publishedAt: "desc",
			},
		});
	},
	['articles'],
	{ tags: ['articles'], revalidate: 3600 }
);

export const getPaginatedArticles = unstable_cache(
	async ({ limit = 10, offset = 0, search = "" }) => {
		const where = search
			? {
					OR: [
						{ title: { contains: search, mode: "insensitive" as const } },
						{ content: { contains: search, mode: "insensitive" as const } },
						{ description: { contains: search, mode: "insensitive" as const } },
					],
			  }
			: {};

		return prisma.article.findMany({
			where,
			select: {
				id: true,
				slug: true,
				title: true,
				description: true,
				originalUrl: true,
				publishedAt: true,
				categories: true,
				keywords: true,
				content: true,
			},
			orderBy: {
				publishedAt: "desc",
			},
			skip: offset,
			take: limit,
		});
	},
	['paginated-articles'],
	{ tags: ['articles'], revalidate: 3600 }
);

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
		select: {
			id: true,
			slug: true,
			title: true,
			description: true,
			originalUrl: true,
			publishedAt: true,
			categories: true,
			keywords: true,
			content: true,
		},
	});
}

export async function createCategory(data: Category) {
	return prisma.category.upsert({
		where: { slug: data.slug },
		update: { name: data.name },
		create: {
			name: data.name,
			slug: data.slug,
		},
	});
}

export const getAllCategories = unstable_cache(
	async () => {
		return prisma.category.findMany();
	},
	['all-categories'],
	{ tags: ['categories'], revalidate: 86400 } // Cache for 24 hours
);

export const getArticlesByCategory = unstable_cache(
	async (categorySlug: string) => {
		return prisma.article.findMany({
			where: {
				categories: {
					some: {
						slug: categorySlug,
					},
				},
			},
			select: {
				id: true,
				slug: true,
				title: true,
				description: true,
				originalUrl: true,
				publishedAt: true,
				categories: true,
				keywords: true,
				content: true,
                createdAt: true,
                updatedAt: true,
			},
			orderBy: {
				publishedAt: "desc",
			},
		});
	},
	['articles-by-category'],
	{ tags: ['articles', 'categories'], revalidate: 3600 }
);

export const getPaginatedArticlesByCategory = unstable_cache(
	async ({
		categorySlug,
		limit = 10,
		offset = 0,
		search = "",
	}: {
		categorySlug: string;
		limit?: number;
		offset?: number;
		search?: string;
	}) => {
		const searchCondition = search
			? {
					OR: [
						{ title: { contains: search, mode: "insensitive" as const } },
						{ content: { contains: search, mode: "insensitive" as const } },
						{ description: { contains: search, mode: "insensitive" as const } },
					],
			  }
			: {};

		return prisma.article.findMany({
			where: {
				AND: [
					{
						categories: {
							some: {
								slug: categorySlug,
							},
						},
					},
					searchCondition,
				],
			},
			select: {
				id: true,
				slug: true,
				title: true,
				description: true,
				originalUrl: true,
				publishedAt: true,
				categories: true,
				keywords: true,
				content: true,
			},
			orderBy: {
				publishedAt: "desc",
			},
			skip: offset,
			take: limit,
		});
	},
	['paginated-articles-by-category'],
	{ tags: ['articles', 'categories'], revalidate: 3600 }
);

export async function subscribeToNewsletter(email: string) {
	return prisma.newsletter.create({
		data: {
			email,
		},
	});
}

export async function unsubscribeToNewsletter(email: string) {
	return prisma.newsletter.update({
		where: { email },
		data: {
			unsubscribed: true,
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

export async function getRelatedArticles(
	articleId: string,
	categoryIds: string[],
	limit = 5
) {
	return prisma.article.findMany({
		where: {
			AND: [
				{ id: { not: articleId } },
				{
					categories: {
						some: {
							id: { in: categoryIds },
						},
					},
				},
			],
		},
		include: {
			categories: true,
		},
		take: limit,
		orderBy: {
			publishedAt: "desc",
		},
	});
}

export const getTopArticles = unstable_cache(
	async (limit = 8) => {
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		return prisma.article.findMany({
			where: {
				publishedAt: {
					gte: oneWeekAgo,
				},
			},
			orderBy: [
				{
					reactions: {
						_count: "desc",
					},
				},
				{
					publishedAt: "desc",
				},
			],
			take: limit,
			select: {
				categories: true,
				_count: {
					select: {
						reactions: true,
						comments: true,
					},
				},
				slug: true,
				title: true,
				content: true,
				description: true,
				publishedAt: true,
				originalUrl: true,
				originalTitle: true,
				keywords: true,
				regenerated: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	},
	['top-articles'],
	{ tags: ['articles', 'reactions'], revalidate: 3600 }
);

export async function getActiveSubscribers() {
	try {
		// Get all active subscribers
		const subscribers = await prisma.newsletter.findMany({
			where: {
				// verified: true,
				unsubscribed: false,
			},
		});
		return subscribers;
	} catch (error) {
		throw new Error("Failed to fetch active subscribers");
	}
}

export async function getIssuesCount() {
	try {
		const count = await prisma.issue.count();
		return count;
	} catch (error) {
		logger.error("Error fetching issues count:", error);
		throw new Error("Failed to fetch issues");
	}
}

export async function createIssue(data: {
	body: string;
	summary?: string;
	subject?: string;
}) {
	return prisma.issue.create({
		data,
	});
}
