import "@/app/index.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers";
import type { PropsWithChildren } from "react";
import { siteName, siteKeywords } from "@/lib/config";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: siteName,
	description: "AI-Crafted Commentary Inspired by Real Tech Headlines",
	keywords: siteKeywords.join(", "),
};

// const queryClient = new QueryClient();

function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta
					name="google-adsense-account"
					content="ca-pub-4433921260204256"
				/>
				<Script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4433921260204256"
					crossOrigin="anonymous"
					strategy="afterInteractive"
				/>
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
			</head>
			<body className={inter.className}>
				<ThemeProvider>
					<AuthProvider>
						{/* <QueryClientProvider client={queryClient}> */}
						<TooltipProvider>
							<Toaster />
							{children}
						</TooltipProvider>
						{/* </QueryClientProvider> */}
					</AuthProvider>
				</ThemeProvider>
				<Script type="text/javascript" strategy="afterInteractive">
					{`var infolinks_pid = 3434068; var infolinks_wsid = 0;`}
				</Script>
				<Script
					type="text/javascript"
					src="//resources.infolinks.com/js/infolinks_main.js"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}

export default RootLayout;
