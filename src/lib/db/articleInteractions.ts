"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getComments(articleId: string) {
	const comments = await prisma.comment.findMany({
		where: { articleId },
		include: {
			user: true,
			likes: true,
			replies: {
				include: {
					user: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});
	return comments;
}

export async function getReactionCounts(articleId: string) {
	const reactions = await prisma.articleReaction.groupBy({
		by: ["type"],
		where: { articleId },
		_count: true,
	});

	return reactions.reduce(
		(acc, curr) => ({
			...acc,
			[curr.type]: curr._count,
		}),
		{}
	);
}

export async function addReaction(
	articleId: string,
	type: string,
	userId: string
) {
	try {
		await prisma.articleReaction.upsert({
			where: {
				articleId_userId: {
					articleId,
					userId,
				},
			},
			update: { type },
			create: { articleId, userId, type },
		});
		revalidatePath(`/article/${articleId}`);
	} catch (error) {
		throw new Error("Failed to add reaction");
	}
}

export async function addComment(
	articleId: string,
	content: string,
	userId: string
) {
	try {
		await prisma.comment.create({
			data: { content, articleId, userId },
		});
		revalidatePath(`/article/${articleId}`);
	} catch (error) {
		throw new Error("Failed to add comment");
	}
}

export async function toggleCommentLike(commentId: string, userId: string) {
	try {
		const existingLike = await prisma.commentLike.findUnique({
			where: {
				commentId_userId: { commentId, userId },
			},
		});

		if (existingLike) {
			await prisma.commentLike.delete({
				where: { id: existingLike.id },
			});
		} else {
			await prisma.commentLike.create({
				data: { commentId, userId },
			});
		}

		const comment = await prisma.comment.findUnique({
			where: { id: commentId },
			select: { articleId: true },
		});

		if (comment) {
			revalidatePath(`/article/${comment.articleId}`);
		}
	} catch (error) {
		throw new Error("Failed to toggle like");
	}
}

export async function addReply(
	commentId: string,
	content: string,
	userId: string
) {
	try {
		const comment = await prisma.comment.findUnique({
			where: { id: commentId },
			select: { articleId: true },
		});

		if (!comment) throw new Error("Comment not found");

		await prisma.commentReply.create({
			data: { content, commentId, userId },
		});

		revalidatePath(`/article/${comment.articleId}`);
	} catch (error) {
		throw new Error("Failed to add reply");
	}
}
