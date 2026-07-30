type PropertyVideoProps = {
  url: string;
  title: string;
};

export type VideoSource =
  | { kind: "embed"; src: string }
  | { kind: "file"; src: string };

export function PropertyVideo({ url, title }: PropertyVideoProps) {
  const video = videoSourceFromUrl(url);
  if (!video) return null;

  if (video.kind === "file") {
    return <video className="block aspect-video w-full bg-[var(--navy)]" controls preload="metadata"><source src={video.src} />O seu navegador não suporta vídeo HTML5.</video>;
  }

  return <iframe title={`Vídeo: ${title}`} src={video.src} className="block aspect-video w-full border-0 bg-[var(--navy)]" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />;
}

export function videoSourceFromUrl(value: string): VideoSource | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const segments = url.pathname.split("/").filter(Boolean);
    const isYoutube = hostname === "youtu.be" || hostname.endsWith("youtube.com");

    if (isYoutube) {
      const id = hostname === "youtu.be" ? segments[0] : url.searchParams.get("v") || segments.find((segment, index) => (segments[index - 1] === "embed" || segments[index - 1] === "shorts" || segments[index - 1] === "v") && Boolean(segment));
      return id ? { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` } : null;
    }

    if (hostname === "vimeo.com" || hostname.endsWith("vimeo.com")) {
      const id = segments.find((segment) => /^\d+$/.test(segment));
      return id ? { kind: "embed", src: `https://player.vimeo.com/video/${id}` } : null;
    }

    if (/\.(mp4|webm|ogg|ogv)$/i.test(url.pathname)) return { kind: "file", src: url.toString() };
    return { kind: "embed", src: url.toString() };
  } catch {
    return null;
  }
}
