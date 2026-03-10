const https = require('https');

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const data = JSON.stringify({ inputs: req.body.prompt });
    const options = {
        hostname: 'api-inference.huggingface.co',
        path: '/models/black-forest-labs/FLUX.1-schnell',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.HF_TOKEN.trim()}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const request = https.request(options, (response) => {
        let chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
            const buffer = Buffer.concat(chunks);
            if (response.statusCode !== 200) {
                return res.status(response.statusCode).json({ error: 'HF Error' });
            }
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(buffer);
        });
    });

    request.on('error', (e) => res.status(500).json({ error: e.message }));
    request.write(data);
    request.end();
}
