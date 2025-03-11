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
