import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  // Proteksi rute admin - hanya admin yang bisa akses
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/venues", request.url));
    }
  }

  // Proteksi rute user - harus login
  if (pathname.startsWith("/user")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Jika sudah login, redirect dari login/register ke venues
  if ((pathname === "/login" || pathname === "/register") && token) {
    // Jika admin, arahkan ke admin dashboard
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/venues", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/login", "/register", "/venues/:path*"],
};
