"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function EditVenuePage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    pricePerHour: "",
    image: "",
  });

  useEffect(() => {
    const fetchDetailVenue = async () => {
      try {
        const response = await api.get(`/venues/${params.id}`);
        const data = response.data.data;

        setFormData({
          name: data.name || "",
          location: data.location || "",
          description: data.description || "",
          pricePerHour: data.pricePerHour || "",
          image: data.image || "",
        });
      } catch (error) {
        toast.error("Lapangan tidak ditemukan", {
          description: "Silakan kembali ke dashboard.",
        });
        router.push("/admin/venues");
      } finally {
        setIsLoading(false);
      }
    };

    if (token && params.id) {
      fetchDetailVenue();
    }
  }, [token, params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.pricePerHour) {
      toast.error("Form tidak lengkap", {
        description: "Silakan isi semua field yang diperlukan.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.put(
        `/venues/${params.id}`,
        {
          ...formData,
          pricePerHour: Number(formData.pricePerHour),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Lapangan berhasil diperbarui!", {
        description: "Perubahan berhasil disimpan.",
      });
      router.push("/admin/venues");
    } catch (error: any) {
      toast.error("Gagal memperbarui lapangan", {
        description:
          error.response?.data?.message || "Silakan coba lagi nanti.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <PublicNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-inter text-gray-700">Memuat data lapangan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <PublicNavbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:text-gray-600 mb-8 transition-colors font-inter font-semibold group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </button>

        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-poppins font-black mb-2">
            Edit Lapangan
          </h1>
          <p className="font-inter text-gray-700">
            Perbarui informasi lapangan Anda.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border-2 border-black p-8 rounded animate-slideUp"
        >
          {/* Name */}
          <div className="mb-6">
            <label className="font-poppins font-bold text-black block mb-2">
              Nama Lapangan *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-2 border-black rounded px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-black/30"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="font-poppins font-bold text-black block mb-2">
              Lokasi *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border-2 border-black rounded px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-black/30"
              required
            />
          </div>

          {/* Price Per Hour */}
          <div className="mb-6">
            <label className="font-poppins font-bold text-black block mb-2">
              Harga per Jam (Rp) *
            </label>
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="w-full border-2 border-black rounded px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-black/30"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="font-poppins font-bold text-black block mb-2">
              Gambar Lapangan
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border-2 border-black rounded px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-black/30 bg-white"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 w-full h-48 object-cover rounded border border-black" />
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="font-poppins font-bold text-black block mb-2">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full border-2 border-black rounded px-4 py-3 font-inter focus:outline-none focus:ring-2 focus:ring-black/30 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-poppins font-bold py-4 rounded text-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </main>
    </div>
  );
}
 
