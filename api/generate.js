const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { prompt } = req.body;
    const apiToken = process.env.HF_TOKEN;

    try {
        const response = await axios({
            url: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiToken.trim()}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify({ inputs: prompt }),
            responseType: 'arraybuffer',
        });

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(response.data);

    } catch (error) {
        console.error("Error details:", error.response ? error.response.data.toString() : error.message);
        res.status(500).json({ error: "Ошибка нейросети. Проверь токен или попробуй позже." });
    }
}
