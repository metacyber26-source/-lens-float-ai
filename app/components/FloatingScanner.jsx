// app/components/FloatingScanner.jsx
'use client';
import { useState } from 'react';

export default function FloatingScanner() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResult('');
    setCopied(false);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setImage(base64Image);
      await processImageWithAI(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const processImageWithAI = async (base64Data) => {
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.text);
      } else {
        setResult(data.error || 'Terjadi kesalahan saat memproses.');
      }
    } catch (err) {
      setResult('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tombol Melayang (Floating Action Button) */}
      <label className="flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl cursor-pointer active:scale-95 transition-transform">
        <span className="text-xl">📷</span>
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={handleCapture} 
          className="hidden" 
        />
      </label>

      {/* Jendela Hasil / Modal Mengapung */}
      {(loading || result) && (
        <div className="absolute bottom-16 right-0 w-80 max-w-[90vw] bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-2xl text-sm text-zinc-100 backdrop-blur-md">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-xs text-indigo-400 uppercase tracking-wider">Hasil Pemindaian AI</span>
            <button 
              onClick={() => { setResult(''); setImage(null); }}
              className="text-zinc-500 hover:text-zinc-300 text-xs">
              ✕ Tutup
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto bg-zinc-950 p-3 rounded-xl mb-3 text-xs leading-relaxed select-all border border-zinc-800/50">
            {loading ? (
              <div className="flex items-center justify-center py-6 space-x-2 text-zinc-400 animate-pulse">
                <span>Menganalisis & menjernihkan teks...</span>
              </div>
            ) : (
              result
            )}
          </div>

          {!loading && result && (
            <button 
              onClick={copyToClipboard}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs transition-colors shadow-lg shadow-emerald-950">
              {copied ? '✓ Berhasil Disalin!' : 'Salin ke Clipboard'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
