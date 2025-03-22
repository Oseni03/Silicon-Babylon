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
	title: {
		template: `%s | ${siteName}`,
		default: `${siteName} - Funny Tech News`,
	},
	description:
		"Stay ahead with commentary and humorous insights inspired by real tech headlines. Explore the lighter side of technology today.",
	keywords: `${siteKeywords.join(
		", "
	)}, tech humor, funny tech insights, future of technology`,
	robots: "index, follow",
	author: `${siteName} Team`,
	openGraph: {
		title: `${siteName} - funny Tech Insights`,
		description:
			"Explore commentary and humorous insights inspired by real tech headlines.",
		url: "https://www.satirical-techscape.com",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteName} - Funny Tech Insights`,
		description:
			"Stay ahead with commentary and humorous insights inspired by real tech headlines.",
	},
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
						<TooltipProvider>
							<Toaster />
							{children}
						</TooltipProvider>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

export default RootLayout;
