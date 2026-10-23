import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  const isLegacyAdminRoute = request.nextUrl.pathname.startsWith("/admin-radar");
  const isAdminRoute =
    isLegacyAdminRoute || request.nextUrl.pathname.startsWith("/admin/");
  const isLoginRoute = request.nextUrl.pathname === "/login";
  const config = getSupabasePublicConfig();
  if (!config) {
    return isAdminRoute
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  if (!error && data?.claims?.sub) {
    if (isLoginRoute) {
      const redirectResponse = NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }

    return response;
  }

  if (!isAdminRoute) {
    return response;
  }

  const redirectResponse = NextResponse.redirect(
    new URL("/login", request.url)
  );
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}

export const config = {
  matcher: ["/admin-radar/:path*", "/admin/:path*", "/login"],
};
