import { prisma } from "./prisma";

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
