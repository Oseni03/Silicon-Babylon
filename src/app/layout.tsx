import "@/app/index.css";
import { Inter } from "next/font/google";
import Script from "next/script";
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
			<head>
				<Script
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4433921260204256"
					strategy="afterInteractive"
					crossOrigin="anonymous"
				/>
			</head>
			<body className={inter.className}>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-SQ27NNXZ74"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-SQ27NNXZ74');
					`}
				</Script>
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
