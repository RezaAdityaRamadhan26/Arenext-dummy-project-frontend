"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import CalendarPicker from "@/src/components/ui/CalendarPicker";
import TimeSlotPicker from "@/src/components/ui/TimeSlotPicker";
import DurationSelector from "@/src/components/ui/DurationSelector";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();

  const [venue, setVenue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!bookingDate || !startTime || !duration) {
      toast.error("Form tidak lengkap", {
        description: "Silakan isi semua field terlebih dahulu.",
      });
      return;
    }

    if (!token) {
      toast.error("Harus login terlebih dahulu", {
        description: "Silakan login untuk melakukan pemesanan.",
      });
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const dataPesanan = {
        venueId: Number(params.id),
        date: bookingDate,
        startTime: startTime,
        hours: Number(duration),
        totalPrice: totalHarga,
      };
      await api.post("/bookings", dataPesanan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Pemesanan berhasil!", {
        description: "Lapangan berhasil dipesan. Cek pesanan Anda di halaman Pesanan Saya.",
      });
      router.push("/user/bookings");
    } catch (error: any) {
      const pesanError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Terjadi kesalahan, silakan coba lagi.";
      toast.error("Pemesanan gagal", {
        description: pesanError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <PublicNavbar />
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="font-inter text-gray-700">Memuat detail lapangan...</p>
        </div>
      </div>
    );
  }

  if (!venue) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:text-gray-600 mb-8 transition-colors font-inter font-semibold group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fadeIn">
          {/* ── LEFT: Venue Info ── */}
          <div className="lg:col-span-3">
            {/* Image */}
            <div className="relative h-96 w-full overflow-hidden border-2 border-black rounded mb-8">
              <img
                src={
                  venue.image
                    ? `${venue.image}`
                    : "https://placehold.co/800x600?text=Lapangan&bg=cccccc&txtcolor=666666"
                }
                alt={venue.name}
                className="w-full h-full object-cover grayscale"
                onError={(e: any) => {
                  e.target.src =
                    "https://placehold.co/800x600?text=Image+Error&bg=cccccc&txtcolor=666666";
                }}
              />
            </div>

            {/* Info */}
            <div>
              <h1 className="text-5xl font-poppins font-black text-black mb-2">
                {venue.name}
              </h1>
              <p className="text-2xl font-poppins font-bold text-black mb-6">
                Rp {venue.pricePerHour.toLocaleString("id-ID")} <span className="text-sm font-inter font-normal text-gray-600">/ jam</span>
              </p>

              {venue.location && (
                <p className="font-inter text-gray-700 mb-4">
                  📍 {venue.location}
                </p>
              )}

              <hr className="border-2 border-black my-8" />

              {venue.description && (
                <div>
                  <h3 className="font-poppins font-bold text-xl mb-4">
                    Tentang Lapangan Ini
                  </h3>
                  <p className="font-inter text-gray-700 leading-relaxed whitespace-pre-line">
                    {venue.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Booking Form ── */}
          <div className="lg:col-span-2">
            <div className="border-2 border-black p-8 rounded sticky top-24">
              <h2 className="text-2xl font-poppins font-black text-black mb-8">
                Pesan Lapangan
              </h2>

              <form onSubmit={handleBooking} className="space-y-8">
                {/* Calendar Picker */}
                <div>
                  <label className="font-poppins font-bold text-black mb-3 block">
                    Pilih Tanggal
                  </label>
                  <CalendarPicker
                    value={bookingDate}
                    onChange={setBookingDate}
                    minDate={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Time Slot Picker */}
                <div>
                  <TimeSlotPicker
                    value={startTime}
                    onChange={setStartTime}
                    startHour={7}
                    endHour={22}
                    interval={1}
                  />
                </div>

                {/* Duration Selector */}
                <div>
                  <DurationSelector
                    value={duration}
                    onChange={setDuration}
                    maxDuration={8}
                  />
                </div>

                {/* Price Summary */}
                <div className="border-2 border-black p-6 rounded bg-gray-100">
                  <div className="space-y-3">
                    <div className="flex justify-between font-inter text-gray-700">
                      <span>Harga per jam</span>
                      <span>Rp {venue.pricePerHour.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between font-inter text-gray-700 border-b-2 border-gray-300 pb-3">
                      <span>Durasi</span>
                      <span>{duration} jam</span>
                    </div>
                    <div className="flex justify-between font-poppins font-black text-black text-xl pt-2">
                      <span>Total</span>
                      <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                {token ? (
                  <button
                    type="submit"
                    disabled={isSubmitting || !bookingDate || !startTime}
                    className="w-full bg-black text-white font-poppins font-bold py-4 rounded text-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full border-2 border-black text-black font-poppins font-bold py-4 rounded text-lg hover:bg-black hover:text-white transition-all"
                  >
                    Login untuk Pesan
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

