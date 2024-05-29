import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    //Manage route protection
    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");
    const isHomePage = pathname === "/home";

    const sensitiveRouter = [
      "/dashboard",
      "/employer-dashboard",
      "/ec",
      "/chat",
      "/job",
      "/search",
      "/get-started",
    ];
    const formattedPathname = pathname.toLowerCase().replace(/\/$/, "");
    const isAccessingSensitiveRoute = sensitiveRouter.some((route) =>
      formattedPathname.startsWith(route.toLowerCase())
    );

    if (isLoginPage || isHomePage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

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
  ],
};
