import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronRight } from "lucide-react";
import { VideoFooter } from "@/components/video-footer";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guias práticos da Figueira Home para comprar e vender casa na Figueira da Foz."
};

export default function BlogPage() {
  const [featuredPost, ...remainingPosts] = blogPosts;

  return (
    <>
      <main className="overflow-hidden bg-white pt-[72px]">
        <section className="container pb-[72px] pt-[76px]">
          <p className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]"><BookOpen size={15} aria-hidden="true" /> Figueira Home</p>
          <div className="mt-5 grid items-end gap-10 lg:grid-cols-[1.2fr_.8fr] lg:gap-14">
            <h1 className="max-w-[760px] !font-sans text-[clamp(2.55rem,6vw,5.45rem)] font-bold leading-[.94] tracking-[-.07em] text-[#101820]">Guias para tomar decisões com mais confiança.</h1>
            <p className="mb-1 max-w-[390px] text-[1.05rem] leading-7 text-[#40505e]">Informação clara para quem quer comprar, vender ou acompanhar o mercado imobiliário na Figueira da Foz.</p>
          </div>
        </section>

        <section className="container pb-[88px]" aria-labelledby="featured-article-title">
          <p className="border-b border-[#101820] pb-[13px] font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]">Em destaque</p>
          <Link href={`/blog/${featuredPost.slug}`} className="grid min-h-[360px] gap-12 bg-[#002fa7] p-8 text-white transition-colors hover:bg-[#0038c5] md:grid-cols-[1.1fr_.9fr] md:p-11">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.11em]">{featuredPost.category} <span>·</span> {featuredPost.readTime}</p>
              <h2 id="featured-article-title" className="mt-5 max-w-[650px] !font-sans text-[clamp(2rem,4vw,3.9rem)] font-bold leading-[.96] tracking-[-.06em]">{featuredPost.title}</h2>
            </div>
            <div className="self-end">
              <p className="max-w-[360px] text-[1.05rem] leading-7">{featuredPost.description}</p>
              <span className="mt-[26px] inline-flex items-center gap-2 font-sans text-sm font-bold underline underline-offset-4">Leia o guia <ArrowUpRight size={17} aria-hidden="true" /></span>
            </div>
          </Link>
        </section>

        <section className="container pb-[76px]" aria-labelledby="all-articles-title">
          <div className="flex flex-col justify-between gap-4 border-b border-[#101820] pb-4 sm:flex-row sm:items-baseline">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]">Todos os artigos</p>
            <h2 id="all-articles-title" className="m-0 !font-sans text-lg font-bold tracking-[-.02em]">Para consultar quando precisar.</h2>
          </div>
          <div>
            {remainingPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="grid grid-cols-[52px_minmax(0,1fr)_28px] items-center gap-4 border-b border-[#c7d0da] py-[30px] transition-all hover:pl-3 hover:text-[#002fa7] sm:grid-cols-[80px_minmax(0,1fr)_28px] sm:gap-5">
                <span className="font-sans text-sm font-bold text-[#002fa7]">0{index + 1}</span>
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]">{post.category} <span>·</span> {post.readTime}</p>
                  <h3 className="my-3 !font-sans text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-none tracking-[-.045em]">{post.title}</h3>
                  <p className="max-w-[620px] leading-6 text-[#52616e]">{post.description}</p>
                </div>
                <ChevronRight size={24} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="container mb-[88px] flex flex-col justify-between gap-5 border-y border-[#101820] py-7 sm:flex-row sm:items-center">
          <p className="m-0 font-sans text-[clamp(1.45rem,2.5vw,2.1rem)] font-bold leading-tight tracking-[-.04em] text-[#101820]">Tem uma questão sobre o seu imóvel?</p>
          <Link href="/contacto" className="inline-flex shrink-0 items-center gap-2 font-sans text-sm font-bold text-[#002fa7] underline underline-offset-4">Fale connosco <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </section>
      </main>
      <VideoFooter />
    </>
  );
}
