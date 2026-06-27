import "./globals.css";

export const metadata = {
  title: "ClinicaOS - Dashboard paziente",
  description: "Cartella clinica interattiva con body map dettagliata e loop clinico.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ClinicaOS",
  },
  other: { "mobile-web-app-capable": "yes" },
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
