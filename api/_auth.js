// Security Helper: Session token generation & HMAC verification
const crypto = require('crypto');

function getSecret() {
    return process.env.SESSION_SECRET || process.env.TELEGRAM_BOT_TOKEN || 'mukku_yash_vault_salt_2026';
}

function getPasscode() {
    return (process.env.PASSCODE || "2603").trim();
}

// Generate cryptographic session token (valid for 30 days)
function generateToken() {
    const secret = getSecret();
    const passcode = getPasscode();
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
    const payload = `${expiresAt}:${passcode}`;
    const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return `${expiresAt}.${hmac}`;
}

// Verify session token
function verifyToken(token) {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [expiresAtStr, hmac] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const secret = getSecret();
    const passcode = getPasscode();
    const payload = `${expiresAt}:${passcode}`;
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    try {
        const hmacBuf = Buffer.from(hmac, 'utf8');
        const expectedBuf = Buffer.from(expectedHmac, 'utf8');
        if (hmacBuf.length !== expectedBuf.length) return false;
        return crypto.timingSafeEqual(hmacBuf, expectedBuf);
    } catch (e) {
        return false;
    }
}

// Extract token from request headers or query
function extractToken(req) {
    const authHeader = req.headers['authorization'] || '';
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }
    if (req.headers['x-session-token']) {
        return req.headers['x-session-token'].trim();
    }
    if (req.query && req.query.token) {
        return String(req.query.token).trim();
    }
    return null;
}

module.exports = {
    generateToken,
    verifyToken,
    extractToken,
    getPasscode
};
