import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Store, ShoppingCart, Package, BarChart3 } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store Manager",
  description: "Gerenciamento de loja e caixa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:flex-row bg-gray-50 text-gray-900">
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0">
          <div className="p-6 flex items-center gap-3 border-b border-gray-100">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Store size={24} />
            </div>
            <h1 className="text-xl font-bold">Store Manager</h1>
          </div>
          <nav className="p-4 space-y-1">
            <Link href="/pos" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors">
              <ShoppingCart size={20} />
              <span className="font-medium">PDV & Caixa</span>
            </Link>
            <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors">
              <Package size={20} />
              <span className="font-medium">Produtos</span>
            </Link>
            <Link href="/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors">
              <BarChart3 size={20} />
              <span className="font-medium">Relatórios</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}