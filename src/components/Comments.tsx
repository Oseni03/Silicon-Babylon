"use client";
import { useState, useEffect } from "react";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { createComment, getArticleComments } from "@/lib/db/comments";
import { toast } from "sonner";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Comment {
	id: string;
	content: string;
	userId: string;
	createdAt: Date;
}

interface CommentsProps {
	articleSlug: string;
	articleId: string;
}

export function Comments({ articleSlug, articleId }: CommentsProps) {
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState<Comment[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { trigger, showAuthModal, setShowAuthModal, redirectAfterAuth } =
		useProtectedAction();
	const { user } = useAuth();

	useEffect(() => {
		loadComments();
	}, [articleId]);

	const loadComments = async () => {
		try {
			const comments = await getArticleComments(articleId);
			setComments(comments);
		} catch (error) {
			console.error("Error loading comments:", error);
			toast.error("Failed to load comments");
		}
	};

	const handleSubmitComment = async () => {
		if (!comment.trim()) return;

		setIsSubmitting(true);
		try {
			await createComment({
				content: comment,
				userId: user!.id,
				articleId,
			});

			setComment("");
			await loadComments();
			toast.success("Comment posted successfully!");
		} catch (error) {
			console.error("Error posting comment:", error);
			toast.error("Failed to post comment");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCommentClick = () => {
		trigger(
			() => handleSubmitComment(),
			`/article/${articleSlug}#comments`
		);
	};

	return (
		<div className="mt-16 pt-8 border-t border-border" id="comments">
			<h2 className="text-2xl font-semibold mb-4">
				{comments.length > 0
					? `Comments (${comments.length})`
					: "Comments"}
			</h2>

			{/* Comment Form */}
			<div className="space-y-4 mb-8">
				{user ? (
					<>
						<Textarea
							placeholder="Share your thoughts..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="min-h-[100px]"
							disabled={isSubmitting}
						/>
						<Button
							onClick={handleCommentClick}
							disabled={isSubmitting || !comment.trim()}
						>
							{isSubmitting ? "Posting..." : "Post Comment"}
						</Button>
					</>
				) : (
					<div className="bg-secondary/50 rounded-lg p-6 text-center">
						<p className="text-muted-foreground mb-4">
							Please sign in to join the discussion
						</p>
						<Button
							onClick={() => setShowAuthModal(true)}
							variant="default"
						>
							Sign In to Comment
						</Button>
					</div>
				)}
			</div>

			{/* Comments List */}
			{comments.length > 0 ? (
				<ScrollArea className="h-[400px] rounded-md border p-4">
					<div className="space-y-6">
						{comments.map((comment) => (
							<div
								key={comment.id}
								className="border-b border-border pb-4"
							>
								<div className="flex items-center justify-between mb-2">
									<div className="text-sm text-muted-foreground">
										Anonymous User
									</div>
									<time className="text-xs text-muted-foreground">
										{format(
											new Date(comment.createdAt),
											"MMM d, yyyy"
										)}
									</time>
								</div>
								<p className="text-sm">{comment.content}</p>
							</div>
						))}
					</div>
				</ScrollArea>
			) : (
				<div className="text-center py-8 bg-secondary/30 rounded-lg">
					<p className="text-muted-foreground">
						No comments yet. Be the first to share your thoughts!
					</p>
				</div>
			)}

			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				redirectPath={redirectAfterAuth}
			/>
		</div>
	);
}
