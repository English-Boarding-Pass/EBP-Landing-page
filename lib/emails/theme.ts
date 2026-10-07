// Shared by every email the site sends. Email clients ignore <style> blocks
// and modern CSS unevenly, so the templates are table layout with inline
// styles only. Colours mirror the brand tokens in app/globals.css.

export const NAVY = "#0b1956";
export const SLATE = "#26344d";
export const SKY = "#9cccf6";
export const SKY_INK = "#2563a8";
export const ICE = "#eaf5fc";
export const IVORY = "#f8f3ea";
export const RED = "#d6223a";

export const SANS =
  "'DM Sans','Segoe UI',Roboto,Helvetica,Arial,'Noto Sans Sinhala','Iskoola Pota','Noto Sans Tamil','Latha',sans-serif";
export const MONO = "'JetBrains Mono',Menlo,Consolas,'Courier New',monospace";

export function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
