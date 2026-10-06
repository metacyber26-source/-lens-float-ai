// app/page.js
import FloatingScanner from './components/FloatingScanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Lens Float AI</h1>
        <p className="text-sm text-zinc-400">
          Aplikasi pemindai, penjernih teks buram, dan penerjemah instan berbasis AI. Tombol mengapung siap digunakan di sudut kanan bawah layar Anda.
        </p>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-400">
          💡 <em>Tips:</em> Tambahkan halaman ini ke Home Screen (*Add to Home Screen*) di browser HP Anda agar terasa seperti aplikasi native yang mengambang.
        </div>
      </div>
      
      {/* Komponen Floating Scanner */}
      <FloatingScanner />
    </main>
  );
}
