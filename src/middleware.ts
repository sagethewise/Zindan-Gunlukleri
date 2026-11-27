import { NextRequest, NextResponse } from "next/server";
import { localeFromPath } from "@/lib/i18n";
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if(/^\/data\/d4[^/]*\.json$/i.test(path))return new NextResponse(null,{status:410,headers:{"X-Robots-Tag":"noindex"}});
  if (path === "/gundem" || path.startsWith("/gundem/")) {
    return new NextResponse("Bu bölüm yayından kaldırılmıştır.", {status:410, headers:{"Content-Type":"text/plain; charset=utf-8","X-Robots-Tag":"noindex"}});
  }
  const headers = new Headers(req.headers);
  headers.set("x-dd-locale", localeFromPath(path));
  headers.set("x-dd-path",path);
  return NextResponse.next({request:{headers}});
}
export const config = { matcher: ["/data/:path*","/((?!api|_next/static|_next/image|favicon.ico|images/|.*\\..*).*)"] };
