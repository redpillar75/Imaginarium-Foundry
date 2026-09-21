import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imaginarium Foundry",
  description: "Creative operation center for AI-powered content intelligence",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
