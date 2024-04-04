import Providers from "~/components/Providers";
import "../styles/globals.css";

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
