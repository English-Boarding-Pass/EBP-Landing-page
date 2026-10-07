import { notFound } from "next/navigation";

// Catches every address that no other page claims and hands it to the
// translated not-found page next door. Without this, an unknown address
// gets Next's plain default 404 instead.
export default function CatchAll() {
  notFound();
}
