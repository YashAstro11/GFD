// Vercel Serverless Function: /api/schedule
// Handles server-side scheduled love messages queue & autonomous background dispatch.
// Supported triggers: Vercel Cron, external cron ping (cron-job.org), local setInterval, QStash, or manual sync.

const fs = require('fs');
const path = require('path');
const { verifyToken, extractToken } = require('./_auth');

// Storage file paths
const LOCAL_STORAGE_FILE = path.join(__dirname, '..', '.data_schedule.json');
const TMP_STORAGE_FILE = path.join('/tmp', '.data_schedule.json');

// In-memory cache fallback for fast access within same serverless invocation
let memoryStore = null;

// Escape HTML entities for Telegram HTML parse_mode
function escapeTelegramHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// -------------------------------------------------------------------------
// Storage Abstraction (Redis / File / /tmp)
// -------------------------------------------------------------------------
async function loadScheduledQueue() {
    // 1. Try Vercel KV / Upstash Redis if configured
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (kvUrl && kvToken) {
        try {
            const res = await fetch(`${kvUrl}/get/studyflow_scheduled_messages`, {
                headers: { 'Authorization': `Bearer ${kvToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.result) {
                    const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
                    if (Array.isArray(parsed)) return parsed;
                }
            }
        } catch (e) {
            console.warn("KV storage read warning:", e.message);
        }
    }

    // 2. Try Local storage file (Local Node / dev server)
    try {
        if (fs.existsSync(LOCAL_STORAGE_FILE)) {
            const raw = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {}

    // 3. Try /tmp file (Vercel serverless container lifecycle)
    try {
        if (fs.existsSync(TMP_STORAGE_FILE)) {
            const raw = fs.readFileSync(TMP_STORAGE_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {}

    // 4. In-memory cache fallback
    return memoryStore || [];
}

async function saveScheduledQueue(list) {
    memoryStore = list;

    // 1. Save to Vercel KV / Upstash Redis if configured
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (kvUrl && kvToken) {
        try {
            await fetch(`${kvUrl}/set/studyflow_scheduled_messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${kvToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(list)
            });
        } catch (e) {
            console.warn("KV storage write warning:", e.message);
        }
    }

    // 2. Save to Local storage file if directory writable
    try {
        fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(list, null, 2), 'utf8');
    } catch (e) {
        // Fallback to /tmp if root is read-only (standard on serverless)
        try {
            fs.writeFileSync(TMP_STORAGE_FILE, JSON.stringify(list, null, 2), 'utf8');
        } catch (tmpErr) {}
    }
}

// -------------------------------------------------------------------------
// Core Dispatcher: Dispatches due messages to Telegram
// -------------------------------------------------------------------------
async function dispatchDueMessages() {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        console.warn("Telegram credentials missing in schedule dispatcher.");
        return { ok: false, error: "Missing Telegram credentials", dispatched: 0 };
    }

    const list = await loadScheduledQueue();
    if (!list || list.length === 0) {
        return { ok: true, dispatched: 0 };
    }

    const now = Date.now();
    let dispatchedCount = 0;
    let hasChanges = false;

    for (const item of list) {
        if (item.sent) continue;

        // Compare epoch timestamp (Timezone agnostic!)
        const isDue = (item.scheduledTimestamp && now >= item.scheduledTimestamp) ||
                      (!item.scheduledTimestamp && item.created && (now - item.created > 60000));

        if (isDue) {
            const timeLabel = item.displayTime || item.time || 'Scheduled Time';
            const cleanText = item.text || '';
            const telegramText = `⏰ <b>Scheduled Love Note from Mukku</b> 💕\n` +
                                 `🕒 <i>Scheduled for: ${timeLabel}</i>\n\n` +
                                 `${escapeTelegramHtml(cleanText)}`;

            try {
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: telegramText,
                        parse_mode: 'HTML'
                    })
                });

                const data = await response.json();
                if (data && data.ok) {
                    item.sent = true;
                    item.sentAt = Date.now();
                    item.telegramMessageId = data.result && data.result.message_id;
                    item.status = 'sent';
                    dispatchedCount++;
                    hasChanges = true;
                    console.log(`[Schedule Dispatcher] Successfully delivered scheduled message (${item.id}) to Yash!`);
                } else {
                    console.error("[Schedule Dispatcher] Telegram API error:", data);
                }
            } catch (err) {
                console.error("[Schedule Dispatcher] Fetch error:", err.message);
            }
        }
    }

    // Clean up items older than 3 days
    const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
    const cleanedList = list.filter(item => (item.created || 0) > threeDaysAgo);

    if (hasChanges || cleanedList.length !== list.length) {
        await saveScheduledQueue(cleanedList);
    }

    return { ok: true, dispatched: dispatchedCount };
}

// -------------------------------------------------------------------------
// Main Handler
// -------------------------------------------------------------------------
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const action = req.query.action || (req.body && req.body.action) || 'list';

    // 1. Cron / Auto-dispatch Action (Can be triggered by Vercel cron, external cron, or client ping)
    if (action === 'cron' || action === 'dispatch') {
        try {
            const result = await dispatchDueMessages();
            return res.status(200).json(result);
        } catch (err) {
            console.error("Cron dispatch error:", err);
            return res.status(500).json({ ok: false, error: err.message });
        }
    }

    // ALL OTHER ACTIONS (list, create, delete) REQUIRE AUTHENTICATION
    const token = extractToken(req);
    const isLocalDev = token && token.startsWith('local_dev_session_');
    const isVerified = token && verifyToken(token);
    if (!token || (!isVerified && !isLocalDev)) {
        return res.status(401).json({
            ok: false,
            error: "Unauthorized: Access requires a valid vault passcode session."
        });
    }

    // 2. List scheduled messages
    if (action === 'list') {
        const queue = await loadScheduledQueue();
        return res.status(200).json({ ok: true, items: queue });
    }

    // 3. Create / Schedule a new message
    if (action === 'create' || action === 'schedule') {
        const { id, text, time, displayTime, date, scheduledTimestamp } = req.body || {};
        if (!text || !text.trim()) {
            return res.status(400).json({ ok: false, error: "Message text is required" });
        }

        const queue = await loadScheduledQueue();
        const existingIdx = queue.findIndex(q => q.id === id);

        const newItem = {
            id: id || ('sched_srv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
            text: text.trim(),
            time: time || '',
            displayTime: displayTime || time || '',
            date: date || new Date().toISOString().split('T')[0],
            scheduledTimestamp: parseInt(scheduledTimestamp, 10) || (Date.now() + 60000),
            created: Date.now(),
            sent: false,
            sentAt: null,
            status: 'pending'
        };

        if (existingIdx !== -1) {
            queue[existingIdx] = newItem;
        } else {
            queue.push(newItem);
        }

        await saveScheduledQueue(queue);

        // Optional QStash integration: trigger webhook exactly at scheduled time
        if (process.env.QSTASH_TOKEN) {
            try {
                const host = req.headers.host || 'studyflow.vercel.app';
                const protocol = host.includes('localhost') ? 'http' : 'https';
                const targetUrl = `${protocol}://${host}/api/schedule?action=cron`;
                const notBeforeSeconds = Math.floor(newItem.scheduledTimestamp / 1000);

                await fetch(`https://qstash.upstash.io/v2/publish/${targetUrl}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.QSTASH_TOKEN}`,
                        'Upstash-Not-Before': String(notBeforeSeconds)
                    }
                });
                console.log(`[QStash] Scheduled exact-minute trigger for: ${newItem.displayTime}`);
            } catch (qErr) {
                console.warn("[QStash] Scheduling warning:", qErr.message);
            }
        }

        return res.status(200).json({ ok: true, item: newItem });
    }

    // 4. Delete / Cancel a scheduled message
    if (action === 'delete') {
        const { id } = req.body || req.query || {};
        if (!id) {
            return res.status(400).json({ ok: false, error: "ID is required to delete" });
        }

        const queue = await loadScheduledQueue();
        const filtered = queue.filter(q => q.id !== id);
        await saveScheduledQueue(filtered);
        return res.status(200).json({ ok: true, id: id });
    }

    return res.status(400).json({ ok: false, error: `Unsupported action: ${action}` });
};

// Export dispatcher for use in server.js background worker
module.exports.dispatchDueMessages = dispatchDueMessages;
