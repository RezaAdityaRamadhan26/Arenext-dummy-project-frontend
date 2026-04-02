import PublicNavbar from "../components/layout/PublicNavbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <PublicNavbar />
      <main>
        {/* Hero Section */}
        <section className="w-full border-b-2 border-black pb-16 pt-12 md:pt-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
            <h1 className="font-poppins font-black text-5xl md:text-7xl mb-6 leading-tight tracking-tight">
              Sewa Lapangan
              <span className="block mt-2">Jadi Lebih Mudah</span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-gray-700 mb-10 max-w-xl">
              Platform booking lapangan olahraga paling sederhana. Temukan dan pesan lapangan impian Anda hanya dalam beberapa klik.
            </p>
            <div className="w-full flex flex-col sm:flex-row gap-3 max-w-xl mb-8">
              <input
                type="text"
                placeholder="Cari nama atau lokasi lapangan"
                className="flex-1 border-2 border-black rounded px-4 py-4 font-inter text-black placeholder-gray-500 bg-transparent focus:outline-none"
              />
              <Link
                href="/venues"
                className="bg-black text-white font-poppins font-bold py-4 px-8 rounded border-2 border-black hover:opacity-80 transition-opacity text-center"
              >
                Cari Lapangan
              </Link>
            </div>
            <Link
              href="/venues"
              className="inline-block bg-black text-white font-poppins font-bold py-4 px-10 rounded border-2 border-black text-lg hover:opacity-80 transition-opacity"
            >
              Lihat Semua Lapangan →
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-2 border-black rounded p-8 flex flex-col items-center text-center bg-white">
              <div className="w-12 h-12 mb-4 border-2 border-black rounded-full flex items-center justify-center font-poppins font-black text-2xl">⚡</div>
              <h3 className="font-poppins font-bold text-xl mb-2">Mudah & Cepat</h3>
              <p className="font-inter text-gray-700">Booking simpel hanya dalam beberapa klik saja.</p>
            </div>
            <div className="border-2 border-black rounded p-8 flex flex-col items-center text-center bg-white">
              <div className="w-12 h-12 mb-4 border-2 border-black rounded-full flex items-center justify-center font-poppins font-black text-2xl">📍</div>
              <h3 className="font-poppins font-bold text-xl mb-2">Bermacam Lokasi</h3>
              <p className="font-inter text-gray-700">Lapangan tersedia di berbagai lokasi strategis di kota Anda.</p>
            </div>
            <div className="border-2 border-black rounded p-8 flex flex-col items-center text-center bg-white">
              <div className="w-12 h-12 mb-4 border-2 border-black rounded-full flex items-center justify-center font-poppins font-black text-2xl">👥</div>
              <h3 className="font-poppins font-bold text-xl mb-2">Komunitas Seru</h3>
              <p className="font-inter text-gray-700">Bergabung dengan ribuan pemain yang mempercayai Arenext.</p>
            </div>
            <div className="border-2 border-black rounded p-8 flex flex-col items-center text-center bg-white">
              <div className="w-12 h-12 mb-4 border-2 border-black rounded-full flex items-center justify-center font-poppins font-black text-2xl">✔️</div>
              <h3 className="font-poppins font-bold text-xl mb-2">Transparan</h3>
              <p className="font-inter text-gray-700">Harga jelas tanpa biaya tersembunyi. Apa yang kamu lihat itu harganya.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full border-t-2 border-black bg-white py-16">
          <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-poppins font-black mb-4">Mulai Pesan Lapangan Sekarang</h2>
            <p className="font-inter text-lg text-gray-700 mb-8 max-w-xl">
              Temukan lapangan terbaik dan pesan sesuai jadwal Anda.
            </p>
            <Link
              href="/venues"
              className="inline-block bg-black text-white font-poppins font-bold py-4 px-10 rounded border-2 border-black text-lg hover:opacity-90 transition-opacity"
            >
              Jelajahi Lapangan
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t-2 border-black bg-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left">
            <h3 className="text-2xl font-poppins font-black mb-2">ARENEXT</h3>
            <p className="font-inter text-gray-700">Platform booking lapangan olahraga paling mudah di Indonesia.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h4 className="font-poppins font-bold mb-2">Menu</h4>
              <ul className="space-y-2 font-inter text-gray-700">
                <li>
                  <Link href="/venues" className="hover:text-black">Lapangan</Link>
                </li>
                <li>
                  <a href="#" className="hover:text-black">Tentang Kami</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-poppins font-bold mb-2">Bantuan</h4>
              <ul className="space-y-2 font-inter text-gray-700">
                <li>
                  <a href="#" className="hover:text-black">Hubungi Kami</a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">Kebijakan</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-gray-300 pt-8 text-center mt-8">
          <p className="font-inter text-gray-600">© 2026 Arenext. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}

