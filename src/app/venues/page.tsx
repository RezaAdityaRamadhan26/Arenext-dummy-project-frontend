"use client";

import { useEffect, useState } from "react";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { Loader2, CalendarPlus, Search } from "lucide-react";
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
    <div className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-14 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-200 backdrop-blur-xl">
            <Search className="h-4 w-4" />
            Temukan Lapanganmu
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight">
            Pilih Lapangan{" "}
            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Favoritmu
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Temukan lapangan terbaik untuk pertandinganmu selanjutnya.
          </p>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-2 border-blue-500/20" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-blue-400" />
            </div>
            <p className="text-slate-500 mt-4">Mencari lapangan terbaik...</p>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/5 backdrop-blur-xl opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <p className="text-slate-400">
              Belum ada lapangan yang tersedia saat ini.
            </p>
          </div>
        ) : (
          /* Venue Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {venues.map((venue: any, index: number) => (
              <div
                key={venue.id}
                className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-blue-400/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col opacity-0 animate-[slideUp_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-800">
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
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 rounded-xl bg-slate-950/70 border border-white/15 backdrop-blur-xl px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                    Rp {venue.pricePerHour.toLocaleString("id-ID")} / jam
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {venue.name}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 grow leading-relaxed">
                    {venue.description}
                  </p>
                  <Link
                    href={`/venues/${venue.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-500 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
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
