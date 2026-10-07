// app/layout.js
import './globals.css'; // Opsional, atau bisa dikosongkan jika belum ada file CSS

export const metadata = {
  title: 'Lens Float AI',
  description: 'Floating AI Scanner and Translator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
