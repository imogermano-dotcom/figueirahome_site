import Link from "next/link";
import { Bath, BedDouble, MapPin, MoveRight, Ruler } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatArea, formatCurrency } from "@/lib/format";
import { getPrimaryPropertyImage } from "@/lib/property-images";

export function PropertyCard({ property, dark = false }: { property: Property; dark?: boolean }) {
  const primaryImage = getPrimaryPropertyImage(property);

  return (
    <article className={`zoom-card overflow-hidden rounded-md border transition hover:-translate-y-1 ${dark ? "border-white/10 bg-[var(--navy2)] text-white" : "border-[var(--border)] bg-white text-[var(--text)]"}`}>
      <Link href={`/imoveis/${property.slug}`} className="block">
        <div className="property-media relative flex h-[210px] items-center justify-center overflow-hidden">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="zoom-layer h-full w-full object-cover" src={primaryImage.url} alt={primaryImage.alt || property.title} loading="lazy" />
          ) : (
            <PropertyFallback property={property} />
          )}
          <span className="absolute left-3 top-3 rounded-sm bg-[var(--gold)] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
            {property.status}
          </span>
        </div>
        <div className="p-5">
          <div className="mb-2 text-xs font-extrabold uppercase tracking-[1.5px] text-[var(--gold-l)]">{property.type}</div>
          <h3 className="mb-2 text-lg font-extrabold leading-snug">{property.title}</h3>
          <p className={`mb-4 flex items-start gap-2 text-sm ${dark ? "text-white/60" : "text-[var(--muted)]"}`}>
            <MapPin size={16} className="mt-0.5 shrink-0" /> {property.location}
          </p>
          <div className={`flex items-end justify-between border-t pt-4 ${dark ? "border-white/10" : "border-[var(--border)]"}`}>
            <div>
              <div className="display-font text-xl font-extrabold">{formatCurrency(property.price)}</div>
              <div className={`mt-2 flex flex-wrap gap-3 text-sm ${dark ? "text-white/60" : "text-[var(--muted)]"}`}>
                <span className="inline-flex items-center gap-1"><BedDouble size={15} />{property.bedrooms ?? "-"}</span>
                <span className="inline-flex items-center gap-1"><Bath size={15} />{property.bathrooms ?? "-"}</span>
                <span className="inline-flex items-center gap-1"><Ruler size={15} />{formatArea(property.area_sqm)}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-sm border border-[rgba(201,148,58,0.5)] px-3 py-2 text-sm font-extrabold text-[var(--gold-l)]">
              Ver <MoveRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function PropertyFallback({ property }: { property: Property }) {
  return (
    <div className="property-fallback zoom-layer h-full w-full">
      <div className="property-fallback-content">
        <span>{property.type}</span>
        <strong>{property.location}</strong>
      </div>
    </div>
  );
}
