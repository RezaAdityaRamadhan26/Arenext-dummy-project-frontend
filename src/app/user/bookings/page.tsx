"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { Loader2, Calendar, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data.data || response.data);
    } catch (error) {
      toast.error("Gagal memuat pesanan", {
        description: "Silakan coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const handleCancelBooking = async (id: number) => {
    const confirmCancel = window.confirm(
      "Yakin ingin membatalkan pesanan ini?"
    );
    if (!confirmCancel) return;

    try {
      await api.post(
        `/bookings/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Pesanan dibatalkan", {
        description: "Pesanan Anda berhasil dibatalkan.",
      });
      fetchBookings();
    } catch (error: any) {
      toast.error("Gagal membatalkan pesanan", {
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
            <p className="font-inter text-gray-700">Memuat pesanan Anda...</p>
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
        <div className="mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-poppins font-black mb-2">
            Pesanan Saya
          </h1>
          <p className="font-inter text-gray-700 text-lg">
            Kelola dan pantau semua pesanan lapangan Anda.
          </p>
        </div>

        {/* Bookings List */}
        <div className="space-y-6 animate-slideUp">
          {bookings.length === 0 ? (
            <div className="border-2 border-gray-300 rounded p-12 text-center">
              <p className="font-inter text-gray-700 text-lg mb-4">
                Anda belum memiliki pesanan.
              </p>
              <a
                href="/venues"
                className="inline-block bg-black text-white font-poppins font-bold py-3 px-8 rounded hover:opacity-80 transition-opacity"
              >
                Mulai Pesan Lapangan
              </a>
            </div>
          ) : (
            bookings.map((booking: any, idx: number) => (
              <div
                key={booking.id}
                className="border-2 border-black rounded p-6 lg:p-8 hover:shadow-lg transition-shadow animate-slideUp"
                style={{ animationDelay: `${0.05 * idx}s`, animationFillMode: "both" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left: Booking Info */}
                  <div className="lg:col-span-3">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-inter text-sm text-gray-600 mb-1">
                          Pesanan ID
                        </p>
                        <p className="font-poppins font-black text-2xl">
                          #{booking.id}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded font-poppins font-bold text-sm border-2 ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-50 border-green-600 text-green-600"
                            : booking.status === "REJECTED"
                              ? "bg-red-50 border-red-600 text-red-600"
                              : "bg-yellow-50 border-yellow-600 text-yellow-600"
                        }`}
                      >
                        {booking.status || "PENDING"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      {/* Venue */}
                      <div>
                        <p className="font-inter text-sm text-gray-600 mb-2">
                          Lapangan
                        </p>
                        <p className="font-poppins font-bold text-lg">
                          {booking.venue?.name || "Venue Dihapus"}
                        </p>
                        {booking.venue?.location && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            {booking.venue.location}
                          </div>
                        )}
                      </div>

                      {/* Date & Time */}
                      <div>
                        <p className="font-inter text-sm text-gray-600 mb-2">
                          Tanggal & Waktu
                        </p>
                        <div className="flex items-center gap-2 font-poppins font-bold">
                          <Calendar className="w-5 h-5" />
                          <span>
                            {new Date(booking.date).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                        {booking.startTime && (
                          <p className="text-sm text-gray-600 mt-1">
                            Mulai pukul {booking.startTime}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Duration & Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-gray-200 rounded p-4">
                        <p className="font-inter text-sm text-gray-600">
                          Durasi
                        </p>
                        <p className="font-poppins font-bold text-xl">
                          {booking.hours} jam
                        </p>
                      </div>
                      <div className="border-2 border-gray-200 rounded p-4">
                        <p className="font-inter text-sm text-gray-600">
                          Harga per jam
                        </p>
                        <p className="font-poppins font-bold text-xl">
                          Rp {booking.venue?.pricePerHour.toLocaleString("id-ID") || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Total */}
                  <div className="lg:col-span-2 flex flex-col justify-between">
                    {/* Total Price */}
                    <div>
                      <p className="font-inter text-sm text-gray-600 mb-2">
                        Total Tagihan
                      </p>
                      <p className="font-poppins font-black text-3xl text-black">
                        Rp {booking.totalPrice.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Booking Date */}
                    <div className="text-sm font-inter text-gray-600">
                      <p>
                        Dipesan pada:{" "}
                        {new Date(booking.createdAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="w-full mt-4 border-2 border-red-600 text-red-600 font-poppins font-bold py-3 rounded hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Batalkan Pesanan
                      </button>
                    )}
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
 
