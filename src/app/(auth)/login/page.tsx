"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";

import api from "../../../lib/axios";
import { useAuthStore } from "@/src/store/authStore";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid, Reza!" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter!" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state: any) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    let response: any;
    try {
      response = await api.post("/auth/login", data);

      const token = response.data.token || response.data.data?.token;
      const user = response.data.user || response.data.data?.user || response.data.dataUser;

      if (!user) {
        throw new Error("Data user tidak ditemukan dari backend!");
      }

      login(user, token);
      toast.success("Login berhasil!", {
        description: "Selamat datang kembali di Arenext!",
      });

      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/venues");
      }
    } catch (error: any) {
      toast.error("Login gagal", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Pastikan email dan password benar",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md border-2 border-black rounded-2xl bg-white p-8 md:p-12 flex flex-col gap-8 shadow-none">
        <div className="text-center">
          <h2 className="font-poppins font-black text-3xl mb-2">Masuk ke Arenext</h2>
          <p className="font-inter text-gray-700 mb-6">Login untuk mulai booking lapangan favoritmu.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              autoComplete="current-password"
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
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="font-inter text-gray-700">Belum punya akun?</span>{" "}
          <Link href="/register" className="font-poppins font-bold text-black underline hover:no-underline ml-1">Daftar Sekarang</Link>
        </div>
      </div>
    </div>
  );
};
