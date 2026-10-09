import type { MetadataRoute } from "next";

// Lets a phone save the site to the home screen with the EBP icon and brand
// colour, and gives search engines the site's name and icons.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "English Boarding Pass",
    short_name: "EBP",
    description: "English that takes you places.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1956",
    theme_color: "#0B1956",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
