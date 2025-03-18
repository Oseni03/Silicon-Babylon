import { prisma } from "@/lib/prisma";

export async function createComment({
	content,
	userId,
	articleId,
}: {
	content: string;
	userId: string;
	articleId: string;
}) {
	return prisma.comment.create({
		data: {
			content,
			userId,
			articleId,
		},
	});
}

export async function getArticleComments(articleId: string) {
	return prisma.comment.findMany({
		where: {
			articleId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}
