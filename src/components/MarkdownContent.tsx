import Link from "next/link";
import type { ReactNode } from "react";

type MarkdownContentProps = {
  value: string;
  className?: string;
};

function renderInline(value: string) {
  const parts = value.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index): ReactNode => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <Link key={`${part}-${index}`} href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4">
          {linkMatch[1]}
        </Link>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${part}-${index}`} className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-cyan-100">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

function flushList(items: string[], blocks: ReactNode[], key: string) {
  if (items.length === 0) return;

  blocks.push(
    <ul key={key} className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.7)]" />
          <span>{renderInline(item)}</span>
        </li>
      ))}
    </ul>,
  );

  items.length = 0;
}

export default function MarkdownContent({ value, className }: MarkdownContentProps) {
  const blocks: ReactNode[] = [];
  const listItems: string[] = [];
  const lines = value.replace(/\r\n/g, "\n").split("\n");

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    const listMatch = line.match(/^(?:[-*]|\u2022)\s+(.+)$/);

    if (!line) {
      flushList(listItems, blocks, `list-${index}`);
      return;
    }

    if (listMatch) {
      listItems.push(listMatch[1]);
      return;
    }

    flushList(listItems, blocks, `list-${index}`);

    if (line.startsWith("### ")) {
      blocks.push(<h4 key={`h4-${index}`} className="text-lg font-semibold text-white">{renderInline(line.slice(4))}</h4>);
      return;
    }

    if (line.startsWith("## ")) {
      blocks.push(<h3 key={`h3-${index}`} className="text-xl font-semibold text-white">{renderInline(line.slice(3))}</h3>);
      return;
    }

    if (line.startsWith("# ")) {
      blocks.push(<h2 key={`h2-${index}`} className="text-2xl font-semibold text-white">{renderInline(line.slice(2))}</h2>);
      return;
    }

    blocks.push(<p key={`p-${index}`} className="text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{renderInline(line)}</p>);
  });

  flushList(listItems, blocks, "list-final");

  return <div className={className ?? "space-y-4"}>{blocks}</div>;
}
