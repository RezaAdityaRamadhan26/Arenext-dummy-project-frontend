"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function EditVenuePage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();

  const [name, setName] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailVenue = async () => {
      try {
        const response = await api.get(`/venues/${params.id}`);
        const data = response.data.data;

        // isi form dengan data lama
        setName(data.name);
        setPricePerHour(data.pricePerHour);
        setDescription(data.description);
      } catch (error) {
        toast.error("Lapangan tidak ditemukan", {
          description: "Silakan kembali ke dashboard.",
        });
        router.push("/admin");
      } finally {
        setIsLoading(false);
      }
    };

    if (token && params.id) {
      fetchDetailVenue();
    }
  }, [token, params.id, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api.put(
        `/venues/${params.id}`,
        {
          name: name,
          pricePerHour: Number(pricePerHour),
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Lapangan berhasil diperbarui!", {
        description: "Perubahan data lapangan sudah disimpan.",
      });
      router.push("/admin");
    } catch (error: any) {
      const pesanError = error.response?.data?.error || "Silakan coba lagi.";
      toast.error("Gagal menyimpan perubahan", {
        description: pesanError,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-8 transition-all duration-300 font-medium group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Batal & Kembali ke Dashboard</span>
        </button>

        {/* Form Edit */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-500/5 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0">
          <div className="p-6 border-b border-white/10 bg-linear-to-r from-blue-600/10 to-indigo-500/10">
            <h1 className="text-2xl font-extrabold text-white">
              Edit Data Lapangan
            </h1>
            <p className="text-slate-400 mt-1">
              Ubah informasi nama, harga, atau deskripsi lapangan di sini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-blue-200 mb-2">
                Nama Venue
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-200 mb-2">
                Harga Sewa per Jam (Rp)
              </label>
              <input
                type="number"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-200 mb-2">
                Deskripsi Lapangan
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none resize-none"
                required
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
              >
                <Save className="h-5 w-5" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
