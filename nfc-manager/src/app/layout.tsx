import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFC Manager | Plaquinhas PIX e Wi-Fi",
  description: "Gerenciamento de links para plaquinhas NFC e QR Code.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
