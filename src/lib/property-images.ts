import type { Property, PropertyImage } from "./types";

export function getPrimaryPropertyImage(property: Property): PropertyImage | null {
  const images = (property.images || [])
    .filter((image) => image.url?.trim())
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });

  return images[0] || null;
}
