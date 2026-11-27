import { NextRequest, NextResponse } from "next/server";
import { localeFromPath } from "@/lib/i18n";
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path === "/gundem" || path.startsWith("/gundem/")) {
    return new NextResponse("Bu bölüm yayından kaldırılmıştır.", {status:410, headers:{"Content-Type":"text/plain; charset=utf-8","X-Robots-Tag":"noindex"}});
  }
  const headers = new Headers(req.headers);
  headers.set("x-dd-locale", localeFromPath(path));
  headers.set("x-dd-path",path);
  return NextResponse.next({request:{headers}});
}
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/|.*\\..*).*)"] };
