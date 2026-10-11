// Vercel Serverless Function: /api/file
// Proxies Telegram file downloads (photos, stickers, voice notes)
// so the Bot Token is never exposed in browser img or audio tags.

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
        return res.status(500).json({ ok: false, error: "TELEGRAM_BOT_TOKEN not configured" });
    }

    const { file_id } = req.query;
    if (!file_id) {
        return res.status(400).json({ ok: false, error: "file_id parameter is required" });
    }

    try {
        // 1. Resolve file path from Telegram
        const infoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${encodeURIComponent(file_id)}`);
        const info = await infoRes.json();

        if (!info.ok || !info.result || !info.result.file_path) {
            return res.status(404).json({ ok: false, error: "Telegram file not found" });
        }

        // 2. Fetch the file bytes from Telegram CDN
        const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${info.result.file_path}`;
        const fileRes = await fetch(fileUrl);

        if (!fileRes.ok) {
            return res.status(fileRes.status).json({ ok: false, error: "Failed to download file from Telegram" });
        }

        const contentType = fileRes.headers.get('content-type') || 'application/octet-stream';
        const arrayBuffer = await fileRes.arrayBuffer();

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800, immutable');
        return res.status(200).send(Buffer.from(arrayBuffer));
    } catch (err) {
        console.error("API File Proxy Error:", err);
        return res.status(500).json({ ok: false, error: err.message || "Failed to proxy file" });
    }
};
