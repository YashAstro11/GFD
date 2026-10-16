// Local Development Server with Full API and Telegram Support
// Run with: node server.js
// Open: http://localhost:3000

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 1. Load Environment Variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const idx = trimmed.indexOf('=');
            if (idx > 0) {
                const key = trimmed.substring(0, idx).trim();
                const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
                process.env[key] = val;
            }
        }
    });
    console.log('Loaded secrets from .env.local');
}

// 2. MIME Types
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.ogg': 'audio/ogg',
    '.oga': 'audio/ogg',
    '.wav': 'audio/wav',
    '.webm': 'audio/webm'
};

// 3. Serverless Route Handlers
const API_ROUTES = {
    '/api/verify': require('./api/verify'),
    '/api/telegram': require('./api/telegram'),
    '/api/file': require('./api/file'),
    '/api/photo': require('./api/photo'),
    '/api/schedule': require('./api/schedule')
};

function enhanceServerlessReqRes(req, res, parsedUrl, bodyData) {
    // Add Vercel-compatible req properties
    req.query = Object.fromEntries(parsedUrl.searchParams);
    req.body = bodyData;

    // Add Vercel-compatible res helpers
    const originalStatus = res.status;
    res.status = function(statusCode) {
        res.statusCode = statusCode;
        return res;
    };
    res.json = function(data) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    };
    res.send = function(data) {
        res.end(data);
    };
}

const server = http.createServer((req, res) => {
    // Enable CORS for all local development origins (including port 5500 Live Server)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    const host = req.headers.host || 'localhost:3000';
    const parsedUrl = new URL(req.url, `http://${host}`);
    const pathname = parsedUrl.pathname;

    // Check if this is an API route
    const apiHandler = API_ROUTES[pathname];
    if (apiHandler) {
        let bodyRaw = '';
        req.on('data', chunk => { bodyRaw += chunk; });
        req.on('end', async () => {
            let bodyData = {};
            if (bodyRaw) {
                try { bodyData = JSON.parse(bodyRaw); } catch (e) { bodyData = bodyRaw; }
            }
            enhanceServerlessReqRes(req, res, parsedUrl, bodyData);
            try {
                await apiHandler(req, res);
            } catch (err) {
                console.error(`API Route Error (${pathname}):`, err);
                if (!res.headersSent) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ ok: false, error: err.message || 'Internal Server Error' }));
                }
            }
        });
        return;
    }

    // Static file serving
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') safePath = '/index.html';

    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        fs.createReadStream(filePath).pipe(res);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  StudyFlow / Love Space Dev Server Active!`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  Telegram sync & photo proxy running locally.`);
    console.log(`  Autonomous scheduled messages worker active (20s).`);
    console.log(`======================================================\n`);

    // Autonomous background schedule dispatcher (runs every 20 seconds)
    const scheduleHandler = require('./api/schedule');
    setInterval(async () => {
        try {
            if (typeof scheduleHandler.dispatchDueMessages === 'function') {
                await scheduleHandler.dispatchDueMessages();
            }
        } catch (err) {
            console.warn("Background schedule dispatch warning:", err.message);
        }
    }, 20000);
});

