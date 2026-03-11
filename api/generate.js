// api/generate.js
export default async function handler(req, res) {
    // Разрешаем запросы только методом POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN; // Ключ возьмем из настроек Vercel

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            {
                headers: { 
                    Authorization: `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            throw new Error('Hugging Face error');
        }

        // Получаем картинку как массив байтов
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Отправляем картинку обратно на фронтенд
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
