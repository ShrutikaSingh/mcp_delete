import localFont from "next/font/local";

export const PPEditorialNew = localFont({
  src: [
    {
      path: "./PPEditorial New Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./PPEditorial New Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./PPEditorial New Ultrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./PPEditorial New Ultrabold Italic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "./PPEditorial New Ultralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./Ultralight Italic Font.woff2",
      weight: "200",
      style: "italic",
    },
  ],
  variable: "--font-pp-editorial-new",
});
