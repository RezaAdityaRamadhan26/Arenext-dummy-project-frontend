"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { LogOut, LayoutDashboard, Map, Loader2, Trash, Edit } from "lucide-react";
import api from "@/src/lib/axios";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

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
        } catch (e) {
        }
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
    logout();
    router.push("/login");
  }

    const handleDeleteVenue = async (id: number, name: string) => {
      const confirmDelete = window.confirm('apakah anda yakin ingin menghapus venue?')

      if (!confirmDelete) return;

      try {
        await api.delete(`/venues/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert('lapangan berhasil dihapus')

        setVenues(venues.filter((v: any) => v.id !== id));

      } catch (error: any) {
        console.error("Detail Error Hapus:", error.response?.data || error);
        const pesanError = error.response?.data?.message;
        alert(`gagal menghapus error : ${pesanError}`)
      }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        Memeriksa akses...
      </div>
    );
  }

  // Tampilan Utama
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                Arenext <span className="text-blue-600">Admin</span>
              </span>
            </div>

            {/* sidebar */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  Halo, Admin!
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-blue-50 p-4 rounded-full">
            <Map className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ruang Kendali Arenext
            </h1>
            <p className="mt-1 text-gray-500">
              Selamat datang kembali. Di sini kamu bisa mengelola seluruh data
              lapangan dan pesanan.
            </p>
          </div>
        </div>

        {/* Daftar Lapangan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Daftar Lapangan</h2>
            <Link
              href="/admin/venues/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Tambah Lapangan
            </Link>
          </div>

          {isLoadingVenues ? (
            // loading
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-xl">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
              <p className="text-gray-500 text-sm">
                Mengambil data lapangan...
              </p>
            </div>
          ) : venues.length === 0 ? (
            // no venues
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <p className="text-gray-500 text-sm">
                Belum ada data lapangan. Silakan tambah lapangan baru.
              </p>
            </div>
          ) : (
            // success
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue: any) => (
                <div
                  key={venue.id}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col"
                >
                  {/* image Lapangan */}
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={
                        venue.image
                          ? `http://localhost:3000${venue.image}`
                          : "https://placehold.co/600x400?text=Tanpa+Foto"
                      }
                      alt={venue.name}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src =
                          "https://placehold.co/600x400?text=Image+Error";
                      }}
                    />
                  </div>
                  <div className="mt-4 grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {venue.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {venue.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Lapangan"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVenue(venue.id, venue.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
