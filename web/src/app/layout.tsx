import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: '5 LP Business - Global Business Directory & Verified Enterprise Network',
  description: 'Discover verified manufacturers, technology leaders, retailers, and service providers worldwide. Free business registration in English, Gujarati, and Hindi.',
  keywords: ['business directory', 'global businesses', 'gujarat businesses', 'b2b directory', 'verified suppliers'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <FavoritesProvider>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </FavoritesProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
