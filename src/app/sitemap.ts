import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getProperties } from "@/lib/properties";
import { figueiraTeam } from "@/lib/team";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://figueirahome.pt";
  const staticRoutes = ["", "/imoveis", "/empreendimentos", "/quem-somos", "/blog", "/contacto"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
  const [properties, blogPosts] = await Promise.all([getProperties(), getAllBlogPosts()]);
  return [
    ...staticRoutes,
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date()
    })),
    ...figueiraTeam.map((member) => ({
      url: `${base}/consultores/${member.id}`,
      lastModified: new Date()
    })),
    ...properties.map((property) => ({
      url: `${base}/imoveis/${property.slug}`,
      lastModified: new Date(property.updated_at)
    }))
  ];
}
