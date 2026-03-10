'use client';

import { useState, useEffect } from "react";
import { XCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function AdminBookingPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuthStore();

    const fetchBookings = async () => {
        try {
            const response = await api.get('/booking', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBookings(response.data.data);
        } catch (error) {
            console.error('gagal menampilkan data');

        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchBookings();
    }, [token]);

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        const confirmAction = window.confirm(`apakah kamu yakin ingin mengubah ${newStatus}`);
        if(!confirmAction) return;

        try {
            await api.post(`/booking/${id}/status`,
                {status: newStatus},
                {headers: {
                    Authorization: `Bearer ${token}`
                }}
            )
            
            alert(`berhasil diubah menjadi ${newStatus}`)
            fetchBookings();
        } catch (error: any) {
            console.error("gagal update status", error);
            alert('waduh, gagal mengubah status')
        }
    }

    if(isLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
                Memuat daftar pesanan...
            </div>
        )
    }

    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Manajemen Pesanan
          </h1>
          <p className="text-slate-500 mt-1">
            Kelola semua pesanan lapangan yang masuk dari pelanggan.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Belum ada pesanan yang masuk.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking: any) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        #{booking.id}
                      </td>

                      {/* Mengambil nama dari tabel User (berkat include user di Backend) */}
                      <td className="px-6 py-4">
                        {booking.user
                          ? booking.user.name
                          : "User Tidak Ditemukan"}
                      </td>

                      {/* Mengambil nama dari tabel Venue */}
                      <td className="px-6 py-4 font-medium text-blue-600">
                        {booking.venue ? booking.venue.name : "Venue Dihapus"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {new Date(booking.date).toLocaleDateString("id-ID")}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Durasi: {booking.hours} Jam
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900">
                        Rp {booking.totalPrice.toLocaleString("id-ID")}
                      </td>

                      <td className="px-6 py-4">
                        {/* Label Status Bawaan */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                        ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`} // Default kuning (Menunggu)
                        >
                          {booking.status || "Menunggu"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {/* Tombol Setujui */}
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "CONFIRMED")
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Setujui Pesanan"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          {/* Tombol Tolak */}
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "REJECTED")
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>
    );
}