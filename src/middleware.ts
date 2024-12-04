import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  
  const validRoutes = [
    "/auth/signin",
    "/auth/signup",
    // "/auth/forgot-password",
    "/auth/signup/create-password",
    "/booking/checking-ticket-info/[id]",
    "/booking/find-flight",
    "/booking/manage-booking",
    "/booking/online-check-in",
    "/dashboard",
  ];
  
  const pathname = req.nextUrl.pathname;
  
  // redirect to 404 page if the route is not valid
  if (!validRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }
  
  const token = req.cookies.get("token");
  
  if (!token) {
    const loginUrl = new URL("/auth/signin", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?! api|_next/static|_next/image|favicon.ico|auth|dashboard|$).*)"],
};
