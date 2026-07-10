"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { UIMessage } from "ai";
import { clsx } from "clsx";

export function MessageResponse({ children }: { children: string }) {
  return (
    <div className="prose-ai">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

export function Message({ message }: { message: UIMessage }) {
  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  const toolParts = message.parts.filter((part) => part.type.startsWith("tool-"));

  return (
    <div className={clsx("rounded-md p-3 text-sm", message.role === "user" ? "ml-8 bg-[var(--blue)] text-white" : "mr-8 bg-white text-[var(--text)] shadow-sm")}>
      {text ? <MessageResponse>{text}</MessageResponse> : null}
      {toolParts.length > 0 && (
        <div className="mt-2 rounded border border-[var(--border)] bg-[var(--offwhite)] px-2 py-1 text-xs text-[var(--muted)]">
          A consultar dados da Figueira Home
        </div>
      )}
    </div>
  );
}
