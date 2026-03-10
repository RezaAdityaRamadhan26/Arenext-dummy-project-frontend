"use client";

import { useEffect, useState } from "react";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { Loader2, CalendarPlus } from "lucide-react";
import api from "@/src/lib/axios";
import Link from "next/link";

export default function PublicVenuesPage() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get("/venues");
        setVenues(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data lapangan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilih Lapangan Favoritmu
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Temukan lapangan terbaik untuk pertandinganmu selanjutnya.
          </p>
        </div>

        {/* Tampilan Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500">Mencari lapangan terbaik...</p>
          </div>
        ) : venues.length === 0 ? (
          // Jika belum ada data lapangan
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">
              Belum ada lapangan yang tersedia saat ini.
            </p>
          </div>
        ) : (
          // Daftar Lapangan
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue: any) => (
              <div
                key={venue.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Gambar Lapangan */}
                <div className="relative h-56 w-full bg-slate-100">
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
                  {/* Label Harga */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold text-slate-900 shadow-sm">
                    Rp {venue.pricePerHour.toLocaleString("id-ID")} / jam
                  </div>
                </div>

                {/* Info Lapangan */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {venue.name}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {venue.description}
                  </p>

                  {/* Tombol Pesan (Booking) */}
                  <Link
                    href={`/venues/${venue.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <CalendarPlus className="h-5 w-5" />
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
