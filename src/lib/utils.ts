import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export async function generateUniqueSlug(
	text: string,
	checkUnique: (slug: string) => Promise<boolean>
): Promise<string> {
	let slug = generateSlug(text);
	let counter = 1;
	let uniqueSlug = slug;

	while (!(await checkUnique(uniqueSlug))) {
		uniqueSlug = `${slug}-${counter}`;
		counter++;
	}

	return uniqueSlug;
}

export function formatDate(date: Date | string) {
	return new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
}

export async function buildSitemapXML(entries: any[]) {
	let xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	for (const entry of entries) {
		xml += "<url>";
		xml += `<loc>${entry.url}</loc>`;
		xml += `<lastmod>${entry.lastModified}</lastmod>`;
		xml += `<changefreq>${entry.changeFrequency}</changefreq>`;
		xml += `<priority>${entry.priority}</priority>`;
		xml += "</url>";
	}
	xml += "</urlset>";
	return xml;
}

export const categories = [
	{
		name: "Commerce",
		slug: "commerce",
	},
	{
		name: "AI",
		slug: "ai",
	},
	{
		name: "Crypto",
		slug: "crypto",
	},
	{
		name: "Fundraising",
		slug: "fundraising",
	},
	{
		name: "Gaming",
		slug: "gaming",
	},
	{
		name: "Entertainment",
		slug: "media-entertainment",
	},
	{
		name: "Startups",
		slug: "startups",
	},
	{
		name: "Apps",
		slug: "apps",
	},
	{
		name: "Enterprise",
		slug: "enterprise",
	},
];
