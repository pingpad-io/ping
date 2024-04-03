import "../styles/globals.css";
import dynamic from 'next/dynamic'
const Providers = dynamic(() => import('../components/Providers'), { ssr: false })

export const metadata = {
  title: "Pingpad",
  description: "reach your people on pingpad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
