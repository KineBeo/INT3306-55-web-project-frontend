import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const validRoutes = [
    "/auth/signin",
    "/auth/signup",
    // "/auth/forgot-password",
    "/account",
    "/auth/signup/create-password",
    "/booking/checking-ticket-info/:id",
    "/booking/find-flight",
    "/booking/manage-booking",
    "/booking/online-check-in",
    "/dashboard",
    "/dashboard/signin",
    "/dashboard/account",
  ];

  const dynamicRoutePatterns = [/^\/booking\/checking-ticket-info\/[^/]+$/];

  const pathname = req.nextUrl.pathname;

  const isValidStaticRoute = validRoutes.some((route) => pathname.startsWith(route));

  const isValidDynamicRoute = dynamicRoutePatterns.some((pattern) => pattern.test(pathname));

  if (!isValidStaticRoute && !isValidDynamicRoute) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?! api|_next/static|_next/image|favicon.ico|$).*)"],
};
