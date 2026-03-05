"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import Fuse from "fuse.js";
import { Card } from "@/components/ui/card";
import { generateHeadingId } from "@/lib/utils";

interface SearchResult {
  title: string;
  content: string;
  section: "contracts" | "cre";
  matches: string[];
}

interface SearchBarProps {
  contractsContent: string;
  creContent: string;
}

function extractSearchableContent(
  content: string,
  section: "contracts" | "cre",
): SearchResult[] {
  const lines = content.split("\n");
  const results: SearchResult[] = [];

  let currentHeading = "";
  let currentContent: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      // Include code block markers in search content
      currentContent.push(line);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch && !inCodeBlock) {
      // Save previous section
      if (currentHeading && currentContent.length > 0) {
        results.push({
          title: currentHeading,
          content: currentContent.join("\n"),
          section,
          matches: [],
        });
      }

      // Start new section
      currentHeading = headingMatch[2].replace(/[#*`_]/g, "").trim();
      currentContent = [];
    } else if (line.trim()) {
      // Include all non-empty lines (including code blocks)
      currentContent.push(line);
    }
  }

  // Add final section
  if (currentHeading && currentContent.length > 0) {
    results.push({
      title: currentHeading,
      content: currentContent.join("\n"),
      section,
      matches: [],
    });
  }

  return results;
}

export default function SearchBar({
  contractsContent,
  creContent,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]',
        ) as HTMLInputElement;
        searchInput?.focus();
        setIsSearchFocused(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchableContent = useMemo(() => {
    return [
      ...extractSearchableContent(contractsContent, "contracts"),
      ...extractSearchableContent(creContent, "cre"),
    ];
  }, [contractsContent, creContent]);

  const fuse = useMemo(() => {
    return new Fuse(searchableContent, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "content", weight: 0.6 }, // Increase content weight for better content search
      ],
      threshold: 0.4, // Make search more lenient to find partial matches
      includeMatches: true,
      includeScore: true,
      minMatchCharLength: 2,
      // Enable more fuzzy matching options
      ignoreLocation: true,
      findAllMatches: true,
    });
  }, [searchableContent]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    return fuse
      .search(query)
      .slice(0, 8)
      .map((result) => ({
        ...result.item,
        matches: result.matches?.map((match) => match.value || "") || [],
        score: result.score || 0,
      }));
  }, [query, fuse]);

  const clearSearch = () => {
    setQuery("");
    setIsSearchFocused(false);
  };

  const scrollToSection = (title: string) => {
    const id = generateHeadingId(title);
    const element = document.getElementById(id);
    if (element) {
      // Update URL hash
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${id}`);
      }

      element.scrollIntoView({ behavior: "smooth", block: "start" });
      clearSearch();
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search documentation... (Ctrl+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 backdrop-blur"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {query && isSearchFocused && (
        <Card className="absolute top-full mt-2 w-full bg-slate-900/95 border-slate-700 backdrop-blur z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-gray-400 px-2 py-1 mb-2">
                Found {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""}
              </div>
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(result.title)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-cyan-400 text-sm">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {result.section === "contracts"
                          ? "Smart Contracts"
                          : "CRE Workflow"}
                      </div>
                      {result.content && (
                        <div className="text-xs text-gray-500 mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                          {result.content
                            .substring(0, 100)
                            .replace(/\s+/g, " ")
                            .trim()}
                          ...
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              No results found for "{query}"
            </div>
          )}
        </Card>
      )}

      {/* Click outside to close */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearchFocused(false)}
        />
      )}
    </div>
  );
}
