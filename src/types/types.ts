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
	originalUrl: string;
	originalTitle?: string;
	publishedAt: Date;
	categories: Category[];
	keywords: string[];
	isAffiliate?: boolean;
}

export interface ArticleCardProps {
	title: string;
	excerpt: string;
	date: string;
	categories: Category[];
	index: number;
	slug: string;
	isAffiliate?: boolean;
	originalUrl?: string;
}

// API Response Types
export interface SatiricalResult {
	title: string;
	content: string;
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
