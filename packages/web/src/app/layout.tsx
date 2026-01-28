import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ledFont = JetBrains_Mono({
  variable: "--font-led",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "BusNoti - 버스 도착 알림",
  description: "실시간 버스 도착 정보 알림 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${displayFont.variable} ${ledFont.variable} antialiased bg-transit-black text-transit-yellow`}
      >
        {children}
      </body>
    </html>
  );
}
