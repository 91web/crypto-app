import { Geist, Geist_Mono } from "next/font/google";
import "./style/globals.css";
import Mark from "../assets/svg/marks.svg";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sisyphus Trading App",
  description: "Sisyphus Trading Platform",
  icons: {
    icon: {
      url: Mark.src,
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        //  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="bg-gray-800 text-white p-2 text-center">
          &copy; {currentYear} Crypto Trading Platform
        </footer>
      </body>
    </html>
  );
}
