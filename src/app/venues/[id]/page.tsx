'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { ArrowLeft, Loader2, Calendar, Clock, CreditCard } from "lucide-react";
import api from '@/src/lib/axios'
import { useAuthStore } from "@/src/store/authStore";
import { number } from "zod";

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
                const response = await api.get(`/venues/${params.id}`)
                setVenue(response.data.data)
            } catch (error) {
                console.error('gagal mengambil data venues', error);
                alert('data lapangan tidak ditemukan')
                router.push('/venues')
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
            alert('kamu harus login dulu sebelum booking venue!');
            router.push('/login');
            return;
        }

        try {
            const dataPesanan = {
                venueId : Number(params.id),
                date: (bookingDate),
                hours: Number(duration),
                totalPrice: totalHarga

            }

            await api.post('/booking', dataPesanan, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Hore! venue berhasil dibooking')
            router.push('/venues')
        } catch (error: any) {
            console.error('gagal melakukan booking:', error.response?.data || error);
            const pesanError = error.response?.data?.message || error.response?.data?.error || 'cek terminal pada backend'
            alert(`ada yang error nih : ${pesanError}`)
        }
    }

    if (!venue) return null;

    return (
      <div className="min-h-screen bg-slate-50 pb-12">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Daftar Lapangan</span>
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
            {/* KIRI: Informasi Lapangan */}
            <div className="lg:w-7/12 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
              <div className="relative h-80 lg:h-96 w-full bg-slate-100">
                <img
                  src={
                    venue.image
                      ? `http://localhost:3000${venue.image}`
                      : "https://placehold.co/800x600?text=Tanpa+Foto"
                  }
                  alt={venue.name}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src =
                      "https://placehold.co/800x600?text=Image+Error";
                  }}
                />
              </div>
              <div className="p-8">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                  {venue.name}
                </h1>
                <p className="text-2xl font-bold text-blue-600 mb-6">
                  Rp {venue.pricePerHour.toLocaleString("id-ID")}{" "}
                  <span className="text-slate-500 text-lg font-normal">
                    / jam
                  </span>
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Fasilitas & Deskripsi
                </h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {venue.description}
                </p>
              </div>
            </div>

            {/* KANAN: Form Booking */}
            <div className="lg:w-5/12 p-8 bg-slate-50/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Pesan Lapangan Ini
              </h2>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Input Tanggal */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" /> Tanggal Main
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Tidak bisa pilih tanggal kemarin
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                    required
                  />
                </div>

                {/* Input Jam Mulai */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" /> Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                    required
                  />
                </div>

                {/* Durasi Bermain */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    Durasi Sewa (Jam)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                  >
                    <option value="1">1 Jam</option>
                    <option value="2">2 Jam</option>
                    <option value="3">3 Jam</option>
                    <option value="4">4 Jam</option>
                  </select>
                </div>

                {/* Ringkasan Pembayaran */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900">
                      Ringkasan Pembayaran
                    </h3>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
                    <span>Harga per jam</span>
                    <span>Rp {venue.pricePerHour.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-600 mb-4 border-b border-blue-200 pb-4">
                    <span>Durasi</span>
                    <span>{duration} Jam</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">
                      Total Tagihan
                    </span>
                    <span className="font-extrabold text-2xl text-blue-600">
                      Rp {totalHarga.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                {/* Tombol Pintar: Cek apakah user punya token atau belum */}
                {token ? (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
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
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md"
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
