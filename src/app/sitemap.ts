import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://figueirahome.pt";
  const staticRoutes = ["", "/imoveis", "/empreendimentos", "/quem-somos", "/blog", "/contacto"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
  const properties = await getProperties();
  return [
    ...staticRoutes,
    ...properties.map((property) => ({
      url: `${base}/imoveis/${property.slug}`,
      lastModified: new Date(property.updated_at)
    }))
  ];
}
