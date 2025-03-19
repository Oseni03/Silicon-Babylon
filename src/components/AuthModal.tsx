"use client";

import { signInWithGoogle } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { siteName } from "@/lib/config";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	redirectPath?: string;
}

export default function AuthModal({
	isOpen,
	onClose,
	redirectPath,
}: AuthModalProps) {
	const handleGoogleSignIn = async () => {
		try {
			await signInWithGoogle(redirectPath);
			onClose();
		} catch (error) {
			console.error("Authentication error:", error);
			toast.error("Authentication failed", {
				description: "There was a problem signing you in.",
			});
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Welcome to {siteName}</DialogTitle>
					<DialogDescription>
						Sign in to access all features and participate in the
						community.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					<Button
						variant="outline"
						onClick={handleGoogleSignIn}
						className="w-full flex items-center justify-center gap-2"
					>
						<Image
							src="/icons/google.svg"
							alt="Google"
							width={16}
							height={16}
							className="h-4 w-4"
						/>
						Continue with Google
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
