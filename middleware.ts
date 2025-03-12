import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const origin = req.headers.get("Origin") || "*";

  // ✅ Handle CORS (for API requests)
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Vary", "Origin");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");

  // ✅ Handle Preflight (OPTIONS Request)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: res.headers });
  }

  // ✅ Authentication & Route Protection
  const isAuth = await getToken({ req });
  const isLoginPage = pathname.startsWith("/login");
  const isHomePage = pathname === "/home";

  const sensitiveRoutes = [
    "/dashboard",
    "/employer-dashboard",
    "/ec",
    "/chat",
    "/job",
    "/search",
    "/get-started",
  ];
  const formattedPathname = pathname.toLowerCase().replace(/\/$/, "");
  const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
    formattedPathname.startsWith(route.toLowerCase())
  );

  if (isLoginPage || isHomePage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url)); // ✅ Removed `res`
    }
    return res;
  }

  if (!isAuth && isAccessingSensitiveRoute) {
    return NextResponse.redirect(new URL("/home", req.url)); // ✅ Removed `res`
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url)); // ✅ Removed `res`
  }

  return res;
}

export default withAuth(middleware, {
  callbacks: {
    async authorized() {
      return true;
    },
  },
});

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/employer-dashboard/:path*",
    "/ec/:path*",
    "/chat/:path*",
    "/job/:path*",
    "/search/:path*",
    "/get-started/:path*",
    "/api/:path*", // ✅ Apply CORS to all API routes
  ],
};
