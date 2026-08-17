import archive from "@/content/blog-archive.json";

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; lines: string[] };

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
