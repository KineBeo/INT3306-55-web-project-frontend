import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const validRoutes = [
    "/auth/signin",
    "/auth/signup",
    // "/auth/forgot-password",
    "/about",
    "/account",
    "/auth/signup/create-password",
    "/booking/checking-ticket-info",
    "/booking/find-flight",
    "/booking/manage-booking",
    "/booking/online-check-in",
    "/dashboard",
    "/dashboard/signin",
    "/dashboard/account",
    "/dashboard/articles",
    "/dashboard/airplanes",
    "/dashboard/airports",
    "/dashboard/flights",
    "/dashboard/ticket-passengers",
    "/dashboard/tickets",

  ];

  // const dynamicRoutePatterns = [/^\/booking\/checking-ticket-info\/[^/]+$/];

  const pathname = req.nextUrl.pathname;

  const isValidStaticRoute = validRoutes.some((route) => pathname.startsWith(route));

  // const isValidDynamicRoute = dynamicRoutePatterns.some((pattern) => pattern.test(pathname));

  if (!isValidStaticRoute) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?! api|_next/static|_next/image|favicon.ico|$).*)"],
};
