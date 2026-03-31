// Article Related Types
export interface Category {
	name: string;
	slug: string;
}

export interface Article {
	id?: string;
	slug: string;
	title: string;
	content: string;
	description?: string;
	originalUrl: string;
	originalTitle?: string;
	publishedAt: Date;
	categories: Category[];
	keywords: string[];
	isAffiliate?: boolean;
	image?: string | null;
}

export interface ArticleCardProps {
	title: string;
	excerpt: string;
	date: string;
	categories?: Category[];
	index: number;
	slug: string;
	isAffiliate?: boolean;
	originalUrl?: string;
	image?: string | null; // ← Added: URL of the featured image
	imageAlt?: string; // ← Optional: alt text for accessibility
}

// API Response Types
export interface SatiricalResult {
	title: string;
	content: string;
	description: string;
	keywords: string[];
}

export interface TechCrunchItem {
	title: string;
	link: string;
	content: string;
	isoDate: string;
	categories: string[];
}

export interface AffiliateProgram {
	title: string;
	content: string;
	keywords: string[];
	url: string;
}

export interface NewsletterSubscriber {
	createdAt: Date;
	email: string;
	emailPreferences?: string | null;
	id: string;
	lastEmailSent: null;
	unsubscribed: false;
	verified: false;
}
