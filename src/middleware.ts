import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  
  const validRoutes = [
    "/auth/signin",
    "/auth/signup",
    // "/auth/forgot-password",
    "/account",
    "/auth/signup/create-password",
    "/booking/checking-ticket-info/[id]",
    "/booking/find-flight",
    "/booking/manage-booking",
    "/booking/online-check-in",
    "/dashboard",
    "/dashboard/signin",
  ];
  
  const pathname = req.nextUrl.pathname;
  
  if (!validRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?! api|_next/static|_next/image|favicon.ico|auth|dashboard/signin|$).*)"],
};
