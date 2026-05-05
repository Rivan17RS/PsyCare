"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPrimaryLink } from "@/config/booking";

export default function Navbar() {
  const link = getPrimaryLink();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/PsicoClinicas-logo.png"
            alt="PsicoClinicas"
            width={200}
            height={200}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">

          <nav className="flex items-center gap-6 text-sm">
            <Link href="#servicios">Servicios</Link>
            <Link href="#como">Cómo funciona</Link>
            <Link href="/test">Test</Link>
            {/*<Link href="/plataforma">Plataforma</Link>*/}
          </nav>

          <Link
            href={"https://wa.me/50683610506?text=Hola%20quiero%20agendar%20una%20sesión%20en%20PsicoClinicas"}
            className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Agendar
          </Link>

        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1"
          aria-label="Abrir menú"
        >
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-6 py-4">

          <nav className="flex flex-col gap-4 text-sm">

            <Link href="#servicios" onClick={() => setOpen(false)}>
              Servicios
            </Link>

            <Link href="#como" onClick={() => setOpen(false)}>
              Cómo funciona
            </Link>

            <Link href="/test" onClick={() => setOpen(false)}>
              Test
            </Link>

            <Link href="/plataforma" onClick={() => setOpen(false)}>
              Plataforma
            </Link>

          </nav>

          <Link
            href={link}
            onClick={() => setOpen(false)}
            className="block mt-4 bg-[var(--primary)] text-white px-4 py-3 rounded-lg text-center"
          >
            Agendar sesión
          </Link>

        </div>
      )}
    </header>
  );
}