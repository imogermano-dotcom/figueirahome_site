import type { Metadata } from "next";
import Link from "next/link";
import { VideoFooter } from "@/components/video-footer";

export const metadata: Metadata = { title: "Blog", description: "Guias e notas da Figueira Home sobre o mercado imobiliário na Figueira da Foz." };

const posts = [
  { slug: "como-preparar-imovel-para-venda", title: "Como preparar o seu imóvel para venda", desc: "Documentação, apresentação e preço de mercado antes da publicação." },
  { slug: "comprar-casa-na-figueira-da-foz", title: "Comprar casa na Figueira da Foz", desc: "Pontos a avaliar por zona, tipologia e objetivo de uso." }
];

export default function BlogPage() {
  return (
    <>
      <main className="container pt-28 pb-16">
        <h1 className="section-title">Blog</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-md border border-[var(--border)] p-6 transition hover:border-[var(--blue)]">
              <h2 className="text-xl font-extrabold">{post.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{post.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <VideoFooter />
    </>
  );
}
