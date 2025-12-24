import "./globals.css";

export const metadata = {
  title: "IR Computer Makassar • Rakit PC & Service",
  description:
    "IR Computer Makassar - Rakit PC, upgrade, service, konsultasi cepat via WhatsApp.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
