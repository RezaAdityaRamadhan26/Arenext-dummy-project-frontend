"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/src/components/layout/PublicNavbar";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/store/authStore";

export default function CreateVenuePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    pricePerHour: "",
  });
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("pricePerHour", formData.pricePerHour);
      if (imageFile) data.append("image", imageFile);

      await api.post("/venues", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Lapangan berhasil dibuat!", {
        description: "Lapangan baru berhasil ditambahkan ke sistem.",
      });
      router.push("/admin/venues");
    } catch (error: any) {
      toast.error("Gagal membuat lapangan", {
        description:
          error.response?.data?.message || "Silakan coba lagi nanti.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Tambah Lapangan Baru
          </h1>
          <p className="font-inter text-gray-700">
            Isi form di bawah untuk menambahkan lapangan baru.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="border-2 border-black p-8 rounded animate-slideUp">
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
              placeholder="Contoh: Lapangan Futsal Merdeka"
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
              placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
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
              placeholder="Contoh: 150000"
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
              ref={fileInputRef}
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
              placeholder="Deskripsi lengkap tentang lapangan ini..."
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
            {isSubmitting ? "Menyimpan..." : "Buat Lapangan"}
          </button>
        </form>
      </main>
    </div>
  );
}
 
