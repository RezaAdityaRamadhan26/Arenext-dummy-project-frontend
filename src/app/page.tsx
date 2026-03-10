import PublicNavbar from "../components/layout/PublicNavbar";
import { ArrowRight, Trophy, Clock, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <PublicNavbar />

      <main>
        {/* ── Hero Section ── */}
        <div className="relative overflow-hidden">
          {/* Ambient glow blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center lg:pt-36 lg:pb-40">
            <div className="animate-[fadeIn_0.6s_ease-out_forwards] opacity-0">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-200 backdrop-blur-xl">
                <Sparkles className="h-4 w-4" />
                Platform Booking #1 di Indonesia
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              <span className="inline-block opacity-0 animate-[slideUp_0.6s_ease-out_0.1s_forwards]">
                Sewa Lapangan
              </span>
              <br className="hidden md:block" />
              <span className="inline-block opacity-0 animate-[slideUp_0.6s_ease-out_0.2s_forwards] bg-linear-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                Lebih Mudah & Cepat
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 opacity-0 animate-[fadeIn_0.7s_ease-out_0.35s_forwards]">
              Arenext membantu kamu menemukan dan memesan lapangan olahraga
              terbaik di sekitarmu hanya dengan beberapa klik. Tanpa ribet,
              tanpa antre.
            </p>

            <div className="flex justify-center gap-4 opacity-0 animate-[fadeIn_0.7s_ease-out_0.5s_forwards]">
              <Link
                href="/venues"
                className="group flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Lihat Lapangan
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Features Section ── */}
        <div className="relative border-t border-white/5 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center mb-14 opacity-0 animate-[fadeIn_0.7s_ease-out_0.1s_forwards]">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                Kenapa Harus Arenext?
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Kami bangun pengalaman booking yang kamu nikmati.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/30 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 opacity-0 animate-[slideUp_0.6s_ease-out_0.15s_forwards]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-110">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  Fasilitas Terbaik
                </h3>
                <p className="text-slate-400 text-center text-sm leading-relaxed">
                  Pilihan lapangan dengan standar kualitas tinggi untuk
                  kenyamananmu bermain.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/30 hover:bg-white/10 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 opacity-0 animate-[slideUp_0.6s_ease-out_0.25s_forwards]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-110">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  Pesan Kapan Saja
                </h3>
                <p className="text-slate-400 text-center text-sm leading-relaxed">
                  Sistem booking online 24/7. Atur jadwal mainmu tanpa terikat
                  waktu operasional.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/30 hover:bg-white/10 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 opacity-0 animate-[slideUp_0.6s_ease-out_0.35s_forwards]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:scale-110">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  Transaksi Aman
                </h3>
                <p className="text-slate-400 text-center text-sm leading-relaxed">
                  Pembayaran terjamin aman dan data pemesananmu tersimpan dengan
                  baik.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer mini ── */}
        <footer className="border-t border-white/5 bg-slate-950 py-8 text-center">
          <p className="text-sm text-slate-500">
            &copy; 2026 Arenext. Built with passion for sports.
          </p>
        </footer>
      </main>
    </div>
  );
}
