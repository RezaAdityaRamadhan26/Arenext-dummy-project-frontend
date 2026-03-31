"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../lib/axios";
import { useAuthStore } from "@/src/store/authStore";
import Cookies from "js-cookie";

export default function CreateVenuePage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [name, setName] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState<any>(null);
  const [imagePreviews, setImagePreviews] = useState("");

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreviews(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!image) {
      toast.error("Foto lapangan diperlukan", {
        description: "Silakan pilih foto untuk lapangan.",
      });
      return;
    }

    // Pastikan ada token (dari store atau cookie)
    const tokenCookie = Cookies.get("token");
    if (!token && !tokenCookie) {
      toast.error("Anda harus login sebagai admin terlebih dahulu", {
        description: "Login untuk menambahkan lapangan.",
      });
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("pricePerHour", pricePerHour);
      formData.append("description", description);
      formData.append("image", image);

      // Biarkan axios interceptor menambahkan header Authorization dari cookie
      await api.post("/venues", formData);

      toast.success("Lapangan berhasil ditambahkan!", {
        description: "Lapangan baru sudah tersedia di sistem.",
      });
      router.push("/admin");
    } catch (error: any) {
      const pesanError =
        error.response?.data?.message || "Silakan coba lagi.";
      toast.error("Gagal menambahkan lapangan", {
        description: pesanError,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-8 transition-all duration-300 font-medium group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Kembali ke Dashboard</span>
        </button>

        {/* form */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-500/5 animate-[fadeIn_0.5s_ease-out_forwards] opacity-0">
          <div className="p-6 border-b border-white/10 bg-linear-to-r from-blue-600/10 to-indigo-500/10">
            <h1 className="text-2xl font-extrabold text-white">
              Tambah Lapangan Baru
            </h1>
            <p className="text-slate-400 mt-1">
              Isi detail di bawah ini untuk menambahkan lapangan ke Arenext.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* nama venue */}
            <div>
              <label className="block text-sm font-bold text-blue-200 mb-2">
                Nama Venue
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Lapangan Futsal Sintetis A"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none"
                required
              />
            </div>

            {/* Input Harga */}
            <div>
              <label className="block text-sm font-bold text-blue-200 mb-2">
                Harga Sewa per Jam (Rp)
              </label>
              <input
                type="number"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                placeholder="Contoh: 150000"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none"
                required
              />
            </div>

            {/* Input Deskripsi */}
            <div>
              <label className="block text-sm font-bold text-blue-200 mb-2">
                Deskripsi Lapangan
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan fasilitas lapangan ini (misal: gratis bola, ada tribun, dll)"
                rows={4}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 backdrop-blur-xl transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/15 outline-none resize-none"
                required
              />
            </div>

            {/* Input Upload Foto */}
            <div>
              <label className="block text-sm font-bold text-blue-200 mb-2">
                Foto Lapangan
              </label>

              <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-white/20 px-6 py-10 hover:bg-white/5 hover:border-blue-400/30 transition-all duration-300">
                <div className="text-center">
                  {/* Tampilkan preview foto jika sudah dipilih, jika belum tampilkan ikon */}
                  {imagePreviews ? (
                    <img
                      src={imagePreviews}
                      alt="Preview"
                      className="mx-auto h-48 w-full object-cover rounded-xl mb-4 border border-white/10"
                    />
                  ) : (
                    <ImageIcon
                      className="mx-auto h-12 w-12 text-slate-500"
                      aria-hidden="true"
                    />
                  )}

                  <div className="mt-4 flex text-sm leading-6 text-slate-400 justify-center">
                    <label className="relative cursor-pointer rounded-lg font-bold text-blue-400 hover:text-blue-300 transition-colors">
                      <span>Upload file gambar</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-slate-500 mt-1">
                    PNG, JPG, JPEG up to 4MB
                  </p>
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
              >
                <Save className="h-5 w-5" />
                Simpan Lapangan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
