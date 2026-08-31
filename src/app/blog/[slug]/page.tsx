import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { VideoFooter } from "@/components/video-footer";
import { getAllBlogPosts, formatBlogDate, getBlogPost, getRelatedBlogPosts, mergeBlogTableBlocks, toBlogTable } from "@/lib/blog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return post ? { title: post.title, description: post.description } : { title: "Artigo não encontrado" };
}

export async function generateStaticParams() {
  const blogPosts = await getAllBlogPosts();
  return blogPosts.map(({ slug }) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const relatedPosts = await getRelatedBlogPosts(slug);
  const articleBlocks = mergeBlogTableBlocks(post.blocks);

  return (
    <>
      <main className="bg-[#f5f5f3] pb-[84px] pt-[104px]">
        <div className="container max-w-[1010px]">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-[#637282]" aria-label="Navegação estrutural"><Link href="/blog" className="hover:text-[#002fa7] hover:underline hover:underline-offset-4">Blog</Link><ChevronRight size={14} aria-hidden="true" /><span>{post.category}</span></nav>

          <header>
            {post.coverImage && <figure className="relative aspect-[16/9] overflow-hidden bg-[#002fa7]"><Image src={post.coverImage} alt={post.coverImageAlt ?? "Imagem do artigo"} fill priority sizes="(min-width: 1024px) 930px, calc(100vw - 3rem)" className="object-cover" /></figure>}
            <div className="relative z-10 mx-7 -mt-16 bg-[#005aa9] px-6 py-6 text-white sm:mx-8 sm:px-8 sm:py-7">
              <h1 className="m-0 !font-sans text-[clamp(1.35rem,2.4vw,1.65rem)] font-bold leading-tight tracking-[-.025em]">{post.title}</h1>
              <p className="mb-0 mt-5 text-sm leading-6 text-[#07131d]">Por {post.author} · Publicado em {post.publishedAt && formatBlogDate(post.publishedAt)}</p>
            </div>
          </header>

          <div className="bg-white pb-12 pt-8">
            <aside className="mb-8"><Link href="/blog" className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#005aa9] hover:underline hover:underline-offset-4"><ArrowLeft size={16} aria-hidden="true" /> Todos os artigos</Link></aside>
            <article className="max-w-[720px] text-[1.03rem] leading-8 text-[#46515a]">
              {articleBlocks.map((block, index) => {
                if (block.type === "heading") return <h2 key={`${block.text}-${index}`} className="mb-4 mt-12 !font-sans text-[clamp(1.45rem,2.7vw,2rem)] font-bold leading-tight tracking-[-.035em] text-[#202830] first:mt-0">{block.text}</h2>;
                if (block.type === "list") return <ul key={`list-${index}`} className="my-6 grid gap-2.5 p-0">{block.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`} className="relative list-none pl-5 before:absolute before:left-0 before:top-[.8em] before:h-[7px] before:w-[7px] before:bg-[#005aa9]">{item}</li>)}</ul>;
                if (block.type === "table") {
                  const table = toBlogTable(block.lines);
                  return table ? <div key={`table-${index}`} className="my-8 overflow-x-auto border-y border-[#b9c2c9] bg-[#fbfcfc]"><table className="min-w-full border-collapse text-left font-sans text-sm leading-6 text-[#2d3b48]"><thead className="border-b border-[#b9c2c9] bg-[#edf2f5]"><tr>{table.headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-bold text-[#202830]">{header}</th>)}</tr></thead><tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-[#d7dfe4] last:border-b-0">{row.map((cell, cellIndex) => <td key={cellIndex} className="align-top px-4 py-3">{cell}</td>)}</tr>)}</tbody></table></div> : <div key={`table-${index}`} className="my-8 overflow-x-auto border-y border-[#b9c2c9] bg-[#fbfcfc] px-4 py-5"><pre className="m-0 min-w-max whitespace-pre font-sans text-sm leading-6 text-[#2d3b48]">{block.lines.join("\n")}</pre></div>;
                }
                return <p key={`${block.text.slice(0, 50)}-${index}`} className="m-0 mt-[18px] first:mt-0">{block.text}</p>;
              })}
              {post.images.length > 1 && <section className="mt-14 border-t border-[#b9c2c9] pt-8" aria-labelledby="article-images-title"><h2 id="article-images-title" className="mb-6 !font-sans text-[clamp(1.45rem,2.7vw,2rem)] font-bold leading-tight tracking-[-.035em] text-[#202830]">Imagens do artigo</h2><div className="grid gap-5 sm:grid-cols-2">{post.images.slice(1).map((image, imageIndex) => <figure key={image} className="relative aspect-[16/10] overflow-hidden bg-[#e8edf1]"><Image src={image} alt={`${post.title} - imagem ${imageIndex + 2}`} fill sizes="(min-width: 768px) 340px, calc(100vw - 7rem)" className="object-cover" /></figure>)}</div></section>}
            </article>
          </div>

          <section className="mx-7 mt-9 flex flex-col justify-between gap-5 border-y border-[#101820] bg-white px-6 py-7 sm:mx-8 sm:px-8 lg:ml-[230px] lg:flex-row lg:items-end"><p className="m-0 max-w-[390px] font-sans text-[1.35rem] font-bold leading-tight tracking-[-.035em] text-[#101820]">Quer conversar sobre o seu próximo passo?</p><Link href="/contacto" className="inline-flex shrink-0 items-center gap-2 font-sans text-sm font-bold text-[#005aa9] underline underline-offset-4">Contacte a Figueira Home <ArrowUpRight size={17} aria-hidden="true" /></Link></section>

          {relatedPosts.length > 0 && <section className="mx-7 mt-14 bg-white px-6 pb-8 sm:mx-8 sm:px-8 lg:ml-[230px]" aria-labelledby="related-articles-title"><div className="flex items-baseline justify-between gap-4 border-b border-[#101820] pb-4"><p className="font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#005aa9]">Continue a ler</p><h2 id="related-articles-title" className="m-0 !font-sans text-lg font-bold tracking-[-.02em] text-[#101820]">Artigos relacionados</h2></div><div>{relatedPosts.map((relatedPost, index) => <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="grid grid-cols-[38px_minmax(0,1fr)_20px] items-center gap-3 border-b border-[#c7d0da] py-5 transition-colors hover:text-[#005aa9]"><span className="font-sans text-sm font-bold text-[#005aa9]">{String(index + 1).padStart(2, "0")}</span><span><span className="block font-sans text-xs font-bold uppercase tracking-[0.1em] text-[#005aa9]">{relatedPost.category}</span><span className="mt-1 block font-sans text-lg font-bold leading-tight tracking-[-.025em]">{relatedPost.title}</span></span><ChevronRight size={20} aria-hidden="true" /></Link>)}</div></section>}
        </div>
      </main>
      <VideoFooter />
    </>
  );
}
