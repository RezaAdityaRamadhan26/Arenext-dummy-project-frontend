"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

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

      const token = response.data.token;
      const user = response.data.dataUser;

      login(user, token)
      toast.success("login berhasil!", {
        description: "selamat datang kembali di Arenext!",
      });

      if (user.role === "ADMIN") {
        router.push('/admin')
      } else {
        router.push('/venues')
      }
      
    } catch (error: any) {
      console.error("CCTV 4: TERJADI ERROR ->", error); // Ini akan membongkar masalah aslinya
      
      toast.error("Login gagal", {
        description:
          error?.response?.data?.message || error.message || "Pastikan email dan password benar",
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
        {/* Header Judul */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Arenext</h2>
          <p className="mt-2 text-sm text-gray-500">
            Masuk ke akunmu untuk mulai menyewa lapangan.
          </p>
        </div>

        {/* Form Login */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="reza@arenext.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="*******"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Masuk Sekarang
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
