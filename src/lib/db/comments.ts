"use server";

import { prisma } from "@/lib/prisma";

export async function createComment({
	content,
	userId,
	username,
	articleId,
}: {
	content: string;
	userId: string;
	username?: string; // Make username optional
	articleId: string;
}) {
	return prisma.comment.create({
		data: {
			content,
			userId,
			username,
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
