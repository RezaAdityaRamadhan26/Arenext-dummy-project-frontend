"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";
import Link from "next/link";

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchVenues = async () => {
    try {
      const response = await api.get("/venues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVenues(response.data.data);
    } catch (error) {
      toast.error("Gagal memuat lapangan", {
        description: "Silakan coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchVenues();
  }, [token]);

  const handleDeleteVenue = async (id: number) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus lapangan ini? Tindakan ini tidak dapat dibatalkan."
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/venues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Lapangan dihapus", {
        description: "Lapangan berhasil dihapus dari sistem.",
      });
      fetchVenues();
    } catch (error: any) {
      toast.error("Gagal menghapus lapangan", {
        description: error.response?.data?.message || "Silakan coba lagi.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <PublicNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-inter text-gray-700">Memuat lapangan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12 animate-fadeIn">
          <div>
            <h1 className="text-4xl md:text-5xl font-poppins font-black mb-2">
              Manajemen Lapangan
            </h1>
            <p className="font-inter text-gray-700 text-lg">
              Kelola semua lapangan Anda.
            </p>
          </div>
          <Link
            href="/admin/venues/create"
            className="flex items-center gap-2 bg-black text-white font-poppins font-bold py-3 px-6 rounded hover:opacity-80 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Tambah Lapangan
          </Link>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
          {venues.length === 0 ? (
            <div className="col-span-full border-2 border-gray-300 rounded p-12 text-center">
              <p className="font-inter text-gray-700 text-lg mb-4">
                Belum ada lapangan. Buat lapangan baru sekarang.
              </p>
              <Link
                href="/admin/venues/create"
                className="inline-block bg-black text-white font-poppins font-bold py-3 px-8 rounded hover:opacity-80 transition-opacity"
              >
                Tambah Lapangan
              </Link>
            </div>
          ) : (
            venues.map((venue: any, idx: number) => (
              <div
                key={venue.id}
                className="border-2 border-black rounded overflow-hidden animate-slideUp"
                style={{ animationDelay: `${0.05 * idx}s`, animationFillMode: "both" }}
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                  <img
                    src={
                      venue.image
                        ? `${venue.image}`
                        : "https://placehold.co/600x400?text=Lapangan&bg=cccccc&txtcolor=666666"
                    }
                    alt={venue.name}
                    className="w-full h-full object-cover grayscale"
                    onError={(e: any) => {
                      e.target.src =
                        "https://placehold.co/600x400?text=Image+Error&bg=cccccc&txtcolor=666666";
                    }}
                  />
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded font-poppins font-bold text-sm">
                    Rp {venue.pricePerHour.toLocaleString("id-ID")} / jam
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-poppins font-bold text-lg mb-2">
                    {venue.name}
                  </h3>
                  {venue.location && (
                    <p className="font-inter text-sm text-gray-600 mb-4">
                      📍 {venue.location}
                    </p>
                  )}
                  {venue.description && (
                    <p className="font-inter text-sm text-gray-700 line-clamp-2 mb-6">
                      {venue.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/venues/edit/${venue.id}`}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-black text-black font-poppins font-bold py-2 rounded hover:bg-black hover:text-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
