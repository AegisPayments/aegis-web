import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ReactNode } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Recursively extract plain text from React children (handles nested elements
 * like <strong>, <em>, <code> that ReactMarkdown produces from bold/italic/code in headings).
 */
export function getPlainText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getPlainText).join("");
  if (typeof node === "object" && "props" in node) {
    return getPlainText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/**
 * Generate a consistent URL-safe ID from heading text.
 * Used by both the markdown renderer (to set element IDs) and the
 * table-of-contents / search (to build matching anchor links).
 */
export function generateHeadingId(text: string): string {
  let result = String(text)
    .replace(/\*\*?/g, "") // Remove markdown bold/italic markers
    .replace(/[#`_]/g, "") // Remove other markdown formatting
    .replace(/"/g, "") // Remove quotes
    .trim();

  // Handle numbered headings like "1. Infinite Approvals Risk"
  const numberMatch = result.match(/^(\d+)\s*\.\s*(.+)$/);
  if (numberMatch) {
    return `${numberMatch[1]}-${numberMatch[2]}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Handle emoji headings - remove emojis and start with hyphen
  const hasEmoji =
    /[\p{Emoji_Presentation}\p{Emoji}\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(
      result,
    );
  if (hasEmoji) {
    result = result
      .replace(
        /[\p{Emoji_Presentation}\p{Emoji}\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        "",
      )
      .trim()
      .replace(/&/g, " -- ") // Convert & to space-double-hyphen-space
      .replace(/[^\w\s-]/g, "") // Remove other special chars (like parentheses)
      .replace(/\s+/g, "-") // Convert spaces to hyphens
      .replace(/-{3,}/g, "--") // Convert 3+ hyphens to double hyphen
      .toLowerCase();
    return `-${result}`;
  }

  // Handle regular headings
  return result
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
