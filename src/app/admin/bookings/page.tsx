"use client";

import { useState, useEffect } from "react";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { CheckCircle, XCircle, Clock, Loader2, Filter } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const { token } = useAuthStore();

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings", {
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

  const filteredBookings =
    filterStatus === "ALL"
      ? bookings
      : bookings.filter((b: any) => b.status === filterStatus);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const confirmAction = window.confirm(
      `Yakin ingin mengubah status menjadi ${newStatus}?`
    );
    if (!confirmAction) return;

    try {
      await api.post(
        `/bookings/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      <div className="min-h-screen bg-white text-black">
        <PublicNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-inter text-gray-700">Memuat daftar pesanan...</p>
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
            Manajemen Pesanan
          </h1>
          <p className="font-inter text-gray-700 text-lg">
            Kelola semua pesanan lapangan yang masuk dari pelanggan Anda.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 mb-8 animate-slideUp">
          {["ALL", "PENDING", "CONFIRMED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded font-poppins font-bold transition-all ${
                filterStatus === status
                  ? "bg-black text-white"
                  : "border-2 border-black text-black hover:bg-gray-100"
              }`}
            >
              {status === "ALL" ? "Semua" : status}
            </button>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block border-2 border-black rounded overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-poppins font-bold">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left font-poppins font-bold">
                    Pemesan
                  </th>
                  <th className="px-6 py-4 text-left font-poppins font-bold">
                    Lapangan
                  </th>
                  <th className="px-6 py-4 text-left font-poppins font-bold">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left font-poppins font-bold">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left font-poppins font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-poppins font-bold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center font-inter text-gray-600"
                    >
                      Belum ada pesanan untuk status ini.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking: any) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-poppins font-bold text-black">
                          #{booking.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-inter">
                          <p className="font-bold">{booking.user?.name || "-"}</p>
                          <p className="text-sm text-gray-600">
                            {booking.user?.email || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-poppins font-bold">
                          {booking.venue?.name || "Venue Dihapus"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-inter">
                          <p className="font-bold">
                            {new Date(booking.date).toLocaleDateString("id-ID")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.hours} jam
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-poppins font-bold">
                          Rp {booking.totalPrice.toLocaleString("id-ID")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded font-poppins font-bold text-sm inline-block border-2 ${
                            booking.status === "CONFIRMED"
                              ? "bg-black text-white border-black"
                              : booking.status === "REJECTED"
                                ? "border-black text-black"
                                : "border-gray-400 text-gray-600"
                          }`}
                        >
                          {booking.status || "PENDING"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "CONFIRMED")
                            }
                            title="Setujui"
                            className="p-2 border-2 border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "REJECTED")
                            }
                            title="Tolak"
                            className="p-2 border-2 border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 animate-slideUp">
          {filteredBookings.length === 0 ? (
            <div className="border-2 border-gray-300 rounded p-8 text-center">
              <p className="font-inter text-gray-700">
                Belum ada pesanan untuk status ini.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking: any, idx: number) => (
              <div
                key={booking.id}
                className="border-2 border-black rounded p-6 animate-slideUp"
                style={{ animationDelay: `${0.05 * idx}s`, animationFillMode: "both" }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-poppins font-bold text-lg">
                    Pesanan #{booking.id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded font-poppins font-bold text-sm border-2 ${
                      booking.status === "CONFIRMED"
                        ? "bg-black text-white border-black"
                        : booking.status === "REJECTED"
                          ? "border-black text-black"
                          : "border-gray-400 text-gray-600"
                    }`}
                  >
                    {booking.status || "PENDING"}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                  <div>
                    <p className="font-inter text-sm text-gray-600">Pemesan</p>
                    <p className="font-poppins font-bold">
                      {booking.user?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-inter text-sm text-gray-600">Lapangan</p>
                    <p className="font-poppins font-bold">
                      {booking.venue?.name || "Venue Dihapus"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-inter text-sm text-gray-600">Tanggal</p>
                      <p className="font-poppins font-bold text-sm">
                        {new Date(booking.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="font-inter text-sm text-gray-600">Durasi</p>
                      <p className="font-poppins font-bold text-sm">
                        {booking.hours} jam
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-inter text-sm text-gray-600">Total</p>
                    <p className="font-poppins font-bold text-lg">
                      Rp {booking.totalPrice.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                    className="flex-1 py-2 border-2 border-green-600 text-green-600 rounded font-poppins font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Setujui
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "REJECTED")}
                    className="flex-1 py-2 border-2 border-red-600 text-red-600 rounded font-poppins font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Tolak
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
