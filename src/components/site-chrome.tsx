"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

const links = [
  ["Home", "/"],
  ["Imóveis", "/imoveis"],
  ["Empreendimentos", "/empreendimentos"],
  ["Quem Somos", "/quem-somos"],
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

  return (
    <>
      <nav className={clsx("site-nav", scrolled && "scrolled", solid && "solid")}>
        <div className="nav-inner">
          <Link href="/" className="mr-auto flex items-center" aria-label="Figueira Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scrolled || solid ? "/novo-logo-nav-navy.png" : "/novo-logo-nav.png"}
              alt="Figueira Home"
              className="nav-logo-image"
            />
          </Link>
          <div className="hidden items-center md:flex">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className={clsx("nav-link", pathname === href && "active")}>
                {label}
              </Link>
            ))}
          </div>
          <Link href="/contacto" className="btn btn-primary ml-4 hidden md:inline-flex">Contacto</Link>
          <button className="ml-3 inline-flex md:hidden" aria-label="Abrir menu" onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-[80] bg-[rgba(13,43,78,0.96)] p-6 text-white md:hidden">
          <button className="ml-auto flex" aria-label="Fechar menu" onClick={() => setOpen(false)}><X size={30} /></button>
          <div className="mt-10 grid gap-3">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="border-b border-white/15 py-4 text-xl font-bold" onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href="/contacto" className="btn btn-gold mt-4" onClick={() => setOpen(false)}>Contacto</Link>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
