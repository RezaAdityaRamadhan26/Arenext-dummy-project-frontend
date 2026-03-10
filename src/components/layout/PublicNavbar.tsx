"use client";

import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function PublicNavbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = useAuthStore((state: any) => state.token);
  const user = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.clearAuth);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/venues"
            className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
          >
            Arenext
          </Link>
          <div className="text-sm font-medium text-slate-500">Memuat...</div>
        </div>
      </header>
    );
  }

  const handleLogout = () => {
    logout();
    alert("berhasil keluar");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/venues"
          className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent transition duration-300 hover:from-blue-300 hover:to-violet-400"
        >
          Arenext
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
          <Link
            href="/venues"
            className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            Daftar Lapangan
          </Link>

          {token ? (
            <div className="flex items-center gap-1 ml-2 pl-3 border-l border-white/10">
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  Dasbor Admin
                </Link>
              ) : (
                <Link
                  href="/user/bookings"
                  className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  Pesanan Saya
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="ml-1 rounded-xl bg-red-500/15 border border-red-400/20 text-red-300 font-bold px-4 py-2 hover:bg-red-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-linear-to-r from-blue-600 to-indigo-500 px-5 py-2 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Daftar
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-4 pb-4 pt-2 animate-[fadeIn_0.2s_ease-out_forwards] space-y-1">
          <Link
            href="/venues"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium"
          >
            Daftar Lapangan
          </Link>
          {token ? (
            <>
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium"
                >
                  Dasbor Admin
                </Link>
              ) : (
                <Link
                  href="/user/bookings"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium"
                >
                  Pesanan Saya
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/15 transition-all font-bold"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-500 text-center text-white font-bold shadow-lg shadow-blue-500/25 transition-all"
              >
                Daftar Sekarang
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
