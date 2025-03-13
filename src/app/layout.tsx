import "@/app/index.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers";
import type { PropsWithChildren } from "react";
import { siteName, siteKeywords } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: siteName,
	description: "AI-Generated Satire Based on Real Tech News",
	keywords: siteKeywords.join(", "),
};

// const queryClient = new QueryClient();

function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider>
					{/* <QueryClientProvider client={queryClient}> */}
					<TooltipProvider>
						<Toaster />
						{children}
					</TooltipProvider>
					{/* </QueryClientProvider> */}
				</ThemeProvider>
			</body>
		</html>
	);
}

export default RootLayout;
