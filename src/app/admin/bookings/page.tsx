"use client";

import { useState, useEffect } from "react";
import { XCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchBookings = async () => {
    try {
      const response = await api.get("/booking", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const confirmAction = window.confirm(
      `apakah kamu yakin ingin mengubah ${newStatus}`,
    );
    if (!confirmAction) return;

    try {
      await api.post(
        `/booking/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Status diperbarui", {
        description: `Pesanan berhasil diubah menjadi ${newStatus}.`,
      });
      fetchBookings();
    } catch (error: any) {
      toast.error("Gagal memperbarui status", {
        description: "Silakan coba lagi.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mr-3" />
        <span className="text-slate-400 font-medium">
          Memuat daftar pesanan...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Manajemen Pesanan
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Kelola semua pesanan lapangan yang masuk dari pelanggan.
          </p>
        </div>

        {/* ── Desktop Table (hidden on mobile) ── */}
        <div className="hidden md:block rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-500/5 animate-[slideUp_0.5s_ease-out_0.1s_forwards] opacity-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-slate-200 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Nama Pemesan</th>
                  <th className="px-6 py-4 font-bold">Lapangan</th>
                  <th className="px-6 py-4 font-bold">Jadwal Main</th>
                  <th className="px-6 py-4 font-bold">Total Tagihan</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">
                    Aksi Admin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      Belum ada pesanan yang masuk.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking: any) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 font-bold text-blue-300">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4 text-slate-200">
                        {booking.user
                          ? booking.user.name
                          : "User Tidak Ditemukan"}
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-300">
                        {booking.venue ? booking.venue.name : "Venue Dihapus"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Clock className="h-4 w-4 text-slate-500" />
                          {new Date(booking.date).toLocaleDateString("id-ID")}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Durasi: {booking.hours} Jam
                        </div>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                        Rp {booking.totalPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                          ${
                            booking.status === "CONFIRMED"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : booking.status === "REJECTED"
                                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {booking.status || "Menunggu"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "CONFIRMED")
                            }
                            className="p-2 text-emerald-400 hover:bg-emerald-500/15 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90"
                            title="Setujui Pesanan"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "REJECTED")
                            }
                            className="p-2 text-red-400 hover:bg-red-500/15 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90"
                            title="Tolak Pesanan"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Mobile Cards (hidden on desktop) ── */}
        <div className="md:hidden space-y-4 animate-[slideUp_0.5s_ease-out_0.1s_forwards] opacity-0">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center text-slate-500">
              Belum ada pesanan yang masuk.
            </div>
          ) : (
            bookings.map((booking: any, index: number) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 space-y-3"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300 text-sm">
                    #{booking.id}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      booking.status === "CONFIRMED"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : booking.status === "REJECTED"
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {booking.status || "Menunggu"}
                  </span>
                </div>

                <div>
                  <p className="text-white font-bold">
                    {booking.venue ? booking.venue.name : "Venue Dihapus"}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {booking.user ? booking.user.name : "User Tidak Ditemukan"}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {new Date(booking.date).toLocaleDateString("id-ID")}
                  </div>
                  <span>•</span>
                  <span>{booking.hours} Jam</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                    Rp {booking.totalPrice.toLocaleString("id-ID")}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(booking.id, "CONFIRMED")
                      }
                      className="p-2 text-emerald-400 hover:bg-emerald-500/15 rounded-xl transition-all duration-200 active:scale-90"
                      title="Setujui"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, "REJECTED")}
                      className="p-2 text-red-400 hover:bg-red-500/15 rounded-xl transition-all duration-200 active:scale-90"
                      title="Tolak"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
