// api/generate.js
export default async function handler(req, res) {
    const { prompt } = req.body;
    const apiToken = process.env.HF_TOKEN; // Токен будет браться из настроек Vercel

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) throw new Error("Ошибка Hugging Face");

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
