"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
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
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			onClose();
			if (redirectPath) {
				window.location.href = redirectPath;
			}
		} catch (error) {
			toast.error("Authentication failed");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px] rounded-none border-black p-8 shadow-none">
				<DialogHeader className="space-y-6">
					<div className="w-12 h-px bg-black"></div>
					<DialogTitle className="text-4xl font-serif tracking-tight">
						Welcome to {siteName}
					</DialogTitle>
					<DialogDescription className="text-sm uppercase tracking-widest font-bold text-muted-foreground/60 leading-relaxed">
						Join our community of technical satirists. Access exclusive content and participate in the global discourse.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-8">
					<button
						onClick={handleGoogleSignIn}
						className="w-full flex items-center justify-center gap-4 py-4 border-2 border-black hover:bg-black hover:text-white transition-all text-sm font-black uppercase tracking-[0.2em]"
					>
						<Image
							src="/icons/google.svg"
							alt="Google"
							width={18}
							height={18}
							className="h-4.5 w-4.5"
						/>
						Continue with Google
					</button>
				</div>
				<p className="text-[8px] uppercase tracking-widest text-center text-muted-foreground">
					By continuing, you accept our satirical terms of service.
				</p>
			</DialogContent>
		</Dialog>
	);
}
