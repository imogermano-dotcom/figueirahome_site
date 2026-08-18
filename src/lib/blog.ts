import archive from "@/content/blog-archive.json";

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; lines: string[] };

export type BlogTable = {
  headers: string[];
  rows: string[][];
};

const tableBlockBreak = "\u0000";

function joinTableCell(...parts: string[]) {
  return parts.filter(Boolean).join(" ");
}

function isCompleteTableRow(row: string[]) {
  const lastCell = [...row].reverse().find(Boolean);
  return Boolean(lastCell && /[.!?%]$/.test(lastCell));
}

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  author: string;
  publishedAt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  content: string;
  images: string[];
  blocks: BlogBlock[];
};

export const blogPosts = archive as BlogPost[];

function splitTableLine(line: string, columnCount: number) {
  const cells = line.replace(/\u00a0/g, " ").trimEnd().split(/ {2,}/).map((cell) => cell.trim());
  const normalisedCells = cells.length > columnCount ? [...cells.slice(0, columnCount - 1), cells.slice(columnCount - 1).join(" ")] : cells;
  return Array.from({ length: columnCount }, (_, index) => normalisedCells[index] ?? "");
}

export function toBlogTable(lines: string[]): BlogTable | null {
  const sourceLines = lines.map((line) => line.trimEnd()).filter(Boolean);
  if (sourceLines.length < 2) return null;

  const headers = sourceLines[0].split(/ {2,}/).map((cell) => cell.trim()).filter(Boolean);
  if (headers.length < 2) return null;

  const rows: string[][] = [];
  let beginsNewBlock = false;
  for (const line of sourceLines.slice(1)) {
    if (line === tableBlockBreak) {
      beginsNewBlock = true;
      continue;
    }

    const cells = splitTableLine(line, headers.length);
    const previousRow = rows[rows.length - 1];

    if (cells[0]) {
      if (previousRow && !previousRow[0] && previousRow.slice(1).some(Boolean)) {
        previousRow[0] = cells[0];
        cells.slice(1).forEach((cell, index) => {
          previousRow[index + 1] = joinTableCell(previousRow[index + 1], cell);
        });
      } else {
        rows.push(cells);
      }
      beginsNewBlock = false;
      continue;
    }

    if (beginsNewBlock && previousRow && (!previousRow[0] || !isCompleteTableRow(previousRow))) {
      cells.forEach((cell, index) => {
        if (cell) previousRow[index] = joinTableCell(previousRow[index], cell);
      });
      beginsNewBlock = false;
      continue;
    }

    if (beginsNewBlock || !previousRow) {
      rows.push(cells);
      beginsNewBlock = false;
      continue;
    }

    cells.forEach((cell, index) => {
      if (cell) previousRow[index] = joinTableCell(previousRow[index], cell);
    });
  }

  return rows.length > 0 ? { headers, rows } : null;
}

export function mergeBlogTableBlocks(blocks: BlogBlock[]) {
  const mergedBlocks: BlogBlock[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.type !== "table") {
      mergedBlocks.push(block);
      continue;
    }

    const lines = [...block.lines];
    while (true) {
      const nextBlock = blocks[index + 1];
      if (nextBlock?.type !== "table") break;
      index += 1;
      lines.push(tableBlockBreak, ...nextBlock.lines);
    }
    mergedBlocks.push({ type: "table", lines });
  }

  return mergedBlocks;
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(slug: string, max = 3) {
  const currentPost = getBlogPost(slug);
  if (!currentPost) return [];

  const otherPosts = blogPosts.filter((post) => post.slug !== slug);
  const sameCategory = otherPosts.filter((post) => post.category === currentPost.category);
  const remainingPosts = otherPosts.filter((post) => post.category !== currentPost.category);

  return [...sameCategory, ...remainingPosts].slice(0, max);
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00`));
}
