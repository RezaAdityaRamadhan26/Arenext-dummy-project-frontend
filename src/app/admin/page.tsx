import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/src/store/authStore";
import { LogOut, LayoutDashboard, Map } from "lucide-react";

export default function AdminDashboard () {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isChecking)  {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">Memeriksa akses...</div>;
  }
};

return (
  <div className="min-h-screen bg-gray-50">
    {/* Navbar Atas */}
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Judul Kiri */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Arenext <span className="text-blue-600">Admin</span>
            </span>
          </div>

          {/* Menu Kanan (Profil & Logout) */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Halo, Admin!</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Konten Utama */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Kartu Ucapan Selamat Datang */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
        <div className="bg-blue-50 p-4 rounded-full">
          <Map className="h-10 w-10 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ruang Kendali Arenext
          </h1>
          <p className="mt-1 text-gray-500">
            Selamat datang kembali. Di sini kamu bisa mengelola seluruh data
            lapangan dan pesanan.
          </p>
        </div>
      </div>

      {/* Area Kosong untuk Daftar Lapangan Nanti */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Daftar Lapangan</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + Tambah Lapangan
          </button>
        </div>

        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <p className="text-gray-500 text-sm">
            Data lapangan akan kita munculkan di sini nanti...
          </p>
        </div>
      </div>
    </main>
  </div>
);