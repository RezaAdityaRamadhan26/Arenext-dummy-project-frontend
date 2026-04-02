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
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md border-2 border-black rounded-2xl bg-white p-8 md:p-12 flex flex-col gap-8 shadow-none">
        <div className="text-center">
          <h2 className="font-poppins font-black text-3xl mb-2">Daftar Arenext</h2>
          <p className="font-inter text-gray-700 mb-6">Buat akun baru untuk mulai booking lapangan favoritmu.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block font-poppins font-bold mb-2 text-black">Nama Lengkap</label>
            <input
              type="text"
              {...register("name")}
              className="w-full border-2 border-black rounded px-4 py-3 font-inter text-black placeholder-gray-500 bg-transparent focus:outline-none"
              placeholder="Nama lengkap"
              autoComplete="name"
              required
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-500 font-bold">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block font-poppins font-bold mb-2 text-black">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border-2 border-black rounded px-4 py-3 font-inter text-black placeholder-gray-500 bg-transparent focus:outline-none"
              placeholder="Email"
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-500 font-bold">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block font-poppins font-bold mb-2 text-black">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border-2 border-black rounded px-4 py-3 font-inter text-black placeholder-gray-500 bg-transparent focus:outline-none"
              placeholder="Password"
              autoComplete="new-password"
              required
            />
            {errors.password && (
              <p className="mt-2 text-xs text-red-500 font-bold">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-black text-white font-poppins font-bold py-3 px-6 rounded border-2 border-black hover:opacity-80 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? "Memproses..." : "Daftar"}
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="font-inter text-gray-700">Sudah punya akun?</span>{" "}
          <Link href="/login" className="font-poppins font-bold text-black underline hover:no-underline ml-1">Masuk Sekarang</Link>
        </div>
      </div>
    </div>
  );
};