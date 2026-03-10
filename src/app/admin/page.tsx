"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import {
  LogOut,
  LayoutDashboard,
  Map,
  Loader2,
  Trash,
  Edit,
} from "lucide-react";
import api from "@/src/lib/axios";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, clearAuth } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    // ketika di reload, session akan tetap ada (tidak ter log out)
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("arenext-auth");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const storedToken = parsed?.state?.token ?? null;
          if (storedToken) {
            setIsChecking(false);
            return;
          }
        } catch (e) {}
      }
    }

    if (!token) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [token, router]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get<any>("/venues");
        const dataLapangan = response.data.data;
        setVenues(dataLapangan);
      } catch (error) {
        console.error("gagal menampilkan venues");
      } finally {
        setIsLoadingVenues(false);
      }
    };

    if (token) {
      fetchVenues();
    }
  }, [token]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const handleDeleteVenue = async (id: number, name: string) => {
    const confirmDelete = window.confirm(
      "apakah anda yakin ingin menghapus venue?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/venues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("lapangan berhasil dihapus");

      setVenues(venues.filter((v: any) => v.id !== id));
    } catch (error: any) {
      console.error("Detail Error Hapus:", error.response?.data || error);
      const pesanError = error.response?.data?.message;
      alert(`gagal menghapus error : ${pesanError}`);
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-2 border-blue-500/20" />
          <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-blue-400" />
        </div>
        <span className="ml-3">Memeriksa akses...</span>
      </div>
    );
  }

  // Tampilan Utama
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Arenext{" "}
                <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Admin
                </span>
              </span>
            </div>

            {/* sidebar */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">Halo, Admin!</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-red-300 bg-red-500/10 border border-red-400/20 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome banner */}
        <div className="rounded-3xl border border-white/10 bg-linear-to-br from-blue-600/15 via-indigo-500/10 to-violet-500/15 p-8 backdrop-blur-xl text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25 animate-[float_3s_ease-in-out_infinite]">
            <Map className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Ruang Kendali Arenext
            </h1>
            <p className="mt-1 text-slate-400">
              Selamat datang kembali. Di sini kamu bisa mengelola seluruh data
              lapangan dan pesanan.
            </p>
          </div>
        </div>

        {/* Daftar Lapangan */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 animate-[fadeIn_0.6s_ease-out_0.1s_forwards] opacity-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-bold text-white">Daftar Lapangan</h2>
            <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
              <Link
                href="/admin/bookings"
                className="flex-1 sm:flex-initial text-center rounded-xl border border-white/15 bg-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-300 hover:bg-white/15 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Kelola Pesanan
              </Link>
              <Link
                href="/admin/venues/create"
                className="flex-1 sm:flex-initial text-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                + Tambah Lapangan
              </Link>
            </div>
          </div>

          {isLoadingVenues ? (
            <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-white/10 bg-white/5">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-2" />
              <p className="text-slate-400 text-sm">
                Mengambil data lapangan...
              </p>
            </div>
          ) : venues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
              <p className="text-slate-400 text-sm">
                Belum ada data lapangan. Silakan tambah lapangan baru.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {venues.map((venue: any, index: number) => (
                <div
                  key={venue.id}
                  className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-blue-400/30 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col opacity-0 animate-[slideUp_0.4s_ease-out_forwards]"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  {/* image Lapangan */}
                  <div className="relative w-full h-48 overflow-hidden bg-slate-800">
                    <img
                      src={
                        venue.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}${venue.image}`
                          : "https://placehold.co/600x400?text=Tanpa+Foto"
                      }
                      alt={venue.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e: any) => {
                        e.target.src =
                          "https://placehold.co/600x400?text=Image+Error";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-5 grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                        {venue.name}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {venue.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/venues/edit/${venue.id}`)
                        }
                        className="p-2.5 text-blue-400 hover:bg-blue-500/15 rounded-xl transition-all duration-300 hover:scale-110"
                        title="Edit Lapangan"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVenue(venue.id, venue.name)}
                        className="p-2.5 text-red-400 hover:bg-red-500/15 rounded-xl transition-all duration-300 hover:scale-110"
                        title="Hapus Lapangan"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
