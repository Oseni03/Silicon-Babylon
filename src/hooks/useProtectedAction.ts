"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type VoidFunction = () => void;
type AsyncVoidFunction = () => Promise<void>;

interface ProtectedActionResult {
	trigger: (
		action: VoidFunction | AsyncVoidFunction,
		redirectPath?: string
	) => void;
	showAuthModal: boolean;
	setShowAuthModal: (show: boolean) => void;
	redirectAfterAuth?: string;
}

export const useProtectedAction = (): ProtectedActionResult => {
	const { user } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
	const [redirectAfterAuth, setRedirectAfterAuth] = useState<string>();

	const trigger = (
		action: VoidFunction | AsyncVoidFunction,
		redirectPath?: string
	): void => {
		if (user) {
			action();
		} else {
			setRedirectAfterAuth(redirectPath);
			setShowAuthModal(true);
		}
	};

	return { trigger, showAuthModal, setShowAuthModal, redirectAfterAuth };
};
