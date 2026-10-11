// Vercel Serverless Function: /api/photo
// Serves private childhood photos ONLY to verified sessions.

const fs = require('fs');
const path = require('path');
const { verifyToken, extractToken } = require('./_auth');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Require valid session token
    const token = extractToken(req);
    if (!token || !verifyToken(token)) {
        return res.status(401).json({
            ok: false,
            error: "Unauthorized: Access requires an active passcode session."
        });
    }

    const id = parseInt(req.query.id, 10);
    if (!id || id < 1 || id > 4) {
        return res.status(400).json({ ok: false, error: "Invalid photo ID (must be between 1 and 4)" });
    }

    const filePath = path.join(__dirname, 'photos', `childhood_${id}.png`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ ok: false, error: "Photo not found" });
    }

    try {
        const imageBuffer = fs.readFileSync(filePath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'private, max-age=86400');
        return res.status(200).send(imageBuffer);
    } catch (err) {
        console.error("Photo Serve Error:", err);
        return res.status(500).json({ ok: false, error: "Failed to load photo" });
    }
};
