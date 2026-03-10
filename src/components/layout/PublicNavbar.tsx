"use client";

import Link from "next/link";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-slate-900"
        >
          Arenext
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link
            href="/venues"
            className="hover:text-slate-900 transition-colors"
          >
            Venue
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            Masuk
          </Link>
        </nav>
      </div>
    </header>
  );
}
