import type { Property, PropertyImage } from "./types";

// O CDN do eGO serve a mesma foto em vários tamanhos (Z<largura>x<altura>). Só existem estes:
// Z320x240, Z480x360, Z640x480, Z800x600, Z1024x768, Z1280x1024 (Z960x720, Z400x300, Z240x180 dão 404).
const EGO_IMAGE = /(images\.egorealestate\.com\/)Z\d+x\d+\//;

export function egoImage(url: string, size: string) {
  return url.replace(EGO_IMAGE, `$1${size}/`);
}

export function egoSrcSet(url: string) {
  if (!EGO_IMAGE.test(url)) return undefined;
  return [["Z640x480", 640], ["Z800x600", 800], ["Z1024x768", 1024], ["Z1280x1024", 1280]].map(([size, width]) => `${egoImage(url, String(size))} ${width}w`).join(", ");
}

export function getPrimaryPropertyImage(property: Property): PropertyImage | null {
  const images = (property.images || [])
    .filter((image) => image.url?.trim())
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

  return images[0] || null;
}
