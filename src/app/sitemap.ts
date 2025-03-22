import { siteUrl } from "@/lib/config";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Define static routes
	const staticRoutes = [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1.0,
		},
		{
			url: `${siteUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.9,
		},
		{
			url: `${siteUrl}/archive`,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 0.9,
		},
		{
			url: `${siteUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.9,
		},
		{
			url: `${siteUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.3,
		},
		{
			url: `${siteUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.3,
		},
	];

	// Combine static and dynamic routes
	return [...staticRoutes];
}
