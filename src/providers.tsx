"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	useEffect(() => {
		try {
			const storedTheme = localStorage.getItem("theme");
			if (storedTheme) {
				document.documentElement.className = storedTheme === "dark" ? "dark" : "light";
			}
		} catch (e) {
			console.warn("Failed to access localStorage:", e);
		}
	}, []);

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			storageKey="theme"
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
