import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogIn, Loader2 } from "lucide-react";

import api from '../../../lib/axios'
import { useAuthStore } from '../../../store/authStore'

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid, Reza!" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter!" }),
});

type loginform = z.infer<typeof loginSchema>;

export default function loginPage() {
    const router = useRouter
}