// app/layout.js
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
