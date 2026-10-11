// Vercel Serverless Function: /api/telegram
// Handles all Telegram Bot API requests securely without exposing tokens to frontend clients.

module.exports = async (req, res) => {
    // CORS headers for local testing and deployment
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({
            ok: false,
            error: "Server configuration missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in environment variables."
        });
    }

    try {
        const action = req.query.action || (req.body && req.body.action);

        if (!action) {
            return res.status(400).json({ ok: false, error: "Action is required" });
        }

        // 1. Polling Updates (getUpdates)
        if (action === 'getUpdates') {
            const offset = req.query.offset || (req.body && req.body.offset) || 0;
            const allowed = encodeURIComponent('["message", "edited_message", "message_reaction"]');
            const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&allowed_updates=${allowed}`;
            
            const response = await fetch(telegramUrl);
            const data = await response.json();

            if (data.ok && Array.isArray(data.result)) {
                // Security filter: strictly filter updates belonging to Yash's chat ID
                data.result = data.result.filter(update => {
                    const fromChatId = (update.message && update.message.chat && update.message.chat.id) ||
                                       (update.edited_message && update.edited_message.chat && update.edited_message.chat.id) ||
                                       (update.message_reaction && update.message_reaction.chat && update.message_reaction.chat.id);
                    return String(fromChatId) === String(CHAT_ID);
                });
            }
            return res.status(200).json(data);
        }

        // 2. Send Text Message
        if (action === 'sendMessage') {
            const { text, reply_to_message_id, parse_mode, disable_notification } = req.body || {};
            const payload = {
                chat_id: CHAT_ID,
                text: text || '',
                parse_mode: parse_mode,
                disable_notification: !!disable_notification
            };
            if (reply_to_message_id) {
                payload.reply_to_message_id = parseInt(reply_to_message_id);
            }

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // 3. Edit Message Text
        if (action === 'editMessageText') {
            const { message_id, text } = req.body || {};
            const payload = {
                chat_id: CHAT_ID,
                message_id: parseInt(message_id),
                text: text || ''
            };
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // 4. Set Message Reaction
        if (action === 'setMessageReaction') {
            const { message_id, reaction } = req.body || {};
            const payload = {
                chat_id: CHAT_ID,
                message_id: parseInt(message_id),
                reaction: reaction || [{ type: "emoji", emoji: "👀" }]
            };
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMessageReaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // 5. Send Chat Action (typing...)
        if (action === 'sendChatAction') {
            const { chatAction } = req.body || {};
            const payload = {
                chat_id: CHAT_ID,
                action: chatAction || 'typing'
            };
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // 6. Send Photo (supports Base64 Data URL or direct URL)
        if (action === 'sendPhoto') {
            const { photo, caption, reply_to_message_id } = req.body || {};
            if (!photo) {
                return res.status(400).json({ ok: false, error: "Photo data is required" });
            }

            // Direct URL
            if (typeof photo === 'string' && photo.startsWith('http')) {
                const payload = {
                    chat_id: CHAT_ID,
                    photo: photo,
                    caption: caption || ''
                };
                if (reply_to_message_id) payload.reply_to_message_id = parseInt(reply_to_message_id);
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                return res.status(200).json(data);
            }

            // Base64 Data URL
            const matches = photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            const mimeType = matches ? matches[1] : 'image/jpeg';
            const base64Data = matches ? matches[2] : photo;
            const buffer = Buffer.from(base64Data, 'base64');
            const blob = new Blob([buffer], { type: mimeType });

            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', blob, 'snap.jpg');
            if (caption) formData.append('caption', caption);
            if (reply_to_message_id) formData.append('reply_to_message_id', parseInt(reply_to_message_id));

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // 7. Send Voice Note (Base64 audio)
        if (action === 'sendVoice') {
            const { voice, caption, reply_to_message_id } = req.body || {};
            if (!voice) {
                return res.status(400).json({ ok: false, error: "Voice data is required" });
            }

            const matches = voice.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            const mimeType = matches ? matches[1] : 'audio/webm;codecs=opus';
            const base64Data = matches ? matches[2] : voice;
            const buffer = Buffer.from(base64Data, 'base64');
            const blob = new Blob([buffer], { type: mimeType });

            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('voice', blob, 'voice.oga');
            if (caption) formData.append('caption', caption);
            if (reply_to_message_id) formData.append('reply_to_message_id', parseInt(reply_to_message_id));

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        // 8. Send Animation / GIF
        if (action === 'sendAnimation') {
            const { animation, caption, reply_to_message_id } = req.body || {};
            const payload = {
                chat_id: CHAT_ID,
                animation: animation,
                caption: caption || ''
            };
            if (reply_to_message_id) payload.reply_to_message_id = parseInt(reply_to_message_id);

            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAnimation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return res.status(200).json(data);
        }

        return res.status(400).json({ ok: false, error: `Unsupported action: ${action}` });
    } catch (err) {
        console.error("API Telegram Error:", err);
        return res.status(500).json({ ok: false, error: err.message || "Internal server error" });
    }
};
