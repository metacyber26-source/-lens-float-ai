// app/api/scan/route.js
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { image } = await req.json();
    if (!image) {
      return Response.json({ error: 'Gambar tidak ditemukan.' }, { status: 400 });
    }

    // Bersihkan format base64 header
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        },
        `Tolong analisis gambar ini secara teliti:
        1. Jika ada teks yang buram, pecah, atau tidak jelas, tajamkan dan rekonstruksi maknanya dengan akurat.
        2. Jika teks tersebut berbahasa asing (seperti Mandarin, Inggris, dll.), berikan terjemahannya ke dalam Bahasa Indonesia yang natural.
        3. Format keluaran secara bersih, langsung tampilkan hasil teks transkripsi dan terjemahannya tanpa basa-basi pengantar agar siap disalin.`
      ],
    });

    return Response.json({ text: response.text });
  } catch (error) {
    return Response.json({ error: error.message || 'Gagal memproses AI.' }, { status: 500 });
  }
}
