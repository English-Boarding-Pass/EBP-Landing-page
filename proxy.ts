import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything gets a language prefix except Next's own paths, files with an
  // extension, and the generated icons (app/icon.tsx, app/apple-icon.tsx),
  // whose addresses have no extension and would otherwise be redirected to
  // /en/icon and never load.
  matcher: ["/((?!api|trpc|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
