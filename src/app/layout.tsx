import "@/app/index.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { ThemeProvider } from "@/providers";
import type { PropsWithChildren } from "react";
import { siteName, siteKeywords } from "@/lib/config";
import { AuthProvider } from "@/context/AuthContext";
import { Metadata } from "next";
import { siteUrl } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		template: `%s | ${siteName}`,
		default: `${siteName} - Probably Accurate News`,
	},
	description:
		"Stay ahead with commentary and humorous insights inspired by real tech news headlines. Explore the lighter side of technology today.",
	keywords: `${siteKeywords.join(
		", "
	)}, tech humor, funny tech insights, future of technology`,
	robots: "index, follow",
	authors: [{ name: "Oseni03", url: "https://x.com/Oseni03" }],
	openGraph: {
		title: {
			template: `%s | ${siteName}`,
			default: `${siteName} - Probably Accurate News`,
		},
		description:
			"Explore commentary and humorous insights inspired by real tech headlines.",
		url: siteUrl,
		type: "website",
		images: ["/og-image.png"],
	},
	twitter: {
		card: "summary_large_image",
		title: {
			template: `%s | ${siteName}`,
			default: `${siteName} - Probably Accurate News`,
		},
		description:
			"Stay ahead with commentary and humorous insights inspired by real tech headlines.",
		images: "/og-image.png",
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
				></meta>
				<meta
					name="p:domain_verify"
					content="60456aee5155dfa58c050d796aa4a524"
				/>
				<meta
					name="p:domain_verify"
					content="7a8310954ab418e7c719b29e9dc972e3"
				/>
				<meta
					name="impact-site-verification"
					content="a1280f2b-15a4-4565-99cd-9a87773ee023"
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
				<link
					rel="alternate"
					type="application/rss+xml"
					title={`${siteName} RSS Feed`}
					href="/rss.xml"
				/>
			</head>
			<body className={inter.className} suppressHydrationWarning={true}>
				<ReactQueryProvider>
					<ThemeProvider>
						<AuthProvider>
							<TooltipProvider>
								<Toaster />
								{children}
							</TooltipProvider>
						</AuthProvider>
					</ThemeProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}

export default RootLayout;
