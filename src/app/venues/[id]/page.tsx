"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { ArrowLeft, Loader2, Calendar, Clock, CreditCard } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const [venue, setVenue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await api.get(`/venues/${params.id}`);
        setVenue(response.data.data);
      } catch (error) {
        toast.error("Lapangan tidak ditemukan", {
          description: "Silakan kembali ke daftar lapangan.",
        });
        router.push("/venues");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchVenue();
  }, [params.id, router]);

  const totalHarga = venue ? venue.pricePerHour * Number(duration) : 0;

  const handleBooking = async (e: any) => {
    e.preventDefault();

    if (!token) {
      toast.error("Harus login terlebih dahulu", {
        description: "Silakan login untuk melakukan pemesanan.",
      });
      router.push("/login");
      return;
    }

    try {
      const dataPesanan = {
        venueId: Number(params.id),
        date: bookingDate,
        hours: Number(duration),
        totalPrice: totalHarga,
      };

      await api.post("/booking", dataPesanan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Pemesanan berhasil!", {
        description: "Lapangan berhasil dipesan. Cek pesanan Anda di halaman Pesanan Saya.",
      });
      router.push("/venues");
    } catch (error: any) {
      const pesanError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Terjadi kesalahan, silakan coba lagi.";
      toast.error("Pemesanan gagal", {
        description: pesanError,
      });
    }
  };

  if (!venue) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-8 transition-all duration-300 font-medium group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Kembali ke Daftar Lapangan</span>
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-blue-500/5 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0">
          {/* KIRI: Informasi Lapangan */}
          <div className="lg:w-7/12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
            <div className="relative h-56 sm:h-80 lg:h-96 w-full overflow-hidden bg-slate-800">
              <img
                src={
                  venue.image
                    ? `${process.env.NEXT_PUBLIC_API_URL}${venue.image}`
                    : "https://placehold.co/800x600?text=Tanpa+Foto"
                }
                alt={venue.name}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.src =
                    "https://placehold.co/800x600?text=Image+Error";
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>
            <div className="p-5 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {venue.name}
              </h1>
              <p className="text-2xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                Rp {venue.pricePerHour.toLocaleString("id-ID")}{" "}
                <span className="text-slate-400 text-lg font-normal">
                  / jam
                </span>
              </p>
              <h3 className="text-lg font-bold text-white mb-2">
                Fasilitas & Deskripsi
              </h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                {venue.description}
              </p>
            </div>
          </div>

          {/* KANAN: Form Booking */}
          <div className="lg:w-5/12 p-5 sm:p-8 bg-white/5">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              Pesan Lapangan Ini
            </h2>

            <form onSubmit={handleBooking} className="space-y-6">
              {/* Input Tanggal */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-blue-200 mb-2">
                  <Calendar className="h-4 w-4 text-blue-400" /> Tanggal Main
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none"
                  required
                />
              </div>

              {/* Input Jam Mulai */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-blue-200 mb-2">
                  <Clock className="h-4 w-4 text-blue-400" /> Jam Mulai
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none"
                  required
                />
              </div>

              {/* Durasi Bermain */}
              <div>
                <label className="text-sm font-bold text-blue-200 mb-2 block">
                  Durasi Sewa (Jam)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none"
                >
                  <option value="1" className="bg-slate-900">
                    1 Jam
                  </option>
                  <option value="2" className="bg-slate-900">
                    2 Jam
                  </option>
                  <option value="3" className="bg-slate-900">
                    3 Jam
                  </option>
                  <option value="4" className="bg-slate-900">
                    4 Jam
                  </option>
                </select>
              </div>

              {/* Ringkasan Pembayaran */}
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6 mt-8 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <h3 className="font-bold text-white">Ringkasan Pembayaran</h3>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
                  <span>Harga per jam</span>
                  <span>Rp {venue.pricePerHour.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-300 mb-4 border-b border-blue-400/20 pb-4">
                  <span>Durasi</span>
                  <span>{duration} Jam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Total Tagihan</span>
                  <span className="font-extrabold text-2xl bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              {/* Tombol Pintar: Cek apakah user punya token atau belum */}
              {token ? (
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
                >
                  Konfirmasi Pesanan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "Halo! Silakan masuk/login dulu ya untuk mulai memesan lapangan.",
                    );
                    router.push("/login");
                  }}
                  className="w-full bg-white/10 border border-white/20 hover:bg-white/15 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-xl"
                >
                  Login untuk Memesan Lapangan
                </button>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
