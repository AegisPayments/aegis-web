"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { generateHeadingId, getPlainText } from "@/lib/utils";

// Import mermaid for client-side rendering
import mermaid from "mermaid";

// Initialize mermaid
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      primaryColor: "#00f0ff",
      primaryTextColor: "#ffffff",
      primaryBorderColor: "#00f0ff",
      lineColor: "#64748b",
      secondaryColor: "#1e293b",
      tertiaryColor: "#0f172a",
    },
  });
}

interface CodeBlockProps {
  children: string;
  className?: string;
}

interface MermaidDiagramProps {
  children: string;
}

function MermaidDiagram({ children }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && children) {
      const renderDiagram = async () => {
        try {
          const { svg } = await mermaid.render(
            `mermaid-${Date.now()}`,
            children,
          );
          setSvg(svg);
        } catch (error) {
          console.error("Mermaid rendering error:", error);
          setSvg(
            `<div class="text-red-400">Error rendering diagram: ${error}</div>`,
          );
        }
      };
      renderDiagram();
    }
  }, [children]);

  return (
    <div className="my-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
      <div
        ref={ref}
        className="mermaid-container flex justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  // Handle mermaid diagrams
  if (language === "mermaid") {
    return <MermaidDiagram>{children}</MermaidDiagram>;
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!language) {
    return (
      <code className="bg-slate-800/80 text-cyan-400 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 bg-slate-800/80 hover:bg-slate-700 rounded transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Copy className="h-4 w-4 text-gray-400" />
        )}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        customStyle={{
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(51, 65, 85, 0.5)",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-slate max-w-none p-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ children, className }) => (
            <CodeBlock className={className}>{String(children)}</CodeBlock>
          ),
          pre: ({ children }) => <div>{children}</div>,
          h1: ({ children }) => (
            <h1
              id={generateHeadingId(getPlainText(children))}
              className="scroll-mt-16 text-3xl font-bold text-cyan-400 border-b border-slate-700 pb-2"
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              id={generateHeadingId(getPlainText(children))}
              className="scroll-mt-16 text-2xl font-semibold text-emerald-400 mt-8 mb-4"
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              id={generateHeadingId(getPlainText(children))}
              className="scroll-mt-16 text-xl font-semibold text-gray-200 mt-6 mb-3"
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              id={generateHeadingId(getPlainText(children))}
              className="scroll-mt-16 text-lg font-medium text-gray-300 mt-4 mb-2"
            >
              {children}
            </h4>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cyan-500/50 pl-4 italic text-gray-300 bg-slate-800/30 py-2">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-700 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-slate-800/50 text-cyan-400 font-semibold p-3 text-left border-b border-slate-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 border-b border-slate-800 text-gray-300">
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300/50 transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-gray-300">{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
