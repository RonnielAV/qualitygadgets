import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'Quality Gadgets RD | Tecnología Premium al Alcance de un Clic en RD',
  description: 'Tienda líder en República Dominicana especializada en smartphones 5G, audio Hi-Fi, smartwatches y drones con garantía oficial y envíos en 24h.',
  keywords: 'gadgets rd, tecnologia republica dominicana, iphone 16 pro max rd, sony xm5 rd, dji drone rd, comprar tecnologia santo domingo',
  openGraph: {
    title: 'Quality Gadgets RD | El futuro en tus manos',
    description: 'Tecnología premium al alcance de un clic en RD con despacho express y soporte multi-moneda DOP/USD.',
    locale: 'es_DO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
