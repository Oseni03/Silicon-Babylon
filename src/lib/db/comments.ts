"use server";

import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export async function createComment({
	content,
	userId,
	articleId,
}: {
	content: string;
	userId: string;
	articleId: string;
}) {
	logger.info("Creating new comment", { userId, articleId });
	try {
		const comment = await prisma.comment.create({
			data: {
				content,
				userId,
				articleId,
			},
			include: {
				user: true,
			},
		});
		logger.info("Comment created successfully", { commentId: comment.id });
		return comment;
	} catch (error) {
		logger.error("Failed to create comment", { error, userId, articleId });
		throw error;
	}
}

export async function getArticleComments(articleId: string) {
	logger.debug("Fetching comments for article", { articleId });
	try {
		const comments = await prisma.comment.findMany({
			where: { articleId },
			include: {
				user: {
					select: {
						username: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		logger.debug("Comments fetched successfully", {
			articleId,
			count: comments.length,
		});
		return comments;
	} catch (error) {
		logger.error("Failed to fetch comments", { error, articleId });
		throw error;
	}
}
