import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ className, ...props }) => (
          <h1
            className={cn(
              "mt-8 mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50",
              className
            )}
            {...props}
          />
        ),
        h2: ({ className, ...props }) => (
          <h2
            className={cn(
              "mt-8 mb-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
              className
            )}
            {...props}
          />
        ),
        h3: ({ className, ...props }) => (
          <h3
            className={cn(
              "mt-6 mb-3 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
              className
            )}
            {...props}
          />
        ),
        h4: ({ className, ...props }) => (
          <h4
            className={cn(
              "mt-6 mb-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
              className
            )}
            {...props}
          />
        ),
        p: ({ className, ...props }) => (
          <p
            className={cn("leading-7 [&:not(:first-child)]:mt-4 text-zinc-700 dark:text-zinc-300", className)}
            {...props}
          />
        ),
        ul: ({ className, ...props }) => (
          <ul className={cn("my-4 ml-6 list-disc [&>li]:mt-2 text-zinc-700 dark:text-zinc-300", className)} {...props} />
        ),
        ol: ({ className, ...props }) => (
          <ol className={cn("my-4 ml-6 list-decimal [&>li]:mt-2 text-zinc-700 dark:text-zinc-300", className)} {...props} />
        ),
        li: ({ className, ...props }) => (
          <li className={cn("", className)} {...props} />
        ),
        blockquote: ({ className, ...props }) => (
          <blockquote
            className={cn(
              "mt-6 border-l-4 border-blue-500 pl-6 italic text-zinc-700 dark:text-zinc-300 bg-blue-50 dark:bg-blue-900/10 py-2 rounded-r",
              className
            )}
            {...props}
          />
        ),
        img: ({ className, alt, ...props }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={cn("rounded-lg border border-zinc-200 dark:border-zinc-800 my-6 shadow-sm", className)}
            alt={alt}
            {...props}
          />
        ),
        hr: ({ ...props }) => <hr className="my-8 border-zinc-200 dark:border-zinc-800" {...props} />,
        table: ({ className, ...props }) => (
          <div className="my-6 w-full overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <table className={cn("w-full text-sm", className)} {...props} />
          </div>
        ),
        tr: ({ className, ...props }) => (
          <tr
            className={cn(
              "m-0 border-t border-zinc-200 p-0 even:bg-zinc-50 dark:border-zinc-800 dark:even:bg-zinc-800/20",
              className
            )}
            {...props}
          />
        ),
        th: ({ className, ...props }) => (
          <th
            className={cn(
              "border border-zinc-200 px-4 py-3 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800",
              className
            )}
            {...props}
          />
        ),
        td: ({ className, ...props }) => (
          <td
            className={cn(
              "border border-zinc-200 px-4 py-3 text-left [&[align=center]]:text-center [&[align=right]]:text-right dark:border-zinc-800 text-zinc-700 dark:text-zinc-300",
              className
            )}
            {...props}
          />
        ),
        pre: ({ className, ...props }) => (
          <pre
            className={cn(
              "mb-4 mt-6 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-950 py-4 px-4 dark:border-zinc-800 text-zinc-50",
              className
            )}
            {...props}
          />
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          if (inline) {
            return (
              <code
                className={cn(
                  "relative rounded bg-zinc-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code
              className={cn(
                "relative font-mono text-sm bg-transparent",
                className
              )}
              {...props}
            >
              {children}
            </code>
          );
        },
        a: ({ className, ...props }) => (
          <a
            className={cn("font-medium text-blue-600 underline underline-offset-4 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors", className)}
            {...props}
            target="_blank"
            rel="noreferrer"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
