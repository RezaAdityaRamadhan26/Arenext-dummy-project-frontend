"use client";

import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";

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
      <header className="sticky top-0 z-50 border-b-2 border-black bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/venues"
            className="text-2xl font-poppins font-black text-black"
          >
            ARENEXT
          </Link>
          <div className="text-sm font-inter font-medium text-gray-600">
            Memuat...
          </div>
        </div>
      </header>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar", {
      description: "Sampai jumpa lagi!",
    });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-poppins font-black text-black hover:opacity-70 transition-opacity"
        >
          ARENEXT
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/venues"
            className="font-inter font-semibold text-black hover:text-gray-600 transition-colors border-b-2 border-transparent hover:border-black pb-1"
          >
            Lapangan
          </Link>

          {token ? (
            <>
              {user?.role === "admin" && (
                <Link
                  href="/admin/bookings"
                  className="font-inter font-semibold text-black hover:text-gray-600 transition-colors border-b-2 border-transparent hover:border-black pb-1"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/user/bookings"
                className="font-inter font-semibold text-black hover:text-gray-600 transition-colors border-b-2 border-transparent hover:border-black pb-1"
              >
                Pesanan Saya
              </Link>
              <button
                onClick={handleLogout}
                className="font-inter font-semibold px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-inter font-semibold text-black hover:text-gray-600 transition-colors border-b-2 border-transparent hover:border-black pb-1"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="font-inter font-semibold px-6 py-2 bg-black text-white hover:opacity-80 transition-opacity"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded"
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t-2 border-black bg-white animate-slideDown">
          <nav className="flex flex-col gap-0 p-4">
            <Link
              href="/venues"
              className="font-inter font-semibold py-3 px-4 text-black hover:bg-gray-100 border-b border-gray-200"
            >
              Lapangan
            </Link>

            {token ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    href="/admin/bookings"
                    className="font-inter font-semibold py-3 px-4 text-black hover:bg-gray-100 border-b border-gray-200"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/user/bookings"
                  className="font-inter font-semibold py-3 px-4 text-black hover:bg-gray-100 border-b border-gray-200"
                >
                  Pesanan Saya
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="font-inter font-semibold py-3 px-4 text-black hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-inter font-semibold py-3 px-4 text-black hover:bg-gray-100 border-b border-gray-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="font-inter font-semibold py-3 px-4 bg-black text-white hover:opacity-80"
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
 
