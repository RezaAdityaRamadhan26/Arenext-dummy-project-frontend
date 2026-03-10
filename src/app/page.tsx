import PublicNavbar from "../components/layout/PublicNavbar";
import { ArrowRight, Trophy, Clock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />

      <main>
        <div className="relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center lg:pt-32 lg:pb-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Sewa Lapangan Olahraga <br className="hidden md:block" />
              <span className="text-blue-600">Lebih Mudah & Cepat</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 mb-10">
              Arenext membantu kamu menemukan dan memesan lapangan olahraga
              terbaik di sekitarmu hanya dengan beberapa klik. Tanpa ribet,
              tanpa antre.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/venues"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Lihat Lapangan <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Keunggulan Arenext */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl mb-4">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Fasilitas Terbaik
                </h3>
                <p className="text-gray-500">
                  Pilihan lapangan dengan standar kualitas tinggi untuk
                  kenyamananmu bermain.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Pesan Kapan Saja
                </h3>
                <p className="text-gray-500">
                  Sistem booking online 24/7. Atur jadwal mainmu tanpa terikat
                  waktu operasional.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Transaksi Aman
                </h3>
                <p className="text-gray-500">
                  Pembayaran terjamin aman dan data pemesananmu tersimpan dengan
                  baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}