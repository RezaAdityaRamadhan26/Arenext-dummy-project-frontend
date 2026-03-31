"use client";

import { useState, useEffect, use } from "react";
import { Clock, Loader2, MapPin, CalendarDays } from "lucide-react";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";
import PublicNavbar from "@/src/components/layout/PublicNavbar";

export default function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await api.get("/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyBookings(response.data.data);
      } catch (error: any) {
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchMyBookings();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mr-3" />
          <span className="text-slate-400 font-medium">
            Memuat riwayat pesananmu...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-12">
      <PublicNavbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Riwayat Pesanan Saya
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Pantau status penyewaan lapanganmu di sini.
          </p>
        </div>

        <div className="space-y-6">
          {myBookings.length === 0 ? (
            <div className="rounded-3xl p-12 text-center border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-blue-500/5 animate-[scaleIn_0.4s_ease-out_forwards] opacity-0">
              <CalendarDays className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Belum ada pesanan
              </h3>
              <p className="text-slate-400">
                Kamu belum pernah menyewa lapangan. Yuk, cari lapangan sekarang!
              </p>
            </div>
          ) : (
            myBookings.map((booking: any, index: number) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all duration-300 hover:bg-white/10 hover:border-white/20 shadow-lg shadow-blue-500/5 animate-[slideUp_0.5s_ease-out_forwards] opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Info Kiri */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-white/10 text-slate-300 px-3 py-1 rounded-lg text-sm font-bold border border-white/10">
                      Order #{booking.id}
                    </span>
                    {/* Badge Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === "CONFIRMED"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : booking.status === "REJECTED"
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {booking.status === "CONFIRMED"
                        ? "Dikonfirmasi"
                        : booking.status === "REJECTED"
                          ? "Dibatalkan"
                          : "Menunggu Persetujuan"}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    {booking.venue ? booking.venue.name : "Lapangan Dihapus"}
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 text-slate-400 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-blue-400" />
                      {new Date(booking.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-indigo-400" />
                      Durasi: {booking.hours} Jam
                    </div>
                  </div>
                </div>

                {/* Info Kanan (Harga) */}
                <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                  <p className="text-sm text-slate-500 font-medium mb-1">
                    Total Pembayaran
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                    Rp {booking.totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
