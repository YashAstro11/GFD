// Vercel Serverless Function: /api/verify
// Validates passcode with strict rate-limiting, and issues HMAC session tokens.

const { generateToken, verifyToken, extractToken, validatePasscode } = require('./_auth');

// In-memory sliding window rate-limiter per client IP
const rateLimitMap = new Map();

function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry) return { allowed: true };

    if (entry.lockedUntil) {
        if (now < entry.lockedUntil) {
            const minutesLeft = Math.ceil((entry.lockedUntil - now) / 60000);
            return { allowed: false, locked: true, minutesLeft };
        } else {
            rateLimitMap.delete(ip);
            return { allowed: true };
        }
    }
    return { allowed: true, attempts: entry.attempts || 0 };
}

function registerFailure(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { attempts: 0 };
    entry.attempts += 1;

    if (entry.attempts >= 5) {
        entry.lockedUntil = now + (15 * 60 * 1000); // 15 minutes lockout
    }
    rateLimitMap.set(ip, entry);
    return entry;
}

function registerSuccess(ip) {
    rateLimitMap.delete(ip);
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const ip = getClientIp(req);
    const limitStatus = checkRateLimit(ip);

    if (!limitStatus.allowed) {
        return res.status(429).json({
            ok: false,
            error: `Too many failed attempts. Security lock active. Please try again in ${limitStatus.minutesLeft} minute(s).`
        });
    }

    // 1. Check if client already has a valid token (e.g. restoring session)
    const existingToken = extractToken(req);
    if (existingToken && verifyToken(existingToken)) {
        return res.status(200).json({
            ok: true,
            sessionToken: existingToken,
            secret: {
                letterParagraphs: [
                    "meri mukku darling my love my life mujhe pata hai girlfrind ek bohot chota word hai jo tumhe define kar payega lekin tum mere liye bohot jyada khaas ho tumhara meri life me hona bhagwan ke hone se kam nhi hai",
                    "mujhe pata hai abhi hum door hai lekin dono mehnat krte rhenge aur dono ek doosre ka saath hasil kr lenege khoob sara ghoomenge khoob sara khayenge aur khoob sara pyaar kiya krenge",
                    "my love my wife my universe i love you bohot bohot bohot bohot saraa",
                    "love you meri jaan mera babu meri shona meri cuta patuta"
                ]
            }
        });
    }

    // 2. Validate passcode
    const { passcode } = req.body || {};

    if (passcode && validatePasscode(passcode)) {
        registerSuccess(ip);
        const token = generateToken();
        return res.status(200).json({
            ok: true,
            sessionToken: token,
            secret: {
                letterParagraphs: [
                    "meri mukku darling my love my life mujhe pata hai girlfrind ek bohot chota word hai jo tumhe define kar payega lekin tum mere liye bohot jyada khaas ho tumhara meri life me hona bhagwan ke hone se kam nhi hai",
                    "mujhe pata hai abhi hum door hai lekin dono mehnat krte rhenge aur dono ek doosre ka saath hasil kr lenege khoob sara ghoomenge khoob sara khayenge aur khoob sara pyaar kiya krenge",
                    "my love my wife my universe i love you bohot bohot bohot bohot saraa",
                    "love you meri jaan mera babu meri shona meri cuta patuta"
                ]
            }
        });
    }

    // Passcode incorrect: register failure
    const updated = registerFailure(ip);
    const remaining = Math.max(0, 5 - updated.attempts);

    if (updated.lockedUntil) {
        return res.status(429).json({
            ok: false,
            error: "Too many failed attempts. Security lock active for 15 minutes."
        });
    }

    return res.status(401).json({
        ok: false,
        error: `Incorrect passcode. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`
    });
};
