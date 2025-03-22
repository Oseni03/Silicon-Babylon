import { siteUrl } from "@/lib/config";

export default function robots() {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/api/process-feed/, /auth/callback/",
		},
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
