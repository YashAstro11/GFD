// Security Helper: Session token generation & HMAC verification
const crypto = require('crypto');

// Irreversible cryptographic SHA-256 hash of the master passphrase
const SECURE_PASSCODE_HASH = 'e28abb96c0d0d154a61af76a04a39736443fcc4fb2d7ea7ef82492cc58b81280';

function getSecret() {
    return process.env.SESSION_SECRET || process.env.TELEGRAM_BOT_TOKEN || 'mukku_yash_vault_salt_2026';
}

function validatePasscode(entered) {
    if (!entered || typeof entered !== 'string') return false;
    const clean = entered.trim();

    // 1. If custom PASSCODE is explicitly configured in Vercel environment
    if (process.env.PASSCODE && process.env.PASSCODE.trim() !== '2603') {
        if (clean === process.env.PASSCODE.trim()) return true;
    }

    // 2. Cryptographic one-way hash validation (safe, instant, and never reveals password)
    const inputHash = crypto.createHash('sha256').update(clean).digest('hex');
    try {
        const a = Buffer.from(inputHash, 'utf8');
        const b = Buffer.from(SECURE_PASSCODE_HASH, 'utf8');
        return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch (e) {
        return false;
    }
}

// Generate cryptographic session token (valid for 30 days)
function generateToken() {
    const secret = getSecret();
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
    const payload = `${expiresAt}:vault_authenticated`;
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
    const payload = `${expiresAt}:vault_authenticated`;
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
    validatePasscode,
    getSecret
};
