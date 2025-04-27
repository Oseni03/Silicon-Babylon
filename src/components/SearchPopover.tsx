"use client"

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const SearchPopover = ({ filteredArticles, setFilteredArticles }) => {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Filter articles based on category and search query
        let filtered = [...filteredArticles];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();

            filtered = filtered.filter(
                (article) =>
                    article.title.toLowerCase().includes(query) ||
                    article.content.toLowerCase().includes(query)
            )
        }

        setFilteredArticles(filtered);
    }, [searchQuery]);

    return (
        <Popover>
            <PopoverTrigger><div className="flex gap-2">
                Search
                <Search /></div></PopoverTrigger>
            <PopoverContent><input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            /></PopoverContent>
        </Popover>
    )
}
