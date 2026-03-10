"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import api from "@/src/lib/axios";

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter ya!" }),
  email: z.string().email({ message: "Format email tidak valid!" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter!" }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", data);

      toast.success("Akun berhasil dibuat!", {
        description: "Silakan masuk menggunakan akun barumu.",
      });

      router.push("/login");
    } catch (error: any) {
      toast.error("Pendaftaran gagal", {
        description:
          error.response?.data?.message || "Email mungkin sudah terdaftar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-7 rounded-3xl border border-white/20 bg-linear-to-br from-blue-600/25 via-indigo-500/20 to-violet-500/25 p-6 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.75)] backdrop-blur-xl sm:p-10">
        <div className="space-y-3 text-center opacity-0 animate-[fadeIn_0.7s_ease-out_forwards]">
          <div className="mx-auto inline-flex items-center rounded-full border border-blue-200/30 bg-blue-400/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur-xl">
            Mulai Perjalanan Bookingmu
          </div>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            <span className="inline-block opacity-0 animate-[slideUp_0.55s_ease-out_0.1s_forwards]">
              Gabung
            </span>{" "}
            <span className="inline-block bg-linear-to-r from-blue-200 via-indigo-100 to-violet-200 bg-clip-text opacity-0 text-transparent animate-[slideUp_0.55s_ease-out_0.2s_forwards]">
              Arenext
            </span>
          </h2>
          <p className="mx-auto max-w-sm text-sm text-blue-100/90 opacity-0 animate-[fadeIn_0.7s_ease-out_0.3s_forwards]">
            Daftar sekarang untuk mulai booking lapangan favoritmu.
          </p>
        </div>

        <form
          className="space-y-5 opacity-0 animate-[fadeIn_0.8s_ease-out_0.25s_forwards]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            {/* Input Nama */}
            <div>
              <label className="block text-sm font-semibold text-blue-100">
                Nama Lengkap
              </label>
              <input
                {...register("name")}
                className="mt-1.5 block w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-blue-100/60 shadow-inner backdrop-blur-xl transition duration-300 focus:border-blue-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-300/70"
                placeholder="Muhammad Reza"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-rose-200">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-blue-100">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="mt-1.5 block w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-blue-100/60 shadow-inner backdrop-blur-xl transition duration-300 focus:border-blue-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-300/70"
                placeholder="reza@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-200">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-semibold text-blue-100">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="mt-1.5 block w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-blue-100/60 shadow-inner backdrop-blur-xl transition duration-300 focus:border-blue-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-300/70"
                placeholder="*******"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-rose-200">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200/30 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/50 transition duration-300 hover:scale-105 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Daftar Sekarang
              </>
            )}
          </button>

          <p className="text-center text-sm text-blue-100/90">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="inline-block font-extrabold text-white transition duration-300 hover:scale-105 hover:text-blue-200 hover:underline active:scale-95"
            >
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
