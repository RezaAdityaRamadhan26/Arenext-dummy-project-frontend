"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/src/store/authStore";
import {
  LogOut,
  LayoutDashboard,
  Map,
  Loader2,
  Trash,
  Edit,
  ClipboardList,
} from "lucide-react";
import api from "@/src/lib/axios";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, clearAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const tokenCookie = Cookies.get('token');
    const roleCookie = Cookies.get('role');
    if (!tokenCookie || roleCookie !== 'ADMIN') {
      router.push("/login");
      return;
    }
    setIsChecking(false);
  }, [router]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get<any>("/venues");
        setVenues(response.data.data);
      } catch (error) {
      } finally {
        setIsLoadingVenues(false);
      }
    };
    if (token) fetchVenues();
  }, [token]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const handleDeleteVenue = async (id: number, name: string) => {
    if (!window.confirm("Apakah anda yakin ingin menghapus venue?")) return;
    try {
      await api.delete(`/venues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Lapangan dihapus", {
        description: "Lapangan berhasil dihapus dari sistem.",
      });

      setVenues(venues.filter((v: any) => v.id !== id));
    } catch (error: any) {
      const pesanError = error.response?.data?.message;
      toast.error("Gagal menghapus lapangan", {
        description: pesanError || "Silakan coba lagi.",
      });
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
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="font-poppins font-black text-xl tracking-tight">
                Arenext <span className="text-black">Admin</span>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-poppins font-bold text-black">Halo, Admin!</p>
                <p className="text-xs font-inter text-gray-700">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-poppins font-bold border-2 border-black text-black hover:bg-black hover:text-white rounded transition-all"
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
        <div className="rounded-2xl border-2 border-black bg-white p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black">
            <Map className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="font-poppins font-black text-2xl mb-2">Dashboard Admin</h1>
            <p className="font-inter text-gray-700">Kelola venue dan data lapangan Arenext.</p>
          </div>
        </div>
        {/* Venue List Section */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="font-poppins font-bold text-2xl">Daftar Lapangan</h2>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Link
                href="/admin/bookings"
                className="font-inter font-semibold px-6 py-2 border-2 border-black rounded hover:bg-black hover:text-white transition flex items-center gap-2"
              >
                <ClipboardList className="h-4 w-4" />
                Kelola Pesanan
              </Link>
              <Link
                href="/admin/venues/create"
                className="font-inter font-semibold px-6 py-2 bg-black text-white rounded border-2 border-black hover:opacity-80 transition"
              >
                + Tambah Lapangan
              </Link>
            </div>
          </div>

          {isLoadingVenues ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-black" />
            </div>
          ) : venues.length === 0 ? (
            <div className="text-center py-20 border-2 border-gray-200 rounded">
              <p className="font-inter text-gray-700 text-lg">
                Belum ada lapangan yang tersedia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map((venue: any) => (
                <div
                  key={venue.id}
                  className="border-2 border-black rounded p-6 flex flex-col gap-4 bg-white"
                >
                  {venue.image ? (
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-40 object-cover rounded border border-black mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded border border-black mb-4 font-inter">
                      Tidak ada gambar
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-poppins font-bold text-xl mb-2">
                      {venue.name}
                    </h3>
                    <p className="font-inter text-gray-700 mb-2">
                      {venue.location}
                    </p>
                    <p className="font-inter text-gray-700 mb-2">
                      Rp {venue.pricePerHour?.toLocaleString("id-ID")} / jam
                    </p>
                    <p className="font-inter text-gray-600 text-sm line-clamp-2">
                      {venue.description}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/admin/venues/edit/${venue.id}`}
                      className="font-inter px-4 py-2 border-2 border-black rounded hover:bg-black hover:text-white transition"
                    >
                      <Edit className="inline-block w-4 h-4 mr-1 align-text-bottom" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteVenue(venue.id, venue.name)}
                      className="font-inter px-4 py-2 border-2 border-black rounded hover:bg-black hover:text-white transition"
                    >
                      <Trash className="inline-block w-4 h-4 mr-1 align-text-bottom" /> Hapus
                    </button>
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
