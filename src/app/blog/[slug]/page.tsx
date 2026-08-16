import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { VideoFooter } from "@/components/video-footer";
import { blogPosts, getBlogPost } from "@/lib/blog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return post ? { title: post.title, description: post.description } : { title: "Artigo não encontrado" };
}

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <main className="bg-white pb-[84px] pt-[128px]">
        <div className="container max-w-[1120px]">
          <nav className="flex items-center gap-1.5 text-xs text-[#637282]" aria-label="Navegação estrutural">
            <Link href="/blog" className="hover:text-[#002fa7] hover:underline hover:underline-offset-4">Blog</Link><ChevronRight size={14} aria-hidden="true" /><span>{post.category}</span>
          </nav>
          <header className="max-w-[840px] border-b border-[#101820] py-16">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.11em] text-[#002fa7]">{post.category} <span>·</span> {post.readTime}</p>
            <h1 className="mt-5 !font-sans text-[clamp(2.55rem,6vw,5.45rem)] font-bold leading-[.94] tracking-[-.07em] text-[#101820]">{post.title}</h1>
            <p className="mt-7 max-w-[560px] text-[1.1rem] leading-7 text-[#40505e]">{post.description}</p>
          </header>

          <div className="grid gap-10 pt-[50px] lg:grid-cols-[190px_minmax(0,670px)] lg:gap-[72px]">
            <aside><Link href="/blog" className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#002fa7] hover:underline hover:underline-offset-4"><ArrowLeft size={16} aria-hidden="true" /> Todos os artigos</Link></aside>
            <article className="text-[1.06rem] leading-8 text-[#2d3b48]">
              {post.sections.map((section, index) => (
                <section key={section.title} className={index === 0 ? "" : "mt-12"}>
                  <h2 className="mb-4 !font-sans text-[clamp(1.55rem,3vw,2.2rem)] font-bold leading-[1.05] tracking-[-.045em] text-[#101820]">{section.title}</h2>
                  {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraph} className={paragraphIndex === 0 ? "m-0" : "mt-[18px]"}>{paragraph}</p>)}
                  {section.items && <ul className="mt-6 grid gap-2.5 p-0">{section.items.map((item) => <li key={item} className="relative list-none pl-5 before:absolute before:left-0 before:top-[.8em] before:h-[7px] before:w-[7px] before:bg-[#002fa7]">{item}</li>)}</ul>}
                </section>
              ))}
            </article>
          </div>

          <section className="ml-0 mt-[78px] flex max-w-[670px] flex-col justify-between gap-5 border-y border-[#101820] py-7 lg:ml-[262px] lg:flex-row lg:items-end">
            <p className="m-0 max-w-[390px] font-sans text-[1.35rem] font-bold leading-tight tracking-[-.035em] text-[#101820]">Quer conversar sobre o seu próximo passo?</p>
            <Link href="/contacto" className="inline-flex shrink-0 items-center gap-2 font-sans text-sm font-bold text-[#002fa7] underline underline-offset-4">Contacte a Figueira Home <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </section>
        </div>
      </main>
      <VideoFooter />
    </>
  );
}
