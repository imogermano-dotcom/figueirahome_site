import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronRight } from "lucide-react";
import { VideoFooter } from "@/components/video-footer";
import { getAllBlogPosts, formatBlogDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guias práticos da Figueira Home para comprar e vender casa na Figueira da Foz.",
  alternates: { canonical: "/blog" }
};

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();
  const featuredPost = [...blogPosts].sort((first, second) => (second.publishedAt ?? "").localeCompare(first.publishedAt ?? ""))[0];
  const remainingPosts = blogPosts.filter((post) => post.slug !== featuredPost.slug);
  const featuredParagraphs = featuredPost.blocks.filter((block) => block.type === "paragraph").slice(0, 2);

  return (
    <>
      <main className="overflow-hidden bg-white pt-[72px]">
        <section className="container pb-[72px] pt-[76px]">
          <p className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]"><BookOpen size={15} aria-hidden="true" /> Figueira Home</p>
          <div className="mt-5"><h1 className="!font-sans text-[clamp(2rem,3.3vw,2.85rem)] font-bold leading-[1.04] tracking-[-.055em] text-[#101820]">Guias para tomar decisões com mais confiança.</h1><p className="mt-5 max-w-[540px] text-[1.05rem] leading-7 text-[#40505e]">Informação clara para quem quer comprar, vender ou acompanhar o mercado imobiliário na Figueira da Foz.</p></div>
        </section>

        <section className="container pb-[88px]" aria-labelledby="featured-article-title">
          <p className="border-b border-[#101820] pb-[13px] font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]">Em destaque</p>
          <article className="grid border-b border-[#101820] bg-white md:grid-cols-[1.1fr_.9fr]">
            <div className="relative min-h-[320px] overflow-hidden bg-[#002fa7]">
              {featuredPost.coverImage && <Image src={featuredPost.coverImage} alt={featuredPost.coverImageAlt ?? `Imagem do artigo: ${featuredPost.title}`} fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />}
              <h2 id="featured-article-title" className="absolute bottom-0 left-0 right-6 m-0 bg-[#005aa9] px-6 py-5 !font-sans text-[clamp(1.35rem,2.3vw,2rem)] font-bold leading-tight tracking-[-.03em] text-white sm:right-10 sm:px-8">{featuredPost.title}</h2>
            </div>
            <div className="flex flex-col px-7 py-8 sm:px-9 md:py-10 md:pt-0">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]">{featuredPost.category}{featuredPost.publishedAt && <><span> · </span><time dateTime={featuredPost.publishedAt}>{formatBlogDate(featuredPost.publishedAt)}</time></>} <span> · </span>{featuredPost.readTime}</p>
              <div className="mt-5 space-y-4 text-[1.02rem] leading-7 text-[#40505e]">{featuredParagraphs.length > 0 ? featuredParagraphs.map((block, index) => <p key={index} className="m-0">{block.text}</p>) : <p className="m-0">{featuredPost.description}</p>}</div>
              <Link href={`/blog/${featuredPost.slug}`} className="mt-8 inline-flex w-fit items-center gap-2 bg-[#005aa9] px-5 py-3 font-sans text-sm font-bold text-white transition-colors hover:bg-[#002fa7]">Ler mais <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </article>
        </section>

        <section className="container pb-[76px]" aria-labelledby="all-articles-title">
          <div className="flex flex-col justify-between gap-4 border-b border-[#101820] pb-4 sm:flex-row sm:items-baseline"><p className="font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]">Todos os artigos</p><h2 id="all-articles-title" className="m-0 !font-sans text-lg font-bold tracking-[-.02em]">Para consultar quando precisar.</h2></div>
          <div>{remainingPosts.map((post, index) => <Link key={post.slug} href={`/blog/${post.slug}`} className="grid grid-cols-[52px_minmax(0,1fr)_28px] items-center gap-4 border-b border-[#c7d0da] py-[30px] transition-all hover:pl-3 hover:text-[#002fa7] sm:grid-cols-[80px_minmax(0,1fr)_28px] sm:gap-5"><span className="font-sans text-sm font-bold text-[#002fa7]">{String(index + 1).padStart(2, "0")}</span><div><p className="font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]">{post.category}{post.publishedAt && <><span> · </span><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time></>} <span> · </span>{post.readTime}</p><h3 className="my-3 !font-sans text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-none tracking-[-.045em]">{post.title}</h3><p className="max-w-[620px] leading-6 text-[#52616e]">{post.description}</p></div><ChevronRight size={24} aria-hidden="true" /></Link>)}</div>
        </section>

        <section className="container mb-[88px] flex flex-col justify-between gap-5 border-y border-[#101820] py-7 sm:flex-row sm:items-center"><p className="m-0 font-sans text-[clamp(1.45rem,2.5vw,2.1rem)] font-bold leading-tight tracking-[-.04em] text-[#101820]">Tem uma questão sobre o seu imóvel?</p><Link href="/contacto" className="inline-flex shrink-0 items-center gap-2 font-sans text-sm font-bold text-[#002fa7] underline underline-offset-4">Fale connosco <ArrowUpRight size={17} aria-hidden="true" /></Link></section>
      </main>
      <VideoFooter />
    </>
  );
}
