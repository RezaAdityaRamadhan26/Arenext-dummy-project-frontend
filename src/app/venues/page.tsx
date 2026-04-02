"use client";

import { useEffect, useState } from "react";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { Loader2, Search } from "lucide-react";
import api from "@/src/lib/axios";
import Link from "next/link";

export default function PublicVenuesPage() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get("/venues");
        setVenues(response.data.data);
        setFilteredVenues(response.data.data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  useEffect(() => {
    const filtered = venues.filter(
      (venue: any) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVenues(filtered);
  }, [searchQuery, venues]);

  return (
    <div className="min-h-screen bg-white text-black">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-poppins font-black mb-4">
            Temukan Lapangan
          </h1>
          <p className="text-lg font-inter text-gray-700 max-w-2xl mb-8">
            Pilih lapangan terbaik sesuai dengan kebutuhan dan preferensi Anda.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 border-2 border-black rounded flex items-center px-4 py-4">
              <Search className="w-5 h-5 text-gray-600 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Cari nama atau lokasi lapangan"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent font-inter text-black placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-black mb-4" />
            <p className="font-inter text-gray-700">Mencari lapangan terbaik...</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-20 border-2 border-gray-300 rounded">
            <p className="font-inter text-gray-700 text-lg">
              {searchQuery
                ? "Tidak ada lapangan yang sesuai dengan pencarian Anda"
                : "Belum ada lapangan yang tersedia saat ini"}
            </p>
          </div>
        ) : (
          /* Venue Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredVenues.map((venue: any, index: number) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`}
                className="group border-2 border-black rounded overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-slideUp"
                style={{ animationDelay: `${0.05 * index}s`, animationFillMode: "both" }}
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale"
                    onError={(e: any) => {
                      e.target.src =
                        "https://placehold.co/600x400?text=Image+Error&bg=cccccc&txtcolor=666666";
                    }}
                  />
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 font-poppins font-bold">
                    Rp {venue.pricePerHour.toLocaleString("id-ID")} / jam
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-poppins font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                    {venue.name}
                  </h3>

                  {venue.location && (
                    <p className="font-inter text-gray-600 text-sm mb-4">
                      {venue.location}
                    </p>
                  )}

                  {venue.description && (
                    <p className="font-inter text-gray-700 text-sm line-clamp-2 mb-6">
                      {venue.description}
                    </p>
                  )}

                  {/* Button */}
                  <button className="w-full bg-black text-white font-poppins font-bold py-3 rounded hover:opacity-80 transition-opacity">
                    Pesan Sekarang →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

