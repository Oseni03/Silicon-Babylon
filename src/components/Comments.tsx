"use client";
import { useState } from "react";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AuthModal from "./AuthModal";

interface CommentsProps {
	articleSlug: string;
}

export function Comments({ articleSlug }: CommentsProps) {
	const [comment, setComment] = useState("");
	const { trigger, showAuthModal, setShowAuthModal, redirectAfterAuth } =
		useProtectedAction();

	const handleSubmitComment = async () => {
		// Your comment submission logic here
		console.log("Submitting comment:", comment);
	};

	const handleCommentClick = () => {
		trigger(
			() => handleSubmitComment(),
			`/article/${articleSlug}#comments`
		);
	};

	return (
		<div className="mt-16 pt-8 border-t border-border" id="comments">
			<h2 className="text-2xl font-semibold mb-4">Comments</h2>
			<div className="space-y-4">
				<Textarea
					placeholder="Share your thoughts..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className="min-h-[100px]"
				/>
				<Button onClick={handleCommentClick}>Post Comment</Button>
			</div>

			<AuthModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				redirectPath={redirectAfterAuth}
			/>
		</div>
	);
}
