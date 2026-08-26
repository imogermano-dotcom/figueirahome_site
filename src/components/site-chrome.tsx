"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { GoogleTranslate } from "@/components/google-translate";

const links = [
  ["Home", "/"],
  ["Im\u00f3veis", "/imoveis"],
  ["Quem Somos", "/quem-somos"],
  ["Servi\u00e7os", "/servicos"],
  ["Recrutamento", "/recrutamento"],
  ["Blog", "/blog"]
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(pathname !== "/");
  const [open, setOpen] = useState(false);
  const solid = pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20 || solid);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  const useNavyWordmark = scrolled || solid;

  return <><nav className={clsx("site-nav", scrolled && "scrolled", solid && "solid")}><div className="nav-inner"><Link href="/" className="nav-logo mr-auto" aria-label="Figueira Home"><Image src="/logo-figueirahome-2026.png" alt="Figueira Home" width={2048} height={853} priority className="nav-logo-image" />{useNavyWordmark && <Image src="/logo-figueirahome-2026.png" alt="" aria-hidden="true" width={2048} height={853} className="nav-logo-image nav-logo-wordmark-navy" />}</Link><div className="hidden items-center md:flex">{links.map(([label, href]) => <Link key={href} href={href} className={clsx("nav-link", pathname === href && "active")}>{label}</Link>)}</div><div className="ml-3 hidden md:block"><GoogleTranslate /></div><Link href="/contacto" className="btn btn-primary ml-4 hidden md:inline-flex">Contacto</Link><button className="ml-3 inline-flex md:hidden" aria-label="Abrir menu" onClick={() => setOpen(true)}><Menu size={28} /></button></div></nav>{open && <div className="fixed inset-0 z-[80] bg-[rgba(13,43,78,0.96)] p-6 text-white md:hidden"><button className="ml-auto flex" aria-label="Fechar menu" onClick={() => setOpen(false)}><X size={30} /></button><div className="mt-10 grid gap-3"><div className="border-b border-white/15 py-3"><GoogleTranslate /></div>{links.map(([label, href]) => <Link key={href} href={href} className="border-b border-white/15 py-4 text-xl font-bold" onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/contacto" className="btn btn-gold mt-4" onClick={() => setOpen(false)}>Contacto</Link></div></div>}{children}</>;
}
