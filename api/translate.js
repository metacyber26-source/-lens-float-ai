export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image, targetLang } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // Diambil dari Environment Variables Vercel

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di Vercel Environment Variables.' });
    }

    if (!image) {
        return res.status(400).json({ error: 'Gambar tidak ditemukan.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: `Tugas Anda adalah bertindak sebagai OCR cerdas dan translator profesional. 
                            1. Analisis gambar/screenshot/potongan video artikel ini meskipun teksnya buram, kurang jelas, miring, atau berformat terhalang proteksi. 
                            2. Ekstrak dan perbaiki teks asli yang ada di dalam gambar dengan akurat.
                            3. Terjemahkan teks tersebut ke dalam bahasa ${targetLang}.
                            Format jawaban wajib menggunakan format JSON murni tanpa markdown backticks seperti ini:
                            {"original": "teks asli hasil ekstrak", "translated": "hasil terjemahan"}`
                        },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: image
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('Gagal mendapatkan respons dari Gemini AI.');
        }

        const rawText = data.candidates[0].content.parts[0].text;
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanJson);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Gagal memproses gambar dengan AI.' });
    }
}
