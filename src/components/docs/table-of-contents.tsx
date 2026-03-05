"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { generateHeadingId } from "@/lib/utils";

interface Heading {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split("\n");

  let inCodeBlock = false;

  for (const line of lines) {
    // Skip code blocks
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Match markdown headings
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2].replace(/[#*`_]/g, "").trim();
      const id = generateHeadingId(title);

      headings.push({ id, title, level });
    }
  }

  return headings;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const extractedHeadings = extractHeadings(content);
    setHeadings(extractedHeadings);
  }, [content]);

  // On scroll, find the last heading whose top has scrolled past the viewport top.
  // Uses getBoundingClientRect for accurate position regardless of nesting.
  useEffect(() => {
    if (headings.length === 0) return;

    let isClickScrolling = false;

    const onScroll = () => {
      if (isClickScrolling) return;

      let currentId = "";
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // heading has scrolled past the top (with 100px buffer for scroll-mt)
          if (rect.top <= 100) {
            currentId = id;
          }
        }
      }

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
        window.history.replaceState(null, "", `#${currentId}`);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings, activeId]);

  // On initial load, sync from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && headings.some((h) => h.id === hash)) {
      setActiveId(hash);
    }
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-8 bg-slate-900/50 border-slate-800 backdrop-blur p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">
        Table of Contents
      </h3>
      <nav>
        <ul className="space-y-2">
          {headings.map(({ id, title, level }, index) => (
            <li key={`${id}-${index}`}>
              <button
                onClick={() => scrollToHeading(id)}
                className={`
                  text-left w-full px-2 py-1 rounded transition-colors text-sm
                  hover:bg-slate-800/50 hover:text-cyan-300
                  ${activeId === id ? "text-cyan-400 bg-cyan-500/10" : "text-gray-400"}
                  ${level === 1 ? "font-semibold" : ""}
                  ${level === 2 ? "ml-2" : ""}
                  ${level === 3 ? "ml-4 text-xs" : ""}
                  ${level === 4 ? "ml-6 text-xs" : ""}
                  ${level >= 5 ? "ml-8 text-xs" : ""}
                `}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
}
