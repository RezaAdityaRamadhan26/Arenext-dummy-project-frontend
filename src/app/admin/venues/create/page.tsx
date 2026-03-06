'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";

export default function CreateVenuePage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [description, setDescription] = useState('');

    const [image, setImage] = useState<any>(null);
    const [imagePreviews, setImagePreviews] = useState('');

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreviews(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        alert('Tombol simpan ditekan!')
    };

    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tombol Kembali */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Dashboard</span>
          </button>

          {/* Kotak Putih Formulir */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-white">
              <h1 className="text-2xl font-bold text-gray-900">
                Tambah Lapangan Baru
              </h1>
              <p className="text-gray-500 mt-1">
                Isi detail di bawah ini untuk menambahkan lapangan ke Arenext.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Input Nama Lapangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lapangan
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Lapangan Futsal Sintetis A"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              {/* Input Harga */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Sewa per Jam (Rp)
                </label>
                <input
                  type="number"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  placeholder="Contoh: 150000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              {/* Input Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Lapangan
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan fasilitas lapangan ini (misal: gratis bola, ada tribun, dll)"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              {/* Input Upload Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Lapangan
                </label>

                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    {/* Tampilkan preview foto jika sudah dipilih, jika belum tampilkan ikon */}
                    {imagePreviews ? (
                      <img
                        src={imagePreviews}
                        alt="Preview"
                        className="mx-auto h-48 w-full object-cover rounded-md mb-4"
                      />
                    ) : (
                      <ImageIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    )}

                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500">
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
                    <p className="text-xs leading-5 text-gray-500">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
