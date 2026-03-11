export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            {
                headers: { 
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json" 
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            // Если модель загружается, HF вернет ошибку с временем ожидания
            return res.status(response.status).json(errorData);
        }

        const arrayBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(Buffer.from(arrayBuffer));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
