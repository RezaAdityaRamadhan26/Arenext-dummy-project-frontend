"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
        console.error("Gagal mengambil data lapangan", error);
        alert("data lapangan tidak ditemukan!");
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
        await api.put
        (`/venues/${params.id}`, {
            name: name,
            pricePerHour: pricePerHour,
            description: description,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        );

        alert('data venue berhasil di update!')
        router.push('/admin')
    } catch (error: any) {
        console.error("gagal mengupdate data venue");
        const pesanError = error.response?.data?.error || "ada yang salah nih";
        alert(`Gagal menyimpan perubahan: ${pesanError}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Batal & Kembali ke Dashboard</span>
        </button>

        {/* Form Edit */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Data Lapangan
            </h1>
            <p className="text-gray-500 mt-1">
              Ubah informasi nama, harga, atau deskripsi lapangan di sini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Venue
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Sewa per Jam (Rp)
              </label>
              <input
                type="number"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Lapangan
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
