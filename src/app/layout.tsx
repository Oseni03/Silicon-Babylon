"use client";

import "@/app/index.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers";
import type { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
// 	title: "SatiricTech",
// 	description: "AI-Generated Satire Based on Real Tech News",
// };

const queryClient = new QueryClient();

function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider>
					<QueryClientProvider client={queryClient}>
						<TooltipProvider>
							<Toaster />
							{children}
						</TooltipProvider>
					</QueryClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

export default RootLayout;
