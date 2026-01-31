"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  BrainCircuit,
  FileText,
  Loader2,
  Send,
  Copy,
  Network,
} from "lucide-react";
import {
  searchWeb,
  readUrl,
  deepResearch,
  summarizeUrl,
  generateGraph,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import Mermaid from "./components/Mermaid";

type Mode = "search" | "read" | "research" | "summarize" | "graph";

export default function Home() {
  const [mode, setMode] = useState<Mode>("search");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data;
      switch (mode) {
        case "search":
          data = await searchWeb(input);
          break;
        case "read":
          data = await readUrl(input);
          break;
        case "research":
          data = await deepResearch(input);
          break;
        case "summarize":
          data = await summarizeUrl(input);
          break;
        case "graph":
          data = await generateGraph(input);
          break;
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Mode; label: string; icon: React.ElementType }[] = [
    { id: "search", label: "Search", icon: Search },
    { id: "read", label: "Read URL", icon: BookOpen },
    { id: "research", label: "Deep Research", icon: BrainCircuit },
    { id: "graph", label: "Mind Map", icon: Network },
    { id: "summarize", label: "Summarize", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <main className="container mx-auto max-w-4xl px-4 py-12 flex flex-col min-h-screen">
        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm mb-4 ring-1 ring-zinc-200 dark:ring-zinc-700">
            <BrainCircuit className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Web Search Agent
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            Your AI-powered assistant for searching, reading, researching, and
            summarizing the web.
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 p-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-xl backdrop-blur-sm self-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setMode(tab.id);
                setResult(null);
                setError(null);
                setInput("");
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                mode === tab.id
                  ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="w-full max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white dark:bg-zinc-800 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 ring-1 ring-zinc-200 dark:ring-zinc-700 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === "search"
                    ? "What are you looking for?"
                    : mode === "research"
                      ? "Enter a topic to research..."
                      : mode === "graph"
                        ? "Enter a topic to map (e.g. Quantum Physics)..."
                        : "Enter a URL (https://...)"
                }
                className="w-full bg-transparent px-6 py-4 text-lg outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="mr-2 p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-center gap-4 text-xs text-zinc-400">
            {mode === "research" && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Deep research takes ~30s
              </span>
            )}
            {mode === "read" && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Clean markdown extraction
              </span>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-auto max-w-2xl w-full mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-center text-sm">
            {error}
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative group/result">
            <div className="absolute top-4 right-4 opacity-0 group-hover/result:opacity-100 transition-opacity z-10">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                title="Copy to clipboard"
                type="button"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 md:p-10">
              {mode === "graph" ? (
                <Mermaid chart={result} />
              ) : (
                <MarkdownRenderer content={result} />
              )}
            </div>
          </div>
        )}

        {/* Empty State / Placeholder */}
        {!result && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 opacity-50">
            <div
              className="w-16 h-16 rounded-full border-4 border-current mb-4 flex items-center justify-center border-t-transparent animate-[spin_10s_linear_infinite]"
              style={{ animationDuration: "20s" }}
            >
              <BrainCircuit className="w-8 h-8" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
