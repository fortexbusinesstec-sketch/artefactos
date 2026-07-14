"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownViewerProps {
  content: string;
  isDark?: boolean;
}

function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`]/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ level, text, id });
    }
  }
  return headings;
}

function TocPanel({
  headings,
  isDark,
  onClose,
}: {
  headings: { level: number; text: string; id: string }[];
  isDark?: boolean;
  onClose?: () => void;
}) {
  return (
    <nav
      className={`rounded-xl border p-4 ${
        isDark
          ? "border-zinc-800 bg-zinc-900/80 backdrop-blur"
          : "border-zinc-200/60 bg-zinc-50/80 backdrop-blur"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${
          isDark ? "text-zinc-400" : "text-zinc-500"
        }`}>
          Contenido
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className={`rounded-md p-1 transition-colors ${
              isDark ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <ul className="space-y-0.5">
        {headings.map((h, i) => (
          <li key={i}>
            <a
              href={`#${h.id}`}
              onClick={onClose}
              className={`block rounded-md px-2.5 py-1.5 text-xs transition-all ${
                isDark
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900"
              } ${h.level === 2 ? "pl-5" : h.level === 3 ? "pl-7" : ""}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt?: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export function MarkdownViewer({ content, isDark }: MarkdownViewerProps) {
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt?: string;
  } | null>(null);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});

  const headings = useMemo(() => extractHeadings(content), [content]);
  const hasToc = headings.length > 2;

  const handleTaskToggle = useCallback((id: string) => {
    setTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const syntaxStyle = isDark ? oneDark : oneLight;

  return (
    <>
      <div className="flex gap-6">
        {hasToc && (
          <div className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24">
              <TocPanel headings={headings} isDark={isDark} />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <article
            className={`prose max-w-none ${
              isDark ? "prose-invert prose-zinc" : "prose-zinc"
            } prose-headings:scroll-mt-20 prose-a:text-blue-600 prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 dark:prose-a:text-blue-400`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                h1({ children, ...props }) {
                  const text = String(children).replace(/[*_`]/g, "");
                  const id = text
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h1
                      id={id}
                      className={`pb-3 ${
                        isDark
                          ? "border-b border-zinc-800"
                          : "border-b border-zinc-200"
                      }`}
                      {...props}
                    >
                      {children}
                    </h1>
                  );
                },
                h2({ children, ...props }) {
                  const text = String(children).replace(/[*_`]/g, "");
                  const id = text
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h2
                      id={id}
                      className={`pb-2 ${
                        isDark
                          ? "border-b border-zinc-800/80"
                          : "border-b border-zinc-100"
                      }`}
                      {...props}
                    >
                      {children}
                    </h2>
                  );
                },
                h3({ children, ...props }) {
                  const text = String(children).replace(/[*_`]/g, "");
                  const id = text
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-");
                  return (
                    <h3 id={id} {...props}>
                      {children}
                    </h3>
                  );
                },
                a({ href, children, ...props }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-medium underline decoration-2 underline-offset-2 transition-colors ${
                        isDark
                          ? "decoration-blue-500/40 hover:text-blue-300 hover:decoration-blue-400"
                          : "decoration-blue-400/40 hover:text-blue-600 hover:decoration-blue-600"
                      }`}
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
                img({ src, alt, ...props }) {
                  const imgSrc = typeof src === "string" ? src : "";
                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                    <img
                      src={imgSrc}
                      alt={alt || ""}
                      className={`cursor-pointer rounded-xl transition-all hover:scale-[1.01] ${
                        isDark
                          ? "ring-1 ring-zinc-800 hover:ring-zinc-600"
                          : "ring-1 ring-zinc-200 shadow-sm hover:shadow-md"
                      }`}
                      onClick={() =>
                        setLightbox({ src: imgSrc, alt: alt || "" })
                      }
                      {...props}
                    />
                  );
                },
                blockquote({ children, ...props }) {
                  return (
                    <blockquote
                      className={`rounded-r-xl border-l-4 py-2 pr-4 italic ${
                        isDark
                          ? "border-blue-500/60 bg-blue-500/5 pl-5"
                          : "border-blue-500 bg-blue-50/50 pl-5"
                      }`}
                      {...props}
                    >
                      {children}
                    </blockquote>
                  );
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  const inline = !match && !codeString.includes("\n");

                  if (!inline && match) {
                    return (
                      <div className="group relative">
                        <div
                          className={`absolute right-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                            isDark
                              ? "bg-zinc-700/80 text-zinc-400"
                              : "bg-zinc-200/80 text-zinc-500"
                          }`}
                        >
                          {match[1]}
                        </div>
                        <SyntaxHighlighter
                          style={syntaxStyle}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: "0.75rem",
                            fontSize: "0.875rem",
                            lineHeight: "1.7",
                          }}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code
                      className={`rounded-md px-1.5 py-0.5 text-sm font-mono ${
                        isDark
                          ? "bg-zinc-800 text-zinc-300 ring-1 ring-zinc-700/50"
                          : "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200"
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table({ children, ...props }) {
                  return (
                    <div className={`overflow-x-auto rounded-xl border ${
                      isDark ? "border-zinc-800" : "border-zinc-200"
                    }`}>
                      <table className="min-w-full" {...props}>
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children, ...props }) {
                  return (
                    <th
                      className={`border-b px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider ${
                        isDark
                          ? "border-zinc-800 bg-zinc-800/50 text-zinc-400"
                          : "border-zinc-200 bg-zinc-50 text-zinc-500"
                      }`}
                      {...props}
                    >
                      {children}
                    </th>
                  );
                },
                td({ children, ...props }) {
                  return (
                    <td
                      className={`px-4 py-2.5 text-sm ${
                        isDark
                          ? "border-b border-zinc-800/50"
                          : "border-b border-zinc-100"
                      }`}
                      {...props}
                    >
                      {children}
                    </td>
                  );
                },
                hr(props) {
                  return (
                    <hr
                      className={`my-8 ${
                        isDark ? "border-zinc-800" : "border-zinc-200"
                      }`}
                      {...props}
                    />
                  );
                },
                ul({ children, ...props }) {
                  return (
                    <ul className="list-disc space-y-1 pl-6" {...props}>
                      {children}
                    </ul>
                  );
                },
                ol({ children, ...props }) {
                  return (
                    <ol className="list-decimal space-y-1 pl-6" {...props}>
                      {children}
                    </ol>
                  );
                },
                li({ children, ...props }) {
                  const childArray = Array.isArray(children) ? children : [children];
                  const firstChild = childArray[0] as ReactNode & {
                    props?: { children?: ReactNode };
                  };

                  if (
                    firstChild &&
                    typeof firstChild === "object" &&
                    "props" in firstChild &&
                    firstChild.props?.children
                  ) {
                    const text = String(firstChild.props.children);
                    const taskMatch = text.match(/^\[([ x])\]\s*(.*)/);

                    if (taskMatch) {
                      const checked = taskMatch[1] === "x";
                      const taskText = taskMatch[2];
                      const taskId = taskText
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-");
                      const isChecked = tasks[taskId] ?? checked;

                      return (
                        <li className="list-none" {...props}>
                          <label className="flex cursor-pointer items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTaskToggle(taskId)}
                              className={`mt-0.5 h-4 w-4 rounded-md border-2 ${
                                isDark
                                  ? "border-zinc-600 bg-zinc-800 text-blue-400"
                                  : "border-zinc-300 bg-white text-blue-600"
                              } focus:ring-2 focus:ring-blue-500/20`}
                            />
                            <span
                              className={`text-sm ${
                                isChecked
                                  ? isDark
                                    ? "text-zinc-500 line-through"
                                    : "text-zinc-400 line-through"
                                  : ""
                              }`}
                            >
                              {taskText}
                            </span>
                          </label>
                        </li>
                      );
                    }
                  }

                  return (
                    <li className="leading-relaxed" {...props}>
                      {children}
                    </li>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      {hasToc && (
        <div className="fixed bottom-20 right-4 z-50 lg:hidden">
          <TocFloating content={content} headings={headings} isDark={isDark} />
        </div>
      )}

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

function TocFloating({
  headings,
  isDark,
}: {
  content: string;
  headings: { level: number; text: string; id: string }[];
  isDark?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg backdrop-blur transition-all ${
          isDark
            ? "bg-zinc-800/90 text-white shadow-black/30 hover:bg-zinc-700"
            : "bg-white/90 text-zinc-900 shadow-zinc-200 hover:bg-zinc-100"
        }`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className={`w-full max-w-sm rounded-t-2xl p-4 sm:rounded-2xl ${
              isDark ? "bg-zinc-900" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <TocPanel
              headings={headings}
              isDark={isDark}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
