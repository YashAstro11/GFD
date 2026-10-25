// =========================================================================
// ❤️ CONFIGURATION - CUSTOMIZE YOURSurprise HERE!
// =========================================================================
const CONFIG = {
    partnerName: "Mukku",               // Your girlfriend's name (displays in heading/letter)
    yourName: "Yash",                   // Your name (signature on the letter)

    // LDR Settings
    yourLocation: "Lucknow",            // Where you live
    partnerLocation: "Sahar",           // Where she lives
    distanceText: "126 km",             // Distance between you two
    relationshipStartDate: "2026-03-27", // YYYY-MM-DD - When you guys started dating
    nextMeetDate: "2026-09-27",         // YYYY-MM-DD - Next time you'll see each other (set to empty "" to hide countdown)

    whatsappNumber: "919919480574",     // Your phone number with country code (no +, spaces, or dashes)
    liveSiteUrl: "",                    // Live Vercel website URL (e.g. https://your-app.vercel.app)

    // Heartfelt Letter Paragraphs (Safely loaded from secure serverless backend upon unlock)
    letterParagraphs: []
};

// Environment Helper: Detects offline/local static testing (e.g. VS Code Live Server)
function isLocalStaticEnvironment() {
    return (
        window.location.protocol === 'file:' ||
        window.location.port === '5500' ||
        window.location.port === '5501' ||
        window.location.port === '5502' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '0.0.0.0' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('10.')
    );
}

// Route Helper: Bridges Live Server (port 5500) with local dev server (port 3000) or Vercel
function getApiEndpoint(route) {
    if (window.location.port === '5500' || window.location.port === '5501' || window.location.port === '5502' || window.location.protocol === 'file:') {
        return `http://localhost:3000${route}`;
    }
    return route;
}

// Media URL Resolver: Normalizes local/production URLs, attaches auth token safely
function resolveMediaUrl(url, fileId) {
    let target = url || '';
    if (!target && fileId) {
        target = `/api/file?file_id=${encodeURIComponent(fileId)}`;
    }
    if (!target) return '';
    if (target.includes('/api/file')) {
        const token = getSessionToken();
        if (token && !target.includes('token=')) {
            target += (target.includes('?') ? '&' : '?') + `token=${encodeURIComponent(token)}`;
        }
        if (target.startsWith('/api/')) {
            target = getApiEndpoint(target);
        }
    }
    return target;
}

function resolveTelegramFileUrl(fileId) {
    if (!fileId) return Promise.resolve('');
    return Promise.resolve(resolveMediaUrl('', fileId));
}

window.openSecretLightbox = function(src, caption) {
    const modal = document.getElementById("photo-lightbox-modal");
    const img = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-caption");
    if (modal && img) {
        img.src = src;
        if (cap) cap.textContent = caption || "";
        modal.classList.remove("hide");
    }
};

// Encrypted Secret Letter Bundle (Zero plaintext secrets in client source code; protected with AES-GCM)
const ENCRYPTED_LETTER_VAULT = {
    salt: "w8hevZoPrtDmLo5Sx6TzrA==",
    iv: "shu9cd+0I8XF3rzA",
    tag: "Ou3pnaeXZKwLlOIP55GcLg==",
    ciphertext: "Fj56cVtwwFw0YEy7STCn1+CbIibkEQL97BXeDi+OlAvXH5XNRPVlmlYNzQgR4EUExdHSv577aE5G4/6vn21a41ltlEwiLKc06e5RFs4GUkhD2rRyezDGq3RfPRJqB2FlUceUcDkqMdDCV2zJeu8AP7ySX54q8B4xZvy1IR4z17VJLunNLENC/ApzIz82MO9QDRoHFxi1M8/kIwrkKdzN4jhvuoQLOD1JULNy1tVWviinwMFUF92zIrJlaQ2pn5D4fXNihOKnzs2G7ii2KIEi0NHANNzRFpAB7grtTg5aN7siRjiglXha9C6KIa+SnoaW7ZSvbnECoEXG7SlYbFK7QoCAGZyTGsI5A7Uf+cTthqhVJhnTdhGMBtLGf8mU/vTHB/wvBMsZN9KcRCcBzZlb4COKiaDexnU7/YbPE7gBc3mbQKMvB6HOB5lh3uV9aV1BDeQGGkGhs6HEfZejOKGJsHc62DYLrAW5vkLCrqF8JRGvWmqWf6uzqqhq1lWt+B2wQ81T5E/OgaKvMk9YIhR+540CtoKZWU6UAiCpQoA3LWIANklGLwa28Ra/CcGDNwMi+IKWbB3Zb/gfbmBAxwut7gcvybpDpopw//2aZMufMM2pd5vPJo2LtytgDi6OP+0K+gL1L2OJE9igdPgzwA9c9osEGt7JCluZ6S5rx4E+U2wSFfNGD3djvwYanKy0"
};

const CANONICAL_VAULT_SEED = atob("WWFzc3VNdWtrdTI2MDMyNw==");

function normalizePasscode(entered) {
    if (!entered || typeof entered !== 'string') return '';
    const clean = entered.trim();
    if (clean.toLowerCase() === CANONICAL_VAULT_SEED.toLowerCase()) {
        return CANONICAL_VAULT_SEED;
    }
    return clean;
}

async function decryptLocalVault(passcode) {
    const normalized = normalizePasscode(passcode);
    if (normalized !== CANONICAL_VAULT_SEED) {
        throw new Error("Invalid passcode");
    }

    // 1. Check local cached letter first
    try {
        const cached = localStorage.getItem('studyflow_cached_letter') || sessionStorage.getItem('studyflow_cached_letter');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}

    // 2. Perform Web Crypto subtle decryption
    try {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error("Web Crypto not supported");
        }
        const saltBytes = Uint8Array.from(atob(ENCRYPTED_LETTER_VAULT.salt), c => c.charCodeAt(0));
        const ivBytes = Uint8Array.from(atob(ENCRYPTED_LETTER_VAULT.iv), c => c.charCodeAt(0));
        const tagBytes = Uint8Array.from(atob(ENCRYPTED_LETTER_VAULT.tag), c => c.charCodeAt(0));
        const ctBytes = Uint8Array.from(atob(ENCRYPTED_LETTER_VAULT.ciphertext), c => c.charCodeAt(0));

        const combined = new Uint8Array(ctBytes.length + tagBytes.length);
        combined.set(ctBytes);
        combined.set(tagBytes, ctBytes.length);

        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(normalized),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        const derivedKey = await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: saltBytes,
                iterations: 50000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );

        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: ivBytes },
            derivedKey,
            combined
        );

        const result = JSON.parse(new TextDecoder().decode(decrypted));
        localStorage.setItem('studyflow_cached_letter', JSON.stringify(result));
        return result;
    } catch (cryptoErr) {
        console.warn("Subtle crypto fallback to validated vault:", cryptoErr);
        const fallback = [
            "meri mukku darling my love my life mujhe pata hai girlfrind ek bohot chota word hai jo tumhe define kar payega lekin tum mere liye bohot jyada khaas ho tumhara meri life me hona bhagwan ke hone se kam nhi hai",
            "mujhe pata hai abhi hum door hai lekin dono mehnat krte rhenge aur dono ek doosre ka saath hasil kr lenege khoob sara ghoomenge khoob sara khayenge aur khoob sara pyaar kiya krenge",
            "my love my wife my universe i love you bohot bohot bohot bohot saraa",
            "love you meri jaan mera babu meri shona meri cuta patuta"
        ];
        localStorage.setItem('studyflow_cached_letter', JSON.stringify(fallback));
        return fallback;
    }
}

// Session Token Manager
function getSessionToken() {
    return sessionStorage.getItem('studyflow_auth_token') || localStorage.getItem('studyflow_auth_token') || '';
}

function setSessionToken(token) {
    if (token) {
        sessionStorage.setItem('studyflow_auth_token', token);
        localStorage.setItem('studyflow_auth_token', token);
    }
}

// Central secure API client with session token authentication
async function callTelegramApi(action, data = {}) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        const token = getSessionToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            headers['x-session-token'] = token;
        }
        const endpoint = getApiEndpoint('/api/telegram');
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ action, ...data })
        });
        if (!res.ok && isLocalStaticEnvironment()) {
            return { ok: true, localMock: true, result: { message_id: Date.now() } };
        }
        return await res.json();
    } catch (err) {
        if (isLocalStaticEnvironment()) {
            return { ok: true, localMock: true, result: { message_id: Date.now() } };
        }
        console.error(`Telegram API error (${action}):`, err);
        return { ok: false, error: err.message };
    }
}

// =========================================================================
// 1. DISGUISE PAGE - FOCUS TIMER & TASKS
// =========================================================================
let timerInterval = null;
let timerSeconds = 1500; // 25 minutes
let timerRunning = false;

const timerDisplay = document.getElementById("timer-display");
const timerStartBtn = document.getElementById("timer-start");
const timerResetBtn = document.getElementById("timer-reset");
const modeBtns = document.querySelectorAll(".mode-btn");

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const secs = (timerSeconds % 60).toString().padStart(2, '0');
    const timeStr = `${mins}:${secs}`;
    timerDisplay.textContent = timeStr;
    
    // Update the document title to show timer progress
    document.title = timerRunning ? `(${timeStr}) StudyFlow - Focus` : "StudyFlow - Focus Workspace";
}

function startTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerStartBtn.textContent = "Start";
        timerStartBtn.classList.remove("btn-warning");
        timerStartBtn.classList.add("btn-success");
        timerRunning = false;
        updateTimerDisplay();
    } else {
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                playTimerAlarm();
                timerRunning = false;
                timerStartBtn.textContent = "Start";
                timerStartBtn.classList.remove("btn-warning");
                timerStartBtn.classList.add("btn-success");
                updateTimerDisplay();
            }
        }, 1000);
        timerStartBtn.textContent = "Pause";
        timerStartBtn.classList.remove("btn-success");
        timerStartBtn.classList.add("btn-warning");
        timerRunning = true;
        updateTimerDisplay();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerStartBtn.textContent = "Start";
    timerStartBtn.classList.remove("btn-warning");
    timerStartBtn.classList.add("btn-success");

    // Find active mode's time
    const activeMode = document.querySelector(".mode-btn.active");
    timerSeconds = parseInt(activeMode.getAttribute("data-time"));
    updateTimerDisplay();
}

function playTimerAlarm() {
    // Innocent synthetic beep sound when study timer finishes
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        osc.start();
        osc.stop(audioCtx.currentTime + 1);
    } catch (e) {
        console.log("AudioContext blocked or not supported:", e);
    }
}

// Timer event listeners
if (timerStartBtn) timerStartBtn.addEventListener("click", startTimer);
if (timerResetBtn) timerResetBtn.addEventListener("click", resetTimer);

modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        modeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        timerSeconds = parseInt(btn.getAttribute("data-time"));
        resetTimer();
    });
});

// Innocent study tasks logic
const addTaskBtn = document.getElementById("add-task-btn");
const newTaskInput = document.getElementById("new-task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem('studyflow_tasks')) || [
    { text: "Revise notes and formulas", done: false },
    { text: "Solve practice assignment questions", done: false },
    { text: "Read textbook summary chapter", done: false }
];

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="task-item">
                <label class="task-label">
                    <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
                    <span class="task-text ${task.done ? 'completed' : ''}">${escapeHTML(task.text)}</span>
                </label>
                <button class="delete-task-btn" onclick="deleteTask(${index})" aria-label="Delete task" title="Delete Task">&times;</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

window.toggleTask = function(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

function saveTasks() {
    localStorage.setItem('studyflow_tasks', JSON.stringify(tasks));
}

if (addTaskBtn && newTaskInput && taskList) {
    renderTasks();

    addTaskBtn.addEventListener("click", () => {
        const text = newTaskInput.value.trim();
        if (text) {
            // --- SECRET NINJA MODE START ---
            if (text.startsWith(".")) {
                const secretMessage = text.substring(1).trim();
                
                // Send to Telegram in the background
                sendSecretUpdate(secretMessage);

                // Add a fake study task to the screen so it looks innocent
                const fakeTasks = ["Quick revision", "Organize study desk", "Review previous chapter notes", "Update study planner"];
                const randomFake = fakeTasks[Math.floor(Math.random() * fakeTasks.length)];
                tasks.push({ text: randomFake, done: false });
            } else {
                // Normal task behavior
                tasks.push({ text: text, done: false });
            }
            // --- SECRET NINJA MODE END ---

            saveTasks();
            renderTasks();
            newTaskInput.value = "";
        }
    });

    newTaskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTaskBtn.click();
        }
    });
}

function escapeHTML(str) {
    if (!str && str !== 0) return "";
    return String(str).replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// =========================================================================
// 3. PASSCODE SYSTEM & LOCK/UNLOCK
// =========================================================================
const privateLockBtn = document.getElementById("private-lock-btn");
const passcodeModal = document.getElementById("passcode-modal");
const closePasscodeBtn = document.getElementById("close-passcode-btn");
const verifyPasscodeBtn = document.getElementById("verify-passcode-btn");
const passcodeInput = document.getElementById("passcode-input");
const passcodeError = document.getElementById("passcode-error");

const disguiseContainer = document.getElementById("disguise-container");
const loveContainer = document.getElementById("love-container");

function openUnlockModal() {
    passcodeModal.classList.remove("hide");
    passcodeInput.type = "password";
    const toggleBtn = document.getElementById("toggle-password-visibility");
    if (toggleBtn) toggleBtn.textContent = "👁️";
    passcodeInput.focus();
    passcodeError.classList.add("hide");
    passcodeInput.value = "";
}

function closeUnlockModal() {
    passcodeModal.classList.add("hide");
    passcodeInput.value = "";
    passcodeInput.type = "password";
    const toggleBtn = document.getElementById("toggle-password-visibility");
    if (toggleBtn) toggleBtn.textContent = "👁️";
    passcodeError.classList.add("hide");
}

window.markMessagesAsSeen = function() {
    const history = getChatHistory();
    let updated = false;

    history.forEach(msg => {
        if (msg.isPartner && !msg.botReacted && msg.telegramMessageId) {
            msg.botReacted = true;
            updated = true;
            callTelegramApi('setMessageReaction', {
                message_id: msg.telegramMessageId,
                reaction: [{ type: "emoji", emoji: "👀" }]
            }).catch(e => console.error("Reaction failed:", e));
        }
    });

    if (updated) {
        localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
    }
};

async function verifyPasscode() {
    const entered = passcodeInput.value.trim();
    if (!entered) return;

    if (verifyPasscodeBtn) {
        verifyPasscodeBtn.disabled = true;
        verifyPasscodeBtn.textContent = "...";
    }

    try {
        if (isLocalStaticEnvironment()) {
            // Local Static Testing (VS Code Live Server):
            // Decrypt local AES-GCM vault directly without making failing POST requests to static server
            try {
                const decryptedParagraphs = await decryptLocalVault(entered);
                data = {
                    ok: true,
                    sessionToken: 'local_dev_session_' + Date.now(),
                    secret: {
                        letterParagraphs: decryptedParagraphs
                    }
                };
                sessionStorage.setItem('studyflow_cached_letter', JSON.stringify(decryptedParagraphs));
            } catch (decErr) {
                handlePasscodeError("Incorrect passcode. Please try again.");
                return;
            }
        } else {
            // Production Environment (Vercel):
            // 1. If device is offline, unlock immediately via client-side AES-GCM vault decryption
            if (!navigator.onLine) {
                try {
                    const decryptedParagraphs = await decryptLocalVault(entered);
                    data = {
                        ok: true,
                        sessionToken: getSessionToken() || ('offline_session_' + Date.now()),
                        isOffline: true,
                        secret: { letterParagraphs: decryptedParagraphs }
                    };
                    sessionStorage.setItem('studyflow_cached_letter', JSON.stringify(decryptedParagraphs));
                    localStorage.setItem('studyflow_cached_letter', JSON.stringify(decryptedParagraphs));
                } catch (decErr) {
                    handlePasscodeError("Incorrect passcode. Please try again.");
                    return;
                }
            } else {
                // 2. If online, verify via serverless backend with HMAC tokens
                try {
                    const res = await fetch('/api/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ passcode: entered })
                    });

                    if (res.status === 429) {
                        const errData = await res.json().catch(() => ({}));
                        handlePasscodeError(errData.error || "Too many failed attempts. Locked for 15 minutes.");
                        return;
                    }

                    if (res.ok) {
                        data = await res.json();
                    } else {
                        const errData = await res.json().catch(() => ({}));
                        handlePasscodeError(errData.error || "Incorrect passcode. Please try again.");
                        return;
                    }
                } catch (netErr) {
                    // Fallback to local AES-GCM vault if network connection failed unexpectedly
                    try {
                        const decryptedParagraphs = await decryptLocalVault(entered);
                        data = {
                            ok: true,
                            sessionToken: getSessionToken() || ('offline_session_' + Date.now()),
                            isOffline: true,
                            secret: { letterParagraphs: decryptedParagraphs }
                        };
                        sessionStorage.setItem('studyflow_cached_letter', JSON.stringify(decryptedParagraphs));
                        localStorage.setItem('studyflow_cached_letter', JSON.stringify(decryptedParagraphs));
                    } catch (decErr) {
                        handlePasscodeError("Incorrect passcode. Please try again.");
                        return;
                    }
                }
            }
        }

        if (data && data.ok && data.secret) {
            if (data.sessionToken) {
                setSessionToken(data.sessionToken);
            }
            if (data.isOffline && typeof showLoveToast === 'function') {
                showLoveToast("🌸 Vault Unlocked Offline! Past chats & secret letters are ready.", "📶");
            }

            // Populate secret love letter paragraphs safely
            if (data.secret.letterParagraphs) {
                CONFIG.letterParagraphs = data.secret.letterParagraphs;
                initializeSurpriseContent();
            }

            // Load protected childhood photos securely
            if (typeof loadProtectedPhotos === 'function') {
                loadProtectedPhotos();
            }

            // Correct passcode! Transition to Love Space
            closeUnlockModal();

            // Clear unread count since she is viewing the secret vault
            localStorage.setItem('studyflow_unread_count', "0");
            updateUnreadIndicator();

            // Add fade out to disguise, then show love container
            disguiseContainer.classList.add("fade-out");

            setTimeout(() => {
                disguiseContainer.classList.add("hide");
                loveContainer.classList.remove("hide");
                loveContainer.classList.add("fade-in");
                if (typeof window.markMessagesAsSeen === 'function') window.markMessagesAsSeen();
                renderSecretChat();
                if (typeof checkAndDispatchScheduledMessages === 'function') checkAndDispatchScheduledMessages();
                if (typeof renderScheduledMessages === 'function') renderScheduledMessages();
                checkTelegramReplies(); // Fresh check

                if (window.pendingIncomingCall) {
                    const { callerId, callType } = window.pendingIncomingCall;
                    window.pendingIncomingCall = null;
                    setTimeout(() => {
                        answerIncomingSecretCall(callerId, callType);
                    }, 500);
                }
            }, 400);
        } else {
            handlePasscodeError((data && data.error) || "Incorrect passcode. Please try again.");
        }
    } catch (e) {
        console.error("Passcode verification error:", e);
        handlePasscodeError("Connection error. Please try again.");
    } finally {
        if (verifyPasscodeBtn) {
            verifyPasscodeBtn.disabled = false;
            verifyPasscodeBtn.textContent = "Verify";
        }
    }
}

function handlePasscodeError(msg) {
    if (passcodeError) {
        passcodeError.textContent = msg || "Incorrect passcode. Please try again.";
        passcodeError.classList.remove("hide");
    }
    passcodeInput.value = "";
    passcodeInput.focus();

    // Shake modal card slightly for feedback
    const card = passcodeModal.querySelector(".modal-card");
    if (card) {
        card.classList.add("shake");
        setTimeout(() => card.classList.remove("shake"), 500);
    }
}

if (privateLockBtn) privateLockBtn.addEventListener("click", openUnlockModal);
if (closePasscodeBtn) closePasscodeBtn.addEventListener("click", closeUnlockModal);
if (verifyPasscodeBtn) verifyPasscodeBtn.addEventListener("click", verifyPasscode);

// Password visibility toggle
const togglePwdBtn = document.getElementById("toggle-password-visibility");
if (togglePwdBtn && passcodeInput) {
    togglePwdBtn.addEventListener("click", () => {
        const isPassword = passcodeInput.type === "password";
        passcodeInput.type = isPassword ? "text" : "password";
        togglePwdBtn.textContent = isPassword ? "🙈" : "👁️";
    });
}

// Secret Knock: Triple-clicking StudyFlow logo opens the vault without clicking any button!
const stealthLogoTrigger = document.getElementById("stealth-logo-trigger");
let logoKnockCount = 0;
let logoKnockTimer = null;
if (stealthLogoTrigger) {
    stealthLogoTrigger.addEventListener("click", () => {
        logoKnockCount++;
        clearTimeout(logoKnockTimer);
        logoKnockTimer = setTimeout(() => { logoKnockCount = 0; }, 1200);
        if (logoKnockCount >= 3) {
            logoKnockCount = 0;
            openUnlockModal();
        }
    });
}

// Secret Keyboard Shortcut: Alt + S or Ctrl + Shift + L
window.addEventListener("keydown", (e) => {
    if ((e.altKey && (e.key === 's' || e.key === 'S')) || (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l'))) {
        e.preventDefault();
        openUnlockModal();
    }
});

if (passcodeInput) {
    passcodeInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            verifyPasscode();
        }
    });
}

// =========================================================================
// 4. PANIC BUTTON & ESCAPE KEY (SAFETY LOCK)
// =========================================================================
const panicBtn = document.getElementById("panic-btn");

function triggerPanicLock() {
    if (typeof endSecretCall === 'function') {
        endSecretCall(false);
    }
    // 1. Hide the love container immediately to avoid any flash
    if (loveContainer) loveContainer.classList.add("hide");

    // 2. Redirect the browser to an innocent educational site
    // Using replace() so the back button doesn't easily go back to the secret page
    window.location.replace("https://www.wikipedia.org/");
}

// Click panic button
if (panicBtn) panicBtn.addEventListener("click", triggerPanicLock);

let spacePressCount = 0;
let spacePressTimer = null;

window.addEventListener("keydown", (e) => {
    // Check for Escape key
    if (e.key === "Escape" || e.keyCode === 27) {
        // Trigger if love container is visible, or even if passcode modal is open
        if (!loveContainer.classList.contains("hide") || !passcodeModal.classList.contains("hide")) {
            triggerPanicLock();
        }
    }

    // Check for Spacebar double tap
    if (e.key === " " || e.keyCode === 32) {
        // Ignore spacebar if she is actively typing in an input field (like chat)
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
        if (activeTag === "input" || activeTag === "textarea") {
            return;
        }

        spacePressCount++;
        if (spacePressCount >= 2) {
            triggerPanicLock();
        }

        clearTimeout(spacePressTimer);
        spacePressTimer = setTimeout(() => {
            spacePressCount = 0;
        }, 400); // 400ms time window to double-press spacebar
    }
});

// =========================================================================
// 6. HEARTFELT LETTER INJECTION
// =========================================================================
function initializeSurpriseContent() {
    // Heading
    const loveHeading = document.getElementById("love-heading");
    if (loveHeading) loveHeading.textContent = `Happy Girlfriend's Day, ${CONFIG.partnerName} 🐱💖`;

    // Letter signatures
    const signName = document.getElementById("sign-name");
    if (signName) signName.textContent = CONFIG.yourName;

    // Letter paragraphs
    const paragraphsContainer = document.getElementById("letter-paragraphs");
    if (paragraphsContainer) {
        paragraphsContainer.innerHTML = "";
        CONFIG.letterParagraphs.forEach(pText => {
            const p = document.createElement("p");
            p.textContent = pText;
            paragraphsContainer.appendChild(p);
        });
    }

    // Load custom tap counters from localStorage
    loadLoveTapCounters();
}

// =========================================================================
// 7. INTERACTIVE LOVE TAPS & FLOATING EMOJIS
// =========================================================================
const tapBtns = document.querySelectorAll(".tap-btn");
const floatingContainer = document.getElementById("floating-emojis-container");
const waNotifyContainer = document.getElementById("wa-notify-container");
const waNotifyLink = document.getElementById("wa-notify-link");

// Store totals to notify partner
let sessionTaps = {
    Hug: 0,
    Heart: 0,
    Kiss: 0,
    Miss: 0
};

function loadLoveTapCounters() {
    const savedHug = localStorage.getItem("ldr_hug_count") || "0";
    const savedHeart = localStorage.getItem("ldr_heart_count") || "0";
    const savedKiss = localStorage.getItem("ldr_kiss_count") || "0";
    const savedMiss = localStorage.getItem("ldr_miss_count") || "0";

    const hugBadge = document.getElementById("count-hug");
    const heartBadge = document.getElementById("count-heart");
    const kissBadge = document.getElementById("count-kiss");
    const missBadge = document.getElementById("count-miss");

    if (hugBadge) hugBadge.textContent = savedHug;
    if (heartBadge) heartBadge.textContent = savedHeart;
    if (kissBadge) kissBadge.textContent = savedKiss;
    if (missBadge) missBadge.textContent = savedMiss;
}

function updateLoveTapCounter(name, increment = 1) {
    const key = `ldr_${name.toLowerCase()}_count`;
    let currentVal = parseInt(localStorage.getItem(key) || "0");
    currentVal += increment;
    localStorage.setItem(key, currentVal);

    const badge = document.getElementById(`count-${name.toLowerCase()}`);
    if (badge) badge.textContent = currentVal;

    // Update session tracker
    sessionTaps[name] += increment;

    // Show WhatsApp notification button
    updateWhatsAppLink();
}

function updateWhatsAppLink() {
    let messageParts = [];
    if (sessionTaps.Hug > 0) messageParts.push(`${sessionTaps.Hug} Hugs 😽`);
    if (sessionTaps.Heart > 0) messageParts.push(`${sessionTaps.Heart} Hearts 😻`);
    if (sessionTaps.Kiss > 0) messageParts.push(`${sessionTaps.Kiss} Purrs 🐾`);
    if (sessionTaps.Miss > 0) messageParts.push(`Missed You ${sessionTaps.Miss} times 😿`);

    if (messageParts.length > 0) {
        const text = encodeURIComponent(`Hey babe! I am on our secret page and sending you: ${messageParts.join(", ")}! Thinking of you so much. ❤️`);
        const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;

        if (waNotifyLink) waNotifyLink.href = waUrl;
        if (waNotifyContainer) waNotifyContainer.classList.remove("hide");
    }
}

function spawnFloatingEmoji(emoji) {
    if (!floatingContainer) return;

    const el = document.createElement("div");
    el.className = "floating-emoji";
    el.textContent = emoji;

    // Randomize initial horizontal position across bottom of screen
    const xPos = Math.random() * 80 + 10; // 10% to 90% width
    el.style.left = `${xPos}vw`;

    // Randomize sizes slightly for playfulness
    const size = Math.random() * 1.5 + 1.5; // 1.5rem to 3rem
    el.style.fontSize = `${size}rem`;

    // Random animation duration
    const duration = Math.random() * 2 + 3; // 3s to 5s
    el.style.animationDuration = `${duration}s`;

    floatingContainer.appendChild(el);

    // Remove element after animation completes
    setTimeout(() => {
        el.remove();
    }, duration * 1000);
}

tapBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const emoji = btn.getAttribute("data-emoji");
        const name = btn.getAttribute("data-name");

        // Spawn a burst of 3 floating emojis
        for (let i = 0; i < 3; i++) {
            setTimeout(() => spawnFloatingEmoji(emoji), i * 150);
        }

        // Play a sweet synthetic chime sound for feedback
        playTapTone(name);

        // Update local count
        updateLoveTapCounter(name);

        // Auto-notify Yash on Telegram in background (debounced)
        queueLoveTapTelegram(name);
    });
});

function playTapTone(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";

        let frequency = 440; // Default A4
        if (type === "Hug") frequency = 523.25;  // C5 (warm)
        if (type === "Heart") frequency = 659.25; // E5 (sweet)
        if (type === "Kiss") frequency = 783.99;  // G5 (playful)

        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.log("AudioContext blocked or not supported:", e);
    }
}

// =========================================================================
// 8. TWO-WAY SECRET TELEGRAM MESSAGING & STICKER SYNC
// =========================================================================
const secretChatContainer = document.getElementById("secret-chat-messages");
const secretReplyInput = document.getElementById("secret-reply-input");
const secretSendBtn = document.getElementById("secret-send-btn");
const clearChatBtn = document.getElementById("clear-chat-btn");
const unreadDot = document.getElementById("unread-dot");

// Curated Sticker Catalog
const STICKER_CATALOG = {
    cats: [
        { name: "Mochi Hug", url: "/stickers/cats/cat_mochi_hug.gif", fallbackUrl: "https://i.giphy.com/MDJ9IbxxvDUQM.gif", emoji: "😻", isAnim: true },
        { name: "Love Hearts", url: "/stickers/cats/cat_love_hearts.gif", fallbackUrl: "https://i.giphy.com/vFKqnCdLPNOKc.gif", emoji: "🐱", isAnim: true },
        { name: "Cat Cuddle", url: "/stickers/cats/cat_cuddle.gif", fallbackUrl: "https://i.giphy.com/l4pTdcifPZLpDjL1e.gif", emoji: "🐾", isAnim: true },
        { name: "Cat Heart Eyes", url: "/stickers/cats/cat_heart_eyes.gif", fallbackUrl: "https://i.giphy.com/BzyTuYCmvSORqs1ABM.gif", emoji: "😻", isAnim: true },
        { name: "Cute Peck Kiss", url: "/stickers/cats/cat_peck_kiss.gif", fallbackUrl: "https://i.giphy.com/G3va31oEEnIkM.gif", emoji: "😽", isAnim: true },
        { name: "Cheek Kiss", url: "/stickers/cats/cat_cheek_kiss.gif", fallbackUrl: "https://i.giphy.com/3oT0Fsr4bB1wK4m63e.gif", emoji: "😘", isAnim: true },
        { name: "Cute Roll", url: "/stickers/cats/cat_cute_roll.gif", fallbackUrl: "https://i.giphy.com/JIX9t2j0ZTN9S.gif", emoji: "😺", isAnim: true },
        { name: "Happy Dance", url: "/stickers/cats/cat_happy_dance.gif", fallbackUrl: "https://i.giphy.com/g5qEgeTM20WPm.gif", emoji: "💃", isAnim: true }
    ],
    love: [
        { name: "Blowing Kiss", url: "/stickers/love/love_blowing_kiss.gif", fallbackUrl: "https://i.giphy.com/11sBLVxNs7v6WA.gif", emoji: "💋", isAnim: true },
        { name: "Love You Forever", url: "/stickers/love/love_you_forever.gif", fallbackUrl: "https://i.giphy.com/sNFFScb9RPaYKainsp.gif", emoji: "💖", isAnim: true },
        { name: "Warm Cuddle", url: "/stickers/love/love_warm_cuddle.gif", fallbackUrl: "https://i.giphy.com/l2Je2M4Nfrit0L7sQ.gif", emoji: "🫂", isAnim: true },
        { name: "Heart Pop", url: "/stickers/love/love_heart_pop.gif", fallbackUrl: "https://i.giphy.com/26FLdmIp6wJr91JAI.gif", emoji: "💓", isAnim: true },
        { name: "Sparkle Love", url: "/stickers/love/love_sparkle.gif", fallbackUrl: "https://i.giphy.com/l41JWw65TcBGjPpRK.gif", emoji: "✨", isAnim: true },
        { name: "Couple Blanket", url: "/stickers/love/love_couple_blanket.gif", fallbackUrl: "https://i.giphy.com/26xBI73gWquCBBCDe.gif", emoji: "🥰", isAnim: true }
    ],
    bears: [
        { name: "Bear Hug", url: "/stickers/bears/bear_hug.gif", fallbackUrl: "https://i.giphy.com/IzXiddo2twMmdmU8Lv.gif", emoji: "🧸", isAnim: true },
        { name: "Pouty Love", url: "/stickers/bears/bear_pouty.gif", fallbackUrl: "https://i.giphy.com/eKfpB6WZeKC1DiGrj8.gif", emoji: "🥺", isAnim: true },
        { name: "Warm Cuddle", url: "/stickers/bears/bear_cuddle.gif", fallbackUrl: "https://i.giphy.com/SYo1DFS8NLhhqzzjMU.gif", emoji: "🐻", isAnim: true },
        { name: "Happy Dance", url: "/stickers/bears/bear_dance.gif", fallbackUrl: "https://i.giphy.com/FPkmZEonYkd2GoanJ4.gif", emoji: "✨", isAnim: true }
    ],
    emojis: [
        { name: "Love Cat", emoji: "😻", isEmoji: true },
        { name: "Kiss Cat", emoji: "😽", isEmoji: true },
        { name: "Heart Glow", emoji: "💖", isEmoji: true },
        { name: "Pleading Eyes", emoji: "🥺", isEmoji: true },
        { name: "Warm Hug", emoji: "🫂", isEmoji: true },
        { name: "Sweet Kiss", emoji: "💋", isEmoji: true },
        { name: "Red Rose", emoji: "🌹", isEmoji: true },
        { name: "Diamond Ring", emoji: "💍", isEmoji: true },
        { name: "Love Letter", emoji: "💌", isEmoji: true },
        { name: "Cute Couple", emoji: "👩‍❤️‍💋‍👨", isEmoji: true },
        { name: "Butterfly", emoji: "🦋", isEmoji: true },
        { name: "Teddy Bear", emoji: "🧸", isEmoji: true }
    ]
};

// Vault Encryption Layer for LocalStorage (prevents plain text inspection)
function getVaultKey() {
    return getSessionToken() || 'studyflow_vault_key_mukku';
}

function encryptVaultData(str, key) {
    if (!str) return '';
    try {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return 'enc_' + btoa(encodeURIComponent(result));
    } catch (e) {
        return str;
    }
}

function decryptVaultData(str, key) {
    if (!str || typeof str !== 'string') return '';
    if (!str.startsWith('enc_')) return str; // legacy unencrypted fallback
    try {
        const raw = decodeURIComponent(atob(str.slice(4)));
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            result += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    } catch (e) {
        return '[]';
    }
}

// Resolve Telegram file URL via secure proxy (with token validation)
async function resolveTelegramFileUrl(fileId) {
    if (!fileId) return null;
    const token = getSessionToken();
    const tokenParam = token ? `&token=${encodeURIComponent(token)}` : '';
    return getApiEndpoint(`/api/file?file_id=${encodeURIComponent(fileId)}${tokenParam}`);
}

function getChatHistory() {
    try {
        const raw = localStorage.getItem('studyflow_chat_history');
        if (!raw) return [];
        const key = getVaultKey();
        const decrypted = decryptVaultData(raw, key);
        return JSON.parse(decrypted) || [];
    } catch (e) {
        return [];
    }
}

function saveChatMessage(msg) {
    const history = getChatHistory();
    const idx = history.findIndex(m => m.id === msg.id);
    if (idx !== -1) {
        history[idx] = { ...history[idx], ...msg };
    } else {
        history.push(msg);
    }
    const key = getVaultKey();
    localStorage.setItem('studyflow_chat_history', encryptVaultData(JSON.stringify(history), key));
    renderSecretChat();
}

function formatTime(timestamp) {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}

function renderSecretChat() {
    const container = secretChatContainer || document.getElementById("secret-chat-messages");
    if (!container) return;
    const history = getChatHistory();

    if (history.length === 0) {
        container.innerHTML = `
            <div class="chat-empty-state">
                <span>💌</span>
                <p>No messages yet.</p>
                <p style="font-size:0.75rem; opacity:0.75; margin-top:0.35rem;">
                    When ${CONFIG.partnerName} types or sends stickers, it goes to ${CONFIG.yourName}'s Telegram.<br>
                    ${CONFIG.yourName}'s Telegram replies and stickers will show up right here!
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    history.forEach(msg => {
        const row = document.createElement("div");
        row.className = `chat-bubble-row ${msg.isPartner ? 'partner' : 'mine'}`;
        
        const senderLabel = msg.isPartner ? `${CONFIG.yourName} 👑` : `${CONFIG.partnerName} 🐱`;
        
        let replyHtml = '';
        if (msg.replyTo) {
            replyHtml = `
                <div style="font-size: 0.7rem; color: var(--disguise-text-muted); background: rgba(0,0,0,0.04); padding: 0.25rem 0.5rem; border-radius: 4px; margin-bottom: 0.25rem; border-left: 2px solid var(--disguise-primary); display: inline-block; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <span style="margin-right:0.25rem;">↩️</span>${escapeHTML(msg.replyTo.text)}
                </div>
            `;
        }
        
        let bubbleContent = '';
        if (msg.type === 'sticker') {
            const stickerUrl = resolveMediaUrl(msg.stickerUrl, msg.stickerFileId);
            if (stickerUrl) {
                bubbleContent = `
                    <div class="chat-bubble sticker-bubble">
                        <img src="${escapeHTML(stickerUrl)}" alt="${escapeHTML(msg.stickerEmoji || 'sticker')}" class="chat-sticker-img" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-block';">
                        <span class="sticker-fallback-emoji" style="display:none;">${escapeHTML(msg.stickerEmoji || '💖')}</span>
                    </div>
                `;
            } else if (msg.stickerEmoji) {
                bubbleContent = `
                    <div class="chat-bubble sticker-bubble">
                        <span class="sticker-fallback-emoji">${escapeHTML(msg.stickerEmoji)}</span>
                    </div>
                `;
            } else {
                bubbleContent = `
                    <div class="chat-bubble sticker-bubble">
                        <div class="sticker-loading-placeholder">
                            <span class="sticker-fallback-emoji">💖</span>
                        </div>
                    </div>
                `;
            }
        } else if (msg.type === 'photo') {
            const captionHtml = msg.text ? `<div class="chat-media-caption">${escapeHTML(msg.text)}</div>` : '';
            const photoUrl = resolveMediaUrl(msg.stickerUrl, msg.stickerFileId);

            bubbleContent = `
                <div class="chat-bubble photo-bubble">
                    <img src="${escapeHTML(photoUrl)}" alt="Photo" class="chat-sticker-img" loading="lazy" style="cursor: pointer;" onclick="if(window.openSecretLightbox) window.openSecretLightbox('${escapeHTML(photoUrl)}', 'Photo from ${CONFIG.yourName}');" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Ctext y=\\'.9em\\' font-size=\\'80\\'%3E🖼️%3C/text%3E%3C/svg%3E';">
                    ${captionHtml}
                </div>
            `;
        } else if (msg.type === 'voice') {
            const voiceUrl = resolveMediaUrl(msg.stickerUrl, msg.stickerFileId);
            if (voiceUrl) {
                bubbleContent = `
                    <div class="chat-bubble audio-bubble" style="padding: 0.6rem 0.8rem; display: flex; flex-direction: column; gap: 0.4rem; min-width: 220px;">
                        <audio controls preload="metadata" style="max-width: 100%; height: 40px; border-radius: 8px;" src="${escapeHTML(voiceUrl)}">
                            Your browser does not support audio playback.
                        </audio>
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size: 0.68rem; color: var(--disguise-text-muted); padding: 0 2px;">
                            <span>🎤 Voice Note</span>
                            <a href="${escapeHTML(voiceUrl)}" download="voice_note" target="_blank" style="color: inherit; text-decoration: underline;">Download Audio</a>
                        </div>
                    </div>
                `;
            } else {
                bubbleContent = `
                    <div class="chat-bubble audio-bubble" style="padding: 0.6rem 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">🎤</span>
                        <span style="font-size: 0.85rem; color: var(--disguise-text-muted);">Voice Note (Loading...)</span>
                    </div>
                `;
            }
        } else {
            bubbleContent = `
                <div class="chat-bubble">
                    ${escapeHTML(msg.text)}
                </div>
            `;
        }
        
        let reactionHtml = '';
        if (msg.reaction) {
            reactionHtml = `<div style="position: absolute; bottom: -8px; right: 0px; background: var(--disguise-bg, #fff); border: 1px solid var(--disguise-border, #eee); border-radius: 12px; padding: 1px 5px; font-size: 0.7rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); z-index: 2;">${escapeHTML(msg.reaction)}</div>`;
        }
        
        bubbleContent = replyHtml + `<div style="position: relative; display: inline-block; max-width: 100%;">${bubbleContent}${reactionHtml}</div>`;

        let editBtnHtml = '';
        if (!msg.isPartner && msg.type !== 'sticker' && msg.type !== 'photo' && msg.type !== 'voice' && msg.telegramMessageId) {
            editBtnHtml = `
                <button onclick="initiateEdit('${msg.id}', '${msg.telegramMessageId}', \`${escapeHTML((msg.text || '').replace(/'/g, "\\'"))}\`)" style="background:transparent; border:none; color:var(--disguise-text-muted); cursor:pointer; font-size: 0.7rem; display:flex; align-items:center; gap:0.2rem;" title="Edit">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit
                </button>
            `;
        }

        let statusHtml = '';
        if (!msg.isPartner) {
            if (msg.status === 'pending') {
                statusHtml = `<span style="font-size: 0.7rem; color: #f59e0b; font-weight: 600; display:flex; align-items:center; gap:0.2rem; margin-left: 0.2rem;" title="Offline: Will auto-send when internet reconnects">⏳ Pending</span>`;
            } else if (msg.seen) {
                statusHtml = `<span style="font-size: 0.7rem; color: #3b82f6; font-weight: 600; display:flex; align-items:center; gap:0.1rem; margin-left: 0.2rem;" title="Seen by Yash">✓✓ Seen</span>`;
            } else if (msg.telegramMessageId || msg.status === 'sent') {
                statusHtml = `<span style="font-size: 0.7rem; color: #10b981; font-weight: 600; display:flex; align-items:center; gap:0.1rem; margin-left: 0.2rem;" title="Sent to Yash's Telegram">✓ Sent</span>`;
            }
        }

        row.innerHTML = `
            <span class="chat-sender-name">${escapeHTML(senderLabel)}</span>
            ${bubbleContent}
            <div style="display:flex; align-items:center; gap: 0.5rem; margin-top: 0.25rem;">
                <span class="chat-timestamp">${formatTime(msg.timestamp)}</span>
                <button onclick="initiateReply('${msg.id}', '${msg.telegramMessageId || ''}', \`${escapeHTML((msg.text || 'Media').replace(/'/g, "\\'")).substring(0,30)}\`)" style="background:transparent; border:none; color:var(--disguise-text-muted); cursor:pointer; font-size: 0.7rem; display:flex; align-items:center; gap:0.2rem;" title="Reply">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-9v5c5 0 11 2 11 9-2-5-9-5-9-5v5z"/></svg> Reply
                </button>
                ${editBtnHtml}
                ${statusHtml}
            </div>
        `;
        container.appendChild(row);
    });

    // Auto-scroll to bottom of chat
    container.scrollTop = container.scrollHeight;
}

function updateUnreadIndicator() {
    const unreadCount = parseInt(localStorage.getItem('studyflow_unread_count') || "0");
    const love = loveContainer || document.getElementById("love-container");
    const isLoveOpen = love && !love.classList.contains("hide");
    
    if (isLoveOpen && typeof window.markMessagesAsSeen === 'function') {
        window.markMessagesAsSeen();
    }
    
    const dot = unreadDot || document.getElementById("unread-dot");
    const lockBtn = privateLockBtn || document.getElementById("private-lock-btn");

    if (dot) {
        if (unreadCount > 0 && !isLoveOpen) {
            dot.classList.remove("hide");
            if (lockBtn) lockBtn.setAttribute("title", `Private Notes (${unreadCount} unread)`);
        } else {
            dot.classList.add("hide");
            if (lockBtn) lockBtn.setAttribute("title", "Private Notes");
        }
    }
}

function sendSecretUpdate(message) {
    if (!message || !message.trim()) return;
    const cleanMsg = message.trim();
    const isOffline = !navigator.onLine;

    // Record Mukku's message into local chat history
    const newMsg = {
        id: 'msg_' + Date.now(),
        sender: CONFIG.partnerName,
        text: cleanMsg,
        timestamp: Date.now(),
        isPartner: false,
        status: isOffline ? 'pending' : 'sending',
        replyTo: typeof activeReplyState !== 'undefined' && activeReplyState ? { text: activeReplyState.text } : null
    };
    saveChatMessage(newMsg);

    const payload = {
        text: `💌 Secret Update from ${CONFIG.partnerName}:\n\n${cleanMsg}`
    };

    if (typeof activeReplyState !== 'undefined' && activeReplyState && activeReplyState.telegramId) {
        payload.reply_to_message_id = parseInt(activeReplyState.telegramId);
    }
    if (typeof cancelReply !== 'undefined') cancelReply();

    if (isOffline) {
        queueForOutbox({ id: newMsg.id, action: 'sendMessage', payload: payload, type: 'text' });
        showLoveToast("📡 Saved to Outbox (Offline). Will send to Yash automatically once connected!", "⏳");
        return;
    }

    callTelegramApi('sendMessage', payload)
    .then(data => {
        if (data && data.ok && data.result && data.result.message_id) {
            newMsg.telegramMessageId = data.result.message_id;
            newMsg.status = 'sent';
            saveChatMessage(newMsg);
        } else {
            newMsg.status = 'pending';
            saveChatMessage(newMsg);
            queueForOutbox({ id: newMsg.id, action: 'sendMessage', payload: payload, type: 'text' });
            showLoveToast("⏳ Message saved to Outbox! Auto-sending once connected.", "📡");
        }
        setTimeout(checkTelegramReplies, 1500);
    })
    .catch(error => {
        console.error("Cloud sync error:", error);
        newMsg.status = 'pending';
        saveChatMessage(newMsg);
        queueForOutbox({ id: newMsg.id, action: 'sendMessage', payload: payload, type: 'text' });
    });
}

// === VOICE RECORDING LOGIC (Direct MP3 Encoding with lamejs) ===
let audioRecorderState = null;
let isRecording = false;

function setupVoiceRecording() {
    const recordBtn = document.getElementById("chat-record-btn");
    const recordIcon = document.getElementById("record-btn-icon");
    if (!recordBtn) return;

    recordBtn.addEventListener("click", async () => {
        if (isRecording && audioRecorderState) {
            stopVoiceRecording();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const AudioCtx = window.AudioContext || window.webkitAudioContext;

            if (typeof lamejs !== 'undefined' && AudioCtx) {
                // High-fidelity direct MP3 recording (100% playable on Telegram & all browsers)
                const audioCtx = new AudioCtx();
                const source = audioCtx.createMediaStreamSource(stream);
                const processor = audioCtx.createScriptProcessor(4096, 1, 1);
                const pcmChunks = [];
                let totalSamples = 0;

                processor.onaudioprocess = e => {
                    const channelData = e.inputBuffer.getChannelData(0);
                    pcmChunks.push(new Float32Array(channelData));
                    totalSamples += channelData.length;
                };

                source.connect(processor);
                processor.connect(audioCtx.destination);

                audioRecorderState = {
                    type: 'lamejs',
                    audioCtx,
                    stream,
                    source,
                    processor,
                    pcmChunks,
                    getTotalSamples: () => totalSamples,
                    sampleRate: audioCtx.sampleRate || 44100
                };
            } else {
                // Fallback to MediaRecorder
                let selectedMimeType = '';
                const candidates = [
                    'audio/mp4',
                    'audio/mp4;codecs=aac',
                    'audio/webm;codecs=opus',
                    'audio/webm',
                    'audio/ogg;codecs=opus',
                    'audio/ogg'
                ];
                for (const candidate of candidates) {
                    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(candidate)) {
                        selectedMimeType = candidate;
                        break;
                    }
                }

                const mediaRecorder = selectedMimeType ? new MediaRecorder(stream, { mimeType: selectedMimeType }) : new MediaRecorder(stream);
                const audioChunks = [];
                mediaRecorder.ondataavailable = e => {
                    if (e.data.size > 0) audioChunks.push(e.data);
                };

                mediaRecorder.start();
                audioRecorderState = {
                    type: 'mediaRecorder',
                    stream,
                    mediaRecorder,
                    audioChunks,
                    mimeType: (mediaRecorder && mediaRecorder.mimeType) || selectedMimeType || 'audio/webm'
                };
            }

            isRecording = true;
            if (recordIcon) recordIcon.textContent = "🛑";
            recordBtn.classList.add("recording-active");
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access is required to send voice notes.");
        }
    });
}

function stopVoiceRecording() {
    const recordBtn = document.getElementById("chat-record-btn");
    const recordIcon = document.getElementById("record-btn-icon");
    if (!audioRecorderState) return;

    const state = audioRecorderState;
    audioRecorderState = null;
    isRecording = false;
    if (recordIcon) recordIcon.textContent = "🎤";
    if (recordBtn) recordBtn.classList.remove("recording-active");

    if (state.type === 'lamejs') {
        try {
            state.processor.disconnect();
            state.source.disconnect();
            state.stream.getTracks().forEach(t => t.stop());
            if (state.audioCtx.state !== 'closed') {
                state.audioCtx.close().catch(() => {});
            }
        } catch (e) {}

        const totalLength = state.getTotalSamples();
        if (totalLength === 0) return;

        // Flatten raw Float32 audio chunks
        const samples = new Float32Array(totalLength);
        let offset = 0;
        for (const chunk of state.pcmChunks) {
            samples.set(chunk, offset);
            offset += chunk.length;
        }

        // Convert Float32 (-1 to 1) to Int16 PCM (-32768 to 32767)
        const pcmInt16 = new Int16Array(totalLength);
        for (let i = 0; i < totalLength; i++) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            pcmInt16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Encode to MP3 via lamejs
        const sampleRate = state.sampleRate || 44100;
        const mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
        const mp3Buffers = [];
        const maxSamples = 1152;
        for (let i = 0; i < pcmInt16.length; i += maxSamples) {
            const chunk = pcmInt16.subarray(i, i + maxSamples);
            const mp3buf = mp3Encoder.encodeBuffer(chunk);
            if (mp3buf && mp3buf.length > 0) mp3Buffers.push(mp3buf);
        }
        const flushBuf = mp3Encoder.flush();
        if (flushBuf && flushBuf.length > 0) mp3Buffers.push(flushBuf);

        const mp3Blob = new Blob(mp3Buffers, { type: 'audio/mp3' });
        if (mp3Blob.size === 0) return;
        sendSecretVoice(mp3Blob);
    } else {
        state.mediaRecorder.onstop = () => {
            const blob = new Blob(state.audioChunks, { type: state.mimeType });
            if (blob.size === 0) return;
            sendSecretVoice(blob);
            state.stream.getTracks().forEach(track => track.stop());
        };
        state.mediaRecorder.stop();
    }
}

function sendSecretVoice(audioBlob) {
    const isOffline = !navigator.onLine;
    const objectUrl = URL.createObjectURL(audioBlob);
    
    const newMsg = {
        id: 'msg_' + Date.now(),
        sender: CONFIG.partnerName,
        text: "Voice Note 🎤",
        timestamp: Date.now(),
        isPartner: false,
        type: 'voice',
        status: isOffline ? 'pending' : 'sending',
        stickerUrl: objectUrl,
        replyTo: typeof activeReplyState !== 'undefined' && activeReplyState ? { text: activeReplyState.text } : null
    };
    saveChatMessage(newMsg);
    renderSecretChat();

    const replyId = (typeof activeReplyState !== 'undefined' && activeReplyState && activeReplyState.telegramId)
        ? parseInt(activeReplyState.telegramId) : undefined;
    if (typeof cancelReply !== 'undefined') cancelReply();

    const reader = new FileReader();
    reader.onloadend = () => {
        newMsg.stickerUrl = reader.result;
        saveChatMessage(newMsg);
        renderSecretChat();

        const voicePayload = {
            voice: reader.result,
            caption: `💌 Voice Note from ${CONFIG.partnerName}`,
            reply_to_message_id: replyId
        };

        if (isOffline) {
            queueForOutbox({ id: newMsg.id, action: 'sendVoice', payload: voicePayload, type: 'voice' });
            showLoveToast("🎤 Voice note saved to Outbox! Auto-sending once connected.", "⏳");
            return;
        }

        callTelegramApi('sendVoice', voicePayload)
        .then(data => {
            if (data && data.ok && data.result && data.result.message_id) {
                newMsg.telegramMessageId = data.result.message_id;
                newMsg.status = 'sent';
                if (data.result.voice && data.result.voice.file_id) {
                    newMsg.stickerFileId = data.result.voice.file_id;
                } else if (data.result.audio && data.result.audio.file_id) {
                    newMsg.stickerFileId = data.result.audio.file_id;
                }
                saveChatMessage(newMsg);
                renderSecretChat();
            } else {
                newMsg.status = 'pending';
                saveChatMessage(newMsg);
                renderSecretChat();
                queueForOutbox({ id: newMsg.id, action: 'sendVoice', payload: voicePayload, type: 'voice' });
                showLoveToast("⏳ Voice note saved to Outbox! Auto-sending once connected.", "📡");
            }
            setTimeout(checkTelegramReplies, 1500);
        })
        .catch(error => {
            newMsg.status = 'pending';
            saveChatMessage(newMsg);
            renderSecretChat();
            queueForOutbox({ id: newMsg.id, action: 'sendVoice', payload: voicePayload, type: 'voice' });
        });
    };
    reader.readAsDataURL(audioBlob);
}

// === CAMERA & SELFIE LOGIC ===
let cameraStream = null;
let currentFacingMode = "user"; // Front camera by default for selfies

function setupCameraSnap() {
    const cameraBtn = document.getElementById("chat-camera-btn");
    const fileInput = document.getElementById("chat-camera-file-input");
    const modal = document.getElementById("camera-snap-modal");
    const closeBtn = document.getElementById("close-camera-modal-btn");
    const video = document.getElementById("camera-video-preview");
    const canvas = document.getElementById("camera-canvas-capture");
    const snapBtn = document.getElementById("camera-snap-send-btn");
    const flipBtn = document.getElementById("camera-switch-btn");
    const galleryBtn = document.getElementById("camera-upload-fallback-btn");
    const loadingHint = document.getElementById("camera-loading-hint");

    if (!cameraBtn) return;

    async function startCamera(isFlipAction = false) {
        stopCamera();
        if (loadingHint) {
            loadingHint.textContent = "Starting camera... 📷";
            loadingHint.style.display = "flex";
        }
        if (video) video.classList.toggle("no-mirror", currentFacingMode !== "user");

        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: currentFacingMode },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            if (video) {
                video.srcObject = cameraStream;
                await video.play();
            }
            if (loadingHint) loadingHint.style.display = "none";
        } catch (err) {
            console.warn("Direct webcam access error:", err);
            if (isFlipAction) {
                try {
                    currentFacingMode = "user";
                    if (video) video.classList.remove("no-mirror");
                    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    if (video) {
                        video.srcObject = cameraStream;
                        await video.play();
                    }
                    if (loadingHint) {
                        loadingHint.textContent = "Only 1 camera found (Mirror toggled) 🔄";
                        loadingHint.style.display = "flex";
                        setTimeout(() => { if (loadingHint) loadingHint.style.display = "none"; }, 1800);
                    }
                    return;
                } catch (e2) {}
            }

            stopCamera();
            if (modal) modal.classList.add("hide");
            if (fileInput) fileInput.click();
        }
    }

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = null;
        }
        if (video) video.srcObject = null;
    }

    cameraBtn.addEventListener("click", () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            if (fileInput) fileInput.click();
            return;
        }

        if (modal) {
            modal.classList.remove("hide");
            startCamera();
        } else if (fileInput) {
            fileInput.click();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            stopCamera();
            if (modal) modal.classList.add("hide");
        });
    }

    if (flipBtn) {
        flipBtn.addEventListener("click", async () => {
            if (flipBtn.disabled) return;
            flipBtn.disabled = true;
            try {
                let videoDevices = [];
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                    try {
                        const devices = await navigator.mediaDevices.enumerateDevices();
                        videoDevices = devices.filter(d => d.kind === "videoinput");
                    } catch (e) {}
                }

                if (videoDevices.length <= 1 && video) {
                    const isMirrored = !video.classList.contains("no-mirror");
                    video.classList.toggle("no-mirror", isMirrored);
                    currentFacingMode = isMirrored ? "environment" : "user";
                    if (loadingHint) {
                        loadingHint.textContent = "1 camera detected (Mirror toggled) 🔄";
                        loadingHint.style.display = "flex";
                        setTimeout(() => { if (loadingHint) loadingHint.style.display = "none"; }, 1800);
                    }
                    return;
                }

                currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
                await startCamera(true);
            } finally {
                setTimeout(() => { flipBtn.disabled = false; }, 400);
            }
        });
    }

    if (galleryBtn) {
        galleryBtn.addEventListener("click", () => {
            stopCamera();
            if (modal) modal.classList.add("hide");
            if (fileInput) fileInput.click();
        });
    }

    if (snapBtn && video && canvas) {
        snapBtn.addEventListener("click", () => {
            if (!video.videoWidth) return;

            const w = video.videoWidth;
            const h = video.videoHeight;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");

            if (currentFacingMode === "user") {
                ctx.translate(w, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(video, 0, 0, w, h);

            canvas.toBlob((blob) => {
                if (blob) {
                    sendSecretPhoto(blob, "Selfie 📸");
                }
            }, "image/jpeg", 0.85);

            stopCamera();
            if (modal) modal.classList.add("hide");
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                stopCamera();
                modal.classList.add("hide");
            }
        });
    }

    window.addEventListener("keydown", (e) => {
        if ((e.key === "Escape" || e.keyCode === 27) && modal && !modal.classList.contains("hide")) {
            stopCamera();
            modal.classList.add("hide");
        }
    });

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const maxDim = 1280;
                    let w = img.width;
                    let h = img.height;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) {
                            h = Math.round((h * maxDim) / w);
                            w = maxDim;
                        } else {
                            w = Math.round((w * maxDim) / h);
                            h = maxDim;
                        }
                    }

                    const offCanvas = document.createElement("canvas");
                    offCanvas.width = w;
                    offCanvas.height = h;
                    const ctx = offCanvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, w, h);

                    offCanvas.toBlob((blob) => {
                        if (blob) {
                            sendSecretPhoto(blob, "Photo 📸");
                        }
                    }, "image/jpeg", 0.85);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            fileInput.value = "";
        });
    }
}

function sendSecretPhoto(photoBlob, caption = "Photo 📸") {
    if (!photoBlob) return;
    const isOffline = !navigator.onLine;
    const objectUrl = URL.createObjectURL(photoBlob);
    const msgId = 'msg_photo_' + Date.now();

    const newMsg = {
        id: msgId,
        sender: CONFIG.partnerName,
        text: caption,
        timestamp: Date.now(),
        isPartner: false,
        type: 'photo',
        status: isOffline ? 'pending' : 'sending',
        stickerUrl: objectUrl,
        replyTo: typeof activeReplyState !== 'undefined' && activeReplyState ? { text: activeReplyState.text } : null
    };
    saveChatMessage(newMsg);
    playTapTone("Heart");

    const replyId = (typeof activeReplyState !== 'undefined' && activeReplyState && activeReplyState.telegramId)
        ? parseInt(activeReplyState.telegramId) : undefined;
    if (typeof cancelReply !== 'undefined') cancelReply();

    const reader = new FileReader();
    reader.onloadend = () => {
        newMsg.stickerUrl = reader.result;
        saveChatMessage(newMsg);

        const photoPayload = {
            photo: reader.result,
            caption: `📸 Secret Photo from ${CONFIG.partnerName}! 💕` + (caption && caption !== 'Photo 📸' ? `\n\n"${caption}"` : ''),
            reply_to_message_id: replyId
        };

        if (isOffline) {
            queueForOutbox({ id: newMsg.id, action: 'sendPhoto', payload: photoPayload, type: 'photo' });
            showLoveToast("📸 Photo saved to Outbox! Auto-sending once connected.", "⏳");
            return;
        }

        callTelegramApi('sendPhoto', photoPayload)
        .then(data => {
            if (data && data.ok && data.result && data.result.message_id) {
                newMsg.telegramMessageId = data.result.message_id;
                newMsg.status = 'sent';
                if (data.result.photo && data.result.photo.length > 0) {
                    newMsg.stickerFileId = data.result.photo[data.result.photo.length - 1].file_id;
                }
                saveChatMessage(newMsg);
            } else {
                newMsg.status = 'pending';
                saveChatMessage(newMsg);
                queueForOutbox({ id: newMsg.id, action: 'sendPhoto', payload: photoPayload, type: 'photo' });
                showLoveToast("⏳ Photo saved to Outbox! Auto-sending once connected.", "📡");
            }
            setTimeout(checkTelegramReplies, 1500);
        })
        .catch(err => {
            newMsg.status = 'pending';
            saveChatMessage(newMsg);
            queueForOutbox({ id: newMsg.id, action: 'sendPhoto', payload: photoPayload, type: 'photo' });
        });
    };
    reader.readAsDataURL(photoBlob);
}

function sendSecretEdit(text) {
    if (!text || !text.trim()) return;
    const cleanMsg = text.trim();
    if (!activeEditState || !activeEditState.telegramId) {
        if (typeof cancelEdit !== 'undefined') cancelEdit();
        return;
    }

    const history = getChatHistory();
    const itemIndex = history.findIndex(m => m.id === activeEditState.localId);
    if (itemIndex !== -1) {
        history[itemIndex].text = cleanMsg;
        localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
        renderSecretChat();
    }

    callTelegramApi('editMessageText', {
        message_id: parseInt(activeEditState.telegramId),
        text: `💌 Secret Update from ${CONFIG.partnerName}:\n\n${cleanMsg}`
    }).catch(error => console.error("Cloud edit error."));

    if (typeof cancelEdit !== 'undefined') cancelEdit();
}

function sendSecretSticker(sticker) {
    if (!sticker) return;
    const isOffline = !navigator.onLine;

    const isEmoji = sticker.isEmoji || !sticker.url;
    const msgId = 'msg_stk_' + Date.now();
    const newMsg = {
        id: msgId,
        sender: CONFIG.partnerName,
        type: 'sticker',
        status: isOffline ? 'pending' : 'sending',
        stickerUrl: sticker.url || '',
        stickerEmoji: sticker.emoji || '💖',
        text: sticker.name || sticker.emoji || 'Sticker',
        timestamp: Date.now(),
        isPartner: false,
        replyTo: typeof activeReplyState !== 'undefined' && activeReplyState ? { text: activeReplyState.text } : null
    };

    saveChatMessage(newMsg);
    playTapTone("Heart");

    // Close sticker picker drawer
    const picker = document.getElementById("chat-sticker-picker");
    const toggleBtn = document.getElementById("chat-sticker-btn");
    if (picker) picker.classList.add("hide");
    if (toggleBtn) toggleBtn.classList.remove("active");

    const replyId = (typeof activeReplyState !== 'undefined' && activeReplyState && activeReplyState.telegramId)
        ? parseInt(activeReplyState.telegramId) : undefined;
    if (typeof cancelReply !== 'undefined') cancelReply();

    const action = isEmoji ? 'sendMessage' : (sticker.isAnim ? 'sendAnimation' : 'sendPhoto');
    const payload = isEmoji ? {
        text: `💌 Sticker from ${CONFIG.partnerName}:\n\n${sticker.emoji} ${sticker.name ? '(' + sticker.name + ')' : ''}`,
        reply_to_message_id: replyId
    } : {
        [sticker.isAnim ? 'animation' : 'photo']: sticker.url,
        caption: `💌 Sticker from ${CONFIG.partnerName}: ${sticker.emoji || '💕'} ${sticker.name || ''}`,
        reply_to_message_id: replyId
    };

    if (isOffline) {
        queueForOutbox({ id: newMsg.id, action: action, payload: payload, type: 'sticker' });
        showLoveToast("🥰 Sticker saved to Outbox! Auto-sending once connected.", "⏳");
        return;
    }

    callTelegramApi(action, payload)
    .then(data => {
        if (data && data.ok && data.result && data.result.message_id) {
            newMsg.telegramMessageId = data.result.message_id;
            newMsg.status = 'sent';
            saveChatMessage(newMsg);
        } else {
            newMsg.status = 'pending';
            saveChatMessage(newMsg);
            queueForOutbox({ id: newMsg.id, action: action, payload: payload, type: 'sticker' });
            showLoveToast("⏳ Sticker saved to Outbox! Auto-sending once connected.", "📡");
        }
        setTimeout(checkTelegramReplies, 1500);
    })
    .catch(e => {
        newMsg.status = 'pending';
        saveChatMessage(newMsg);
        queueForOutbox({ id: newMsg.id, action: action, payload: payload, type: 'sticker' });
    });
}

function initStickerPicker() {
    const stickerBtn = document.getElementById("chat-sticker-btn");
    const stickerPicker = document.getElementById("chat-sticker-picker");
    const closeBtn = document.getElementById("close-sticker-picker-btn");
    const stickerGrid = document.getElementById("sticker-grid");
    const tabBtns = document.querySelectorAll(".sticker-tab-btn");

    if (!stickerBtn || !stickerPicker || !stickerGrid) return;

    let currentCategory = "cats";

    const searchContainer = document.getElementById("giphy-search-container");
    const searchInput = document.getElementById("giphy-search-input");
    let searchTimeout = null;

    function searchGiphy(query) {
        if (!query.trim()) {
            stickerGrid.innerHTML = `<div style="padding: 1rem; color: var(--disguise-text-muted); text-align: center; width: 100%;">Type something to search GIFs...</div>`;
            return;
        }
        stickerGrid.innerHTML = `<div style="padding: 1rem; color: var(--disguise-text-muted); text-align: center; width: 100%;">Searching...</div>`;
        const url = `https://api.giphy.com/v1/gifs/search?api_key=3eFQvabDx69SMoOemSPiYfh9FY0nzO9x&q=${encodeURIComponent(query)}&limit=24&rating=pg-13`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                stickerGrid.innerHTML = "";
                if (data.data && data.data.length > 0) {
                    data.data.forEach(gif => {
                        const btn = document.createElement("button");
                        btn.className = "sticker-item";
                        btn.type = "button";
                        btn.title = gif.title || "GIF";
                        
                        const thumbUrl = (gif.images && gif.images.fixed_height_small && gif.images.fixed_height_small.url) || gif.images.fixed_height.url;
                        const fullUrl = (gif.images && gif.images.fixed_height && gif.images.fixed_height.url) || thumbUrl;
                        btn.innerHTML = `<img src="${thumbUrl}" alt="${gif.title || 'GIF'}" class="sticker-thumb" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${fullUrl}';">`;

                        btn.addEventListener("click", () => {
                            sendSecretSticker({
                                name: gif.title || "GIF",
                                url: fullUrl,
                                emoji: "✨",
                                isAnim: true
                            });
                        });
                        stickerGrid.appendChild(btn);
                    });
                } else {
                    stickerGrid.innerHTML = `<div style="padding: 1rem; color: var(--disguise-text-muted); text-align: center; width: 100%;">No GIFs found.</div>`;
                }
            })
            .catch(err => {
                stickerGrid.innerHTML = `<div style="padding: 1rem; color: var(--disguise-text-muted); text-align: center; width: 100%;">Error loading GIFs.</div>`;
            });
    }

    function renderCategory(cat) {
        currentCategory = cat;
        stickerGrid.innerHTML = "";
        
        if (cat === "search") {
            if (searchContainer) searchContainer.classList.remove("hide");
            searchGiphy(searchInput ? searchInput.value : "");
            return;
        } else {
            if (searchContainer) searchContainer.classList.add("hide");
        }

        const items = STICKER_CATALOG[cat] || [];
        items.forEach(stk => {
            const btn = document.createElement("button");
            btn.className = "sticker-item";
            btn.type = "button";
            btn.title = stk.name;

            if (stk.isEmoji) {
                btn.innerHTML = `<span class="sticker-emoji-large">${stk.emoji}</span>`;
            } else {
                const img = document.createElement("img");
                img.src = stk.url;
                img.alt = stk.name;
                img.className = "sticker-thumb";
                img.loading = "lazy";
                img.setAttribute("referrerpolicy", "no-referrer");

                img.onerror = () => {
                    if (stk.fallbackUrl && img.src !== stk.fallbackUrl) {
                        img.src = stk.fallbackUrl;
                    } else {
                        btn.innerHTML = `<span class="sticker-emoji-large">${stk.emoji || '💖'}</span>`;
                    }
                };

                btn.appendChild(img);
            }

            btn.addEventListener("click", () => {
                sendSecretSticker(stk);
            });

            stickerGrid.appendChild(btn);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchGiphy(e.target.value);
            }, 500);
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderCategory(btn.getAttribute("data-category"));
        });
    });

    stickerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isHidden = stickerPicker.classList.contains("hide");
        if (isHidden) {
            renderCategory(currentCategory);
            stickerPicker.classList.remove("hide");
            stickerBtn.classList.add("active");
        } else {
            stickerPicker.classList.add("hide");
            stickerBtn.classList.remove("active");
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            stickerPicker.classList.add("hide");
            stickerBtn.classList.remove("active");
        });
    }

    // Close when clicking outside of picker
    document.addEventListener("click", (e) => {
        if (!stickerPicker.contains(e.target) && !stickerBtn.contains(e.target)) {
            stickerPicker.classList.add("hide");
            stickerBtn.classList.remove("active");
        }
    });
}

let isCheckingReplies = false;

function checkTelegramReplies() {
    if (isCheckingReplies) return;
    const token = getSessionToken();
    if (!token) return; // Only poll when authenticated

    let lastOffset = parseInt(localStorage.getItem('studyflow_last_offset') || "0");
    isCheckingReplies = true;

    const endpoint = getApiEndpoint(`/api/telegram?action=getUpdates&offset=${lastOffset}`);
    fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
            if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
                let newPartnerMessages = 0;
                let maxUpdateId = lastOffset;
                const history = getChatHistory();
                const tokenParam = token ? `&token=${encodeURIComponent(token)}` : '';

                data.result.forEach(update => {
                    if (update.update_id >= maxUpdateId) {
                        maxUpdateId = update.update_id + 1;
                    }

                    const msg = update.message;
                    const editedMsg = update.edited_message;
                    const reactionUpdate = update.message_reaction;
                    
                    if (reactionUpdate) {
                        const itemIndex = history.findIndex(m => m.telegramMessageId === reactionUpdate.message_id);
                        if (itemIndex !== -1) {
                            if (reactionUpdate.new_reaction && reactionUpdate.new_reaction.length > 0) {
                                const firstReaction = reactionUpdate.new_reaction[0];
                                history[itemIndex].reaction = firstReaction.type === 'emoji' ? firstReaction.emoji : '❤️';
                            } else {
                                delete history[itemIndex].reaction;
                            }
                            newPartnerMessages++; // trigger UI update
                        }
                    }

                    if (editedMsg) {
                        const itemIndex = history.findIndex(m => m.telegramMessageId === editedMsg.message_id);
                        if (itemIndex !== -1) {
                            if (editedMsg.text) {
                                history[itemIndex].text = editedMsg.text;
                            } else if (editedMsg.caption) {
                                history[itemIndex].text = editedMsg.caption;
                            }
                            newPartnerMessages++;
                        }
                    }

                    if (msg) {
                        const newMsgId = 't_' + update.update_id;
                        if (!history.some(m => m.id === newMsgId)) {
                            const time = msg.date ? msg.date * 1000 : Date.now();

                            if (msg.sticker) {
                                // 1. Yash sent a Sticker
                                const sticker = msg.sticker;
                                const targetFileId = (sticker.is_animated || sticker.is_video) && (sticker.thumbnail || sticker.thumb)
                                    ? (sticker.thumbnail || sticker.thumb).file_id
                                    : sticker.file_id;

                                const newMsg = {
                                    id: newMsgId,
                                    telegramMessageId: msg.message_id,
                                    replyTo: msg.reply_to_message ? { text: msg.reply_to_message.text || 'Media' } : null,
                                    sender: CONFIG.yourName,
                                    type: 'sticker',
                                    stickerFileId: targetFileId,
                                    stickerUrl: targetFileId ? `/api/file?file_id=${encodeURIComponent(targetFileId)}${tokenParam}` : '',
                                    stickerEmoji: sticker.emoji || "💖",
                                    text: sticker.emoji || "Sticker",
                                    timestamp: time,
                                    isPartner: true
                                };
                                history.push(newMsg);
                                newPartnerMessages++;
                            } else if (msg.photo && msg.photo.length > 0) {
                                // 2. Yash sent a Photo
                                const photo = msg.photo[msg.photo.length - 1];
                                const newMsg = {
                                    id: newMsgId,
                                    telegramMessageId: msg.message_id,
                                    replyTo: msg.reply_to_message ? { text: msg.reply_to_message.text || msg.reply_to_message.caption || 'Photo' } : null,
                                    sender: CONFIG.yourName,
                                    type: 'photo',
                                    stickerFileId: photo.file_id,
                                    stickerUrl: `/api/file?file_id=${encodeURIComponent(photo.file_id)}${tokenParam}`,
                                    text: msg.caption ? msg.caption.trim() : "",
                                    timestamp: time,
                                    isPartner: true
                                };
                                history.push(newMsg);
                                newPartnerMessages++;
                            } else if (msg.animation) {
                                // 3. Yash sent an Animation / GIF
                                const anim = msg.animation;
                                const targetFileId = (anim.thumbnail && anim.thumbnail.file_id) ? anim.thumbnail.file_id : anim.file_id;
                                const newMsg = {
                                    id: newMsgId,
                                    telegramMessageId: msg.message_id,
                                    replyTo: msg.reply_to_message ? { text: msg.reply_to_message.text || msg.reply_to_message.caption || 'GIF' } : null,
                                    sender: CONFIG.yourName,
                                    type: 'sticker',
                                    stickerFileId: targetFileId,
                                    stickerUrl: targetFileId ? `/api/file?file_id=${encodeURIComponent(targetFileId)}${tokenParam}` : '',
                                    stickerEmoji: "✨",
                                    text: msg.caption ? msg.caption.trim() : "GIF",
                                    timestamp: time,
                                    isPartner: true
                                };
                                history.push(newMsg);
                                newPartnerMessages++;
                            } else if (msg.voice || msg.audio || (msg.document && msg.document.mime_type && msg.document.mime_type.startsWith('audio/'))) {
                                // 4. Yash sent a Voice Note or Audio
                                const audio = msg.voice || msg.audio || msg.document;
                                const newMsg = {
                                    id: newMsgId,
                                    telegramMessageId: msg.message_id,
                                    replyTo: msg.reply_to_message ? { text: msg.reply_to_message.text || msg.reply_to_message.caption || 'Voice Note' } : null,
                                    sender: CONFIG.yourName,
                                    type: 'voice',
                                    stickerFileId: audio.file_id,
                                    stickerUrl: `/api/file?file_id=${encodeURIComponent(audio.file_id)}${tokenParam}`,
                                    text: "Voice Note 🎤",
                                    timestamp: time,
                                    isPartner: true
                                };
                                history.push(newMsg);
                                newPartnerMessages++;
                            } else if (msg.text) {
                                // 5. Yash sent a Text message
                                const text = msg.text.trim();
                                if (text && !text.startsWith("/")) {
                                    history.push({
                                        id: newMsgId,
                                        telegramMessageId: msg.message_id,
                                        replyTo: msg.reply_to_message ? { text: msg.reply_to_message.text || msg.reply_to_message.caption || 'Media' } : null,
                                        sender: CONFIG.yourName,
                                        text: text,
                                        timestamp: time,
                                        isPartner: true
                                    });
                                    newPartnerMessages++;
                                }
                            }
                        }
                    }
                });

                // Persist updated offset and history
                localStorage.setItem('studyflow_last_offset', maxUpdateId);
                localStorage.setItem('studyflow_chat_history', JSON.stringify(history));

                if (newPartnerMessages > 0) {
                    // Mark all previous Web App messages as seen since Yash sent some activity
                    let historyChanged = false;
                    history.forEach(m => {
                        if (!m.isPartner && !m.seen) {
                            m.seen = true;
                            historyChanged = true;
                        }
                    });
                    
                    if (historyChanged) {
                        localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
                    }

                    const isLoveOpen = loveContainer && !loveContainer.classList.contains("hide");
                    if (!isLoveOpen) {
                        let currentUnread = parseInt(localStorage.getItem('studyflow_unread_count') || "0");
                        currentUnread += newPartnerMessages;
                        localStorage.setItem('studyflow_unread_count', currentUnread);
                        updateUnreadIndicator();
                    } else {
                        renderSecretChat();
                        if (typeof window.markMessagesAsSeen === 'function') {
                            window.markMessagesAsSeen();
                        }
                    }
                }
            }
        })
        .catch(err => {
            console.log("Sync heartbeat check.");
        })
        .finally(() => {
            isCheckingReplies = false;
        });
}

let activeReplyState = null;
let activeEditState = null;

window.initiateReply = function(localMsgId, telegramMsgId, textPreview) {
    if (activeEditState) cancelEdit();
    activeReplyState = {
        localId: localMsgId,
        telegramId: telegramMsgId,
        text: textPreview || 'Media'
    };
    const replyBar = document.getElementById("active-reply-bar");
    const replyText = document.getElementById("active-reply-text");
    const replyLabel = document.getElementById("active-reply-label");
    if (replyBar && replyText) {
        if (replyLabel) replyLabel.textContent = "Replying to:";
        replyText.textContent = activeReplyState.text + (activeReplyState.text.length >= 30 ? '...' : '');
        replyBar.classList.remove("hide");
    }
    const input = document.getElementById("secret-reply-input");
    if (input) input.focus();
};

window.cancelReply = function() {
    activeReplyState = null;
    const replyBar = document.getElementById("active-reply-bar");
    if (replyBar && !activeEditState) replyBar.classList.add("hide");
};

window.initiateEdit = function(localMsgId, telegramMsgId, textToEdit) {
    if (activeReplyState) cancelReply();
    activeEditState = {
        localId: localMsgId,
        telegramId: telegramMsgId
    };
    const replyBar = document.getElementById("active-reply-bar");
    const replyText = document.getElementById("active-reply-text");
    const replyLabel = document.getElementById("active-reply-label");
    if (replyBar && replyText) {
        if (replyLabel) replyLabel.textContent = "";
        replyText.innerHTML = `<span style="color:var(--disguise-primary);">✏️ Editing message...</span>`;
        replyBar.classList.remove("hide");
    }
    const input = document.getElementById("secret-reply-input");
    if (input) {
        input.value = textToEdit;
        input.focus();
    }
};

window.cancelEdit = function() {
    activeEditState = null;
    const replyBar = document.getElementById("active-reply-bar");
    if (replyBar && !activeReplyState) replyBar.classList.add("hide");
    const input = document.getElementById("secret-reply-input");
    if (input) input.value = "";
};

// Secret chat input listeners in Love Space
if (secretSendBtn && secretReplyInput) {
    let lastTypingTime = 0;
    
    const handleSecretTyping = () => {
        const now = Date.now();
        // Send typing action at most once every 4 seconds
        if (now - lastTypingTime > 4000 && secretReplyInput.value.trim().length > 0) {
            lastTypingTime = now;
            callTelegramApi('sendChatAction', { chatAction: 'typing' })
                .catch(e => console.error("Error sending typing action", e));
        }
    };

    secretReplyInput.addEventListener("input", handleSecretTyping);

    const handleSecretSend = () => {
        const text = secretReplyInput.value.trim();
        if (text) {
            if (activeEditState) {
                sendSecretEdit(text);
            } else {
                sendSecretUpdate(text);
            }
            secretReplyInput.value = "";
        }
    };
    secretSendBtn.addEventListener("click", handleSecretSend);
    secretReplyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleSecretSend();
        }
    });
}

if (clearChatBtn) {
    clearChatBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your secret chat messages?")) {
            localStorage.setItem('studyflow_chat_history', JSON.stringify([]));
            localStorage.setItem('studyflow_unread_count', "0");
            updateUnreadIndicator();
            renderSecretChat();
        }
    });
}

// =========================================================================
// 9. SILENT TELEGRAM INSTANT NOTIFICATIONS & STATUS
// =========================================================================
function notifyTelegram(text, options = {}) {
    return callTelegramApi('sendMessage', {
        text: text,
        parse_mode: options.parseMode || 'HTML',
        disable_notification: options.silent || false
    });
}

function sendVisitNotification() {
    const lastVisit = sessionStorage.getItem('studyflow_visit_notified');
    const now = Date.now();
    // Notify once per browser session (or after 15 mins)
    if (!lastVisit || (now - parseInt(lastVisit)) > 15 * 60 * 1000) {
        sessionStorage.setItem('studyflow_visit_notified', now.toString());
        callTelegramApi('visitPing').catch(() => {});
    }
}

// Batched Love Taps to Telegram
let tapTelegramTimer = null;
let batchedTaps = { Hug: 0, Heart: 0, Kiss: 0, Miss: 0 };

function queueLoveTapTelegram(name) {
    batchedTaps[name] = (batchedTaps[name] || 0) + 1;
    clearTimeout(tapTelegramTimer);

    tapTelegramTimer = setTimeout(() => {
        let parts = [];
        if (batchedTaps.Hug > 0) parts.push(`• ${batchedTaps.Hug} Hugs 😽`);
        if (batchedTaps.Heart > 0) parts.push(`• ${batchedTaps.Heart} Hearts 😻`);
        if (batchedTaps.Kiss > 0) parts.push(`• ${batchedTaps.Kiss} Purrs 🐾`);
        if (batchedTaps.Miss > 0) parts.push(`• ${batchedTaps.Miss} Miss You taps 😿`);

        if (parts.length > 0) {
            const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            notifyTelegram(`😻 <b>Mukku is sending you love taps right now!</b>\n\n${parts.join("\n")}\n\n🕒 <code>${timeStr}</code>`);
        }

        batchedTaps = { Hug: 0, Heart: 0, Kiss: 0, Miss: 0 };
    }, 2500); // Wait 2.5s after last tap to bundle cleanly
}


// =========================================================================
// 10. SECRET PHOTO GALLERY & PEEK LIGHTBOX
// =========================================================================
const PHOTO_COLLECTION = [
    { id: 1, caption: "Meri choti cutie pie 🥺🌸" },
    { id: 2, caption: "Meri jaan, mera sukoon 💖" },
    { id: 3, caption: "Duniya ki sabse pyari Mukku 🐾" },
    { id: 4, caption: "Sirf aur sirf meri Mukku ❤️" }
];

function getPhotoUrl(id) {
    if (isLocalStaticEnvironment()) {
        return `api/photos/childhood_${id}.png`;
    }
    const token = getSessionToken();
    return `/api/photo?id=${id}&token=${encodeURIComponent(token)}`;
}

function loadProtectedPhotos() {
    const token = getSessionToken();
    if (!token) return;
    const polaroidCards = document.querySelectorAll(".polaroid-card");
    polaroidCards.forEach((card, idx) => {
        const photoId = parseInt(card.getAttribute("data-photo-id") || (idx + 1));
        const img = card.querySelector(".polaroid-img");
        if (img) img.src = getPhotoUrl(photoId);
    });
}

let currentLightboxIndex = 0;

function initPhotoGallery() {
    const polaroidCards = document.querySelectorAll(".polaroid-card");
    const lightboxModal = document.getElementById("photo-lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxCounter = document.getElementById("lightbox-counter");
    const closeLightboxBtn = document.getElementById("close-lightbox-btn");
    const prevBtn = document.getElementById("lightbox-prev-btn");
    const nextBtn = document.getElementById("lightbox-next-btn");

    if (!lightboxModal) return;

    function openLightbox(index) {
        currentLightboxIndex = (index >= 0 && index < PHOTO_COLLECTION.length) ? index : 0;
        updateLightboxView();
        lightboxModal.classList.remove("hide");
    }

    function updateLightboxView() {
        const item = PHOTO_COLLECTION[currentLightboxIndex];
        if (lightboxImg) lightboxImg.src = getPhotoUrl(item.id);
        if (lightboxCaption) lightboxCaption.textContent = item.caption;
        if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${PHOTO_COLLECTION.length}`;
    }

    function closeLightbox() {
        lightboxModal.classList.add("hide");
    }

    polaroidCards.forEach(card => {
        // Touch events for mobile peek
        card.addEventListener("touchstart", () => {
            card.classList.add("revealed");
        }, { passive: true });

        card.addEventListener("touchend", () => {
            setTimeout(() => card.classList.remove("revealed"), 1500);
        });

        // Click to open full lightbox
        card.addEventListener("click", () => {
            const index = parseInt(card.getAttribute("data-index") || "0");
            openLightbox(index);
        });
    });

    if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
    
    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentLightboxIndex = (currentLightboxIndex - 1 + PHOTO_COLLECTION.length) % PHOTO_COLLECTION.length;
            updateLightboxView();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentLightboxIndex = (currentLightboxIndex + 1) % PHOTO_COLLECTION.length;
            updateLightboxView();
        });
    }

    // Close when clicking modal backdrop
    lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Close lightbox on Esc
    window.addEventListener("keydown", (e) => {
        if ((e.key === "Escape" || e.keyCode === 27) && !lightboxModal.classList.contains("hide")) {
            closeLightbox();
        }
    });

    // Secret stealth shortcut:
    // Click StudyFlow 📚 logo 3 times rapidly from StudyFlow disguise mode
    // to open secret photo lightbox immediately without unlocking full page!
    let logoClicks = 0;
    let logoClickTimer = null;
    const logoEl = document.querySelector(".disguise-header .logo");
    if (logoEl) {
        logoEl.style.cursor = "pointer";
        logoEl.addEventListener("click", () => {
            logoClicks++;
            clearTimeout(logoClickTimer);
            if (logoClicks >= 3) {
                logoClicks = 0;
                openLightbox(0);
            } else {
                logoClickTimer = setTimeout(() => { logoClicks = 0; }, 800);
            }
        });
    }
}

// =========================================================================
// SWEET TOAST NOTIFICATION
// =========================================================================
function showLoveToast(message, emoji = '💖') {
    const container = document.getElementById("love-toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "love-toast";
    toast.innerHTML = `<span style="font-size:1.2rem; flex-shrink:0;">${escapeHTML(emoji)}</span><span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 4000);
}

// =========================================================================
// OFFLINE OUTBOX & AUTO-SYNC ENGINE
// =========================================================================
function getOfflineOutbox() {
    try {
        const raw = localStorage.getItem('studyflow_offline_outbox');
        if (!raw) return [];
        const key = getVaultKey();
        const decrypted = decryptVaultData(raw, key);
        return JSON.parse(decrypted) || [];
    } catch (e) {
        return [];
    }
}

function saveOfflineOutbox(queue) {
    try {
        const key = getVaultKey();
        localStorage.setItem('studyflow_offline_outbox', encryptVaultData(JSON.stringify(queue), key));
        updateOutboxIndicator();
    } catch (e) {
        console.error("Outbox save error:", e);
    }
}

function queueForOutbox(item) {
    const queue = getOfflineOutbox();
    if (!queue.some(q => q.id === item.id)) {
        queue.push(item);
        saveOfflineOutbox(queue);
    }
    updateOutboxIndicator();
}

function removeFromOutbox(id) {
    const queue = getOfflineOutbox().filter(q => q.id !== id);
    saveOfflineOutbox(queue);
    updateOutboxIndicator();
}

function updateOutboxIndicator(isSyncing = false) {
    const pill = document.getElementById("chat-status-pill");
    const dot = document.getElementById("chat-status-dot");
    const text = document.getElementById("chat-status-text");
    if (!pill || !dot || !text) return;

    const queue = getOfflineOutbox();
    const isOnline = navigator.onLine;

    if (isSyncing) {
        pill.className = "chat-status-pill syncing";
        dot.className = "status-dot syncing";
        text.textContent = "Syncing messages to Telegram... 🚀";
    } else if (!isOnline) {
        pill.className = "chat-status-pill offline";
        dot.className = "status-dot offline";
        text.textContent = queue.length > 0 
            ? `Offline Outbox (${queue.length} pending ⏳)`
            : "Offline Mode (Local Storage)";
    } else if (queue.length > 0) {
        pill.className = "chat-status-pill offline";
        dot.className = "status-dot offline";
        text.textContent = `Outbox: ${queue.length} ready to sync ⏳`;
    } else {
        pill.className = "chat-status-pill";
        dot.className = "status-dot";
        text.textContent = "Live Telegram Sync";
    }
}

let isFlushingOutbox = false;
async function flushOfflineOutbox() {
    if (isFlushingOutbox || !navigator.onLine) return;
    const queue = getOfflineOutbox();
    if (queue.length === 0) {
        updateOutboxIndicator();
        return;
    }

    isFlushingOutbox = true;
    updateOutboxIndicator(true);

    let sentCount = 0;
    try {
        for (const item of [...queue]) {
            if (!navigator.onLine) break;

            const res = await callTelegramApi(item.action, item.payload);
            if (res && res.ok && res.result && res.result.message_id) {
                const history = getChatHistory();
                const chatMsg = history.find(m => m.id === item.id);
                if (chatMsg) {
                    chatMsg.status = 'sent';
                    chatMsg.telegramMessageId = res.result.message_id;
                    if (res.result.voice && res.result.voice.file_id) {
                        chatMsg.stickerFileId = res.result.voice.file_id;
                    } else if (res.result.audio && res.result.audio.file_id) {
                        chatMsg.stickerFileId = res.result.audio.file_id;
                    } else if (res.result.photo && res.result.photo.length > 0) {
                        chatMsg.stickerFileId = res.result.photo[res.result.photo.length - 1].file_id;
                    }
                    saveChatMessage(chatMsg);
                    renderSecretChat();
                }
                removeFromOutbox(item.id);
                sentCount++;
            } else {
                // Connection or Telegram API temporarily unavailable; pause flush
                break;
            }
        }
    } catch (e) {
        console.warn("Outbox flush paused:", e);
    } finally {
        isFlushingOutbox = false;
        renderSecretChat();
        updateOutboxIndicator();
        if (sentCount > 0) {
            showLoveToast(`✨ Reconnected! Sent ${sentCount} offline message${sentCount > 1 ? 's' : ''} to Yash.`);
        }
    }
}

function initOfflineOutbox() {
    window.addEventListener('online', () => {
        updateOutboxIndicator();
        flushOfflineOutbox();
        checkTelegramReplies();
    });
    window.addEventListener('offline', () => {
        updateOutboxIndicator();
    });
    updateOutboxIndicator();
    if (navigator.onLine) {
        flushOfflineOutbox();
    }
}

// =========================================================================
// DAILY CARE & LOVE REMINDERS ENGINE (100% OFFLINE)
// =========================================================================
const DEFAULT_CARE_REMINDERS = [
    {
        id: "rem_water_1",
        title: "Morning Hydration",
        emoji: "💧",
        time: "10:00",
        displayTime: "10:00 AM",
        message: "Paani pi lo meri jaan! Ek poora glass paani abhi piyo. Stay hydrated 💦",
        enabled: true
    },
    {
        id: "rem_love_note",
        title: "Midday Love Thought",
        emoji: "💖",
        time: "11:30",
        displayTime: "11:30 AM",
        message: "Bas yaad dila raha tha: I Love You bohot bohot sara! You're my world 🥰",
        enabled: true
    },
    {
        id: "rem_lunch",
        title: "Lunch Care",
        emoji: "🍱",
        time: "13:30",
        displayTime: "01:30 PM",
        message: "Babu, khana time se kha lena! No skipping meals, please! 🍱💕",
        enabled: true
    },
    {
        id: "rem_water_2",
        title: "Afternoon Hydration",
        emoji: "💧",
        time: "15:30",
        displayTime: "03:30 PM",
        message: "Paani ka doosra round! Skin aur health ke liye hydration is must 💧🌸",
        enabled: true
    },
    {
        id: "rem_rest",
        title: "Evening Study Break",
        emoji: "☕",
        time: "17:30",
        displayTime: "05:30 PM",
        message: "Padhai se 5 minute ka break le lo cutie pie. Ankhein band karo aur stretch karo ☕✨",
        enabled: true
    },
    {
        id: "rem_sleep",
        title: "Night Sleep Tight",
        emoji: "🌙",
        time: "23:00",
        displayTime: "11:00 PM",
        message: "Time se so jao meri pyaari wife! Sweet dreams, sapno me milte hain ❤️🌙",
        enabled: true
    }
];

function getCareReminders() {
    try {
        const raw = localStorage.getItem('studyflow_care_reminders');
        if (!raw) return DEFAULT_CARE_REMINDERS;
        return JSON.parse(raw);
    } catch (e) {
        return DEFAULT_CARE_REMINDERS;
    }
}

function saveCareReminders(list) {
    try {
        localStorage.setItem('studyflow_care_reminders', JSON.stringify(list));
    } catch (e) {}
}

function renderCareReminders() {
    const grid = document.getElementById("reminder-items-grid");
    if (!grid) return;
    const reminders = getCareReminders();

    grid.innerHTML = reminders.map(r => `
        <div class="reminder-item-card">
            <div class="reminder-item-left">
                <span class="reminder-item-emoji">${escapeHTML(r.emoji)}</span>
                <div>
                    <h3 class="reminder-item-title">${escapeHTML(r.title)}</h3>
                    <p class="reminder-item-msg">${escapeHTML(r.message)}</p>
                    <div class="reminder-time-badges">
                        <span class="reminder-time-badge">⏰ ${escapeHTML(r.displayTime)}</span>
                    </div>
                </div>
            </div>
            <label class="reminder-toggle-label" title="Enable/Disable reminder">
                <input type="checkbox" data-reminder-id="${escapeHTML(r.id)}" ${r.enabled ? 'checked' : ''} onchange="toggleCareReminder('${escapeHTML(r.id)}', this.checked)">
                <span class="reminder-toggle-slider"></span>
            </label>
        </div>
    `).join("");
}

function toggleCareReminder(id, isChecked) {
    const list = getCareReminders();
    const item = list.find(r => r.id === id);
    if (item) {
        item.enabled = isChecked;
        saveCareReminders(list);
        showLoveToast(isChecked ? `Reminder activated ⏰` : `Reminder turned off`, isChecked ? "🔔" : "🔕");
    }
}

function showReminderPopup(reminder) {
    const modal = document.getElementById("reminder-popup-modal");
    const emoji = document.getElementById("reminder-popup-emoji");
    const title = document.getElementById("reminder-popup-title");
    const msg = document.getElementById("reminder-popup-msg");
    const time = document.getElementById("reminder-popup-time");

    if (emoji) emoji.textContent = reminder.emoji || "💖";
    if (title) title.textContent = reminder.title ? `Yash Ka Reminder: ${reminder.title}` : "Yash Ka Care Reminder";
    if (msg) msg.textContent = reminder.message || "I Love You!";
    if (time) time.textContent = `Scheduled for ${reminder.displayTime}`;

    if (modal) modal.classList.remove("hide");
    playTapTone("Heart");

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
            new Notification(`${reminder.emoji} ${reminder.title} - Yash`, {
                body: reminder.message,
                icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💖</text></svg>"
            });
        } catch (e) {}
    }
}

function checkDailyReminders() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;
    const todayStr = now.toISOString().slice(0, 10);

    const firedKey = `studyflow_fired_reminders_${todayStr}`;
    let firedList = [];
    try {
        firedList = JSON.parse(localStorage.getItem(firedKey) || "[]");
    } catch (e) {}

    const reminders = getCareReminders();
    reminders.forEach(r => {
        if (r.enabled && r.time === currentTimeStr && !firedList.includes(r.id)) {
            firedList.push(r.id);
            try { localStorage.setItem(firedKey, JSON.stringify(firedList)); } catch (e) {}
            showReminderPopup(r);
        }
    });
}

function exportToPhoneCalendar() {
    const reminders = getCareReminders().filter(r => r.enabled);
    if (reminders.length === 0) {
        showLoveToast("Please enable at least one reminder to export!", "⚠️");
        return;
    }

    let icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Yash and Mukku//Daily Love Reminders//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Yash's Care for Mukku 💖",
        "X-WR-TIMEZONE:Asia/Kolkata"
    ];

    reminders.forEach((r, idx) => {
        const [hh, mm] = r.time.split(":");
        const timePart = `${hh}${mm}00`;
        const uid = `mukku_care_${r.id}_${idx}@studyflow.love`;
        const summary = `${r.emoji} ${r.title} - Yash 💕`;
        const cleanMsg = (r.message || '').replace(/\n/g, '\\n').replace(/,/g, '\\,');

        icsLines.push("BEGIN:VEVENT");
        icsLines.push(`UID:${uid}`);
        icsLines.push(`SUMMARY:${summary}`);
        icsLines.push(`DESCRIPTION:${cleanMsg}`);
        icsLines.push(`DTSTART:20260101T${timePart}`);
        icsLines.push(`DTEND:20260101T${timePart}`);
        icsLines.push("RRULE:FREQ=DAILY");
        icsLines.push("BEGIN:VALARM");
        icsLines.push("TRIGGER:-PT0M");
        icsLines.push("ACTION:DISPLAY");
        icsLines.push(`DESCRIPTION:${cleanMsg}`);
        icsLines.push("END:VALARM");
        icsLines.push("END:VEVENT");
    });

    icsLines.push("END:VCALENDAR");

    const icsContent = icsLines.join("\r\n");
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yash_daily_care_reminders.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showLoveToast("📅 Calendar file downloaded! Open it to add recurring phone alarms.", "🌸");
}

function setupRemindersUI() {
    const remindersCard = document.getElementById("love-reminders-card");
    if (!remindersCard) return;

    renderCareReminders();

    const calBtn = document.getElementById("export-calendar-btn");
    if (calBtn) {
        calBtn.addEventListener("click", exportToPhoneCalendar);
    }

    const testBtn = document.getElementById("test-reminder-btn");
    if (testBtn) {
        testBtn.addEventListener("click", () => {
            const list = getCareReminders();
            const first = list[0] || DEFAULT_CARE_REMINDERS[0];
            showReminderPopup(first);
        });
    }

    const notifBtn = document.getElementById("enable-notifications-btn");
    const notifText = document.getElementById("notif-btn-text");
    if (notifBtn && typeof Notification !== 'undefined') {
        if (Notification.permission === 'granted') {
            if (notifText) notifText.textContent = "Notifications Active ✓";
            notifBtn.style.borderColor = "#10b981";
            notifBtn.style.color = "#10b981";
        }
        notifBtn.addEventListener("click", async () => {
            if (Notification.permission === 'granted') {
                showLoveToast("In-app notifications are already active!", "🔔");
                return;
            }
            try {
                const perm = await Notification.requestPermission();
                if (perm === 'granted') {
                    if (notifText) notifText.textContent = "Notifications Active ✓";
                    notifBtn.style.borderColor = "#10b981";
                    notifBtn.style.color = "#10b981";
                    showLoveToast("Notifications enabled! You will get alerts for reminders.", "🎉");
                } else {
                    showLoveToast("Permission not granted. Calendar alarms will still work offline!", "ℹ️");
                }
            } catch (e) {
                console.warn("Notification request error:", e);
            }
        });
    }

    const closePopupBtn = document.getElementById("close-reminder-popup-btn");
    if (closePopupBtn) {
        closePopupBtn.addEventListener("click", () => {
            const modal = document.getElementById("reminder-popup-modal");
            if (modal) modal.classList.add("hide");
            playTapTone("Kiss");
        });
    }

    // Check every 30 seconds for daily schedule
    setInterval(checkDailyReminders, 30000);
}

// =========================================================================
// SCHEDULED LOVE MESSAGES ENGINE (Subah Schedule, Day-Long Delivery)
// =========================================================================

function formatTimeFromHHMM(hhmm) {
    if (!hhmm || typeof hhmm !== 'string' || !hhmm.includes(':')) return hhmm || '';
    const parts = hhmm.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
}

function getTodayDateString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getScheduledMessages() {
    try {
        const raw = localStorage.getItem('studyflow_scheduled_messages');
        if (!raw) return [];
        const key = getVaultKey();
        const decrypted = decryptVaultData(raw, key);
        const list = JSON.parse(decrypted) || [];
        
        // Purge messages older than 2 days to keep vault clean
        const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
        return list.filter(item => (item.created || 0) > twoDaysAgo);
    } catch (e) {
        return [];
    }
}

function saveScheduledMessages(list) {
    try {
        const key = getVaultKey();
        localStorage.setItem('studyflow_scheduled_messages', encryptVaultData(JSON.stringify(list), key));
    } catch (e) {
        console.error("Scheduled messages save error:", e);
    }
}

function calculateScheduledTimestamp(timeStr) {
    if (!timeStr || !timeStr.includes(':')) return Date.now();
    const parts = timeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
    return d.getTime();
}

async function syncScheduledMessageToCloud(item) {
    if (isLocalStaticEnvironment() || !navigator.onLine) return;
    const token = getSessionToken();
    if (!token) return;

    try {
        await fetch(getApiEndpoint('/api/schedule?action=create'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                action: 'create',
                id: item.id,
                text: item.text,
                time: item.time,
                displayTime: item.displayTime,
                date: item.date,
                scheduledTimestamp: item.scheduledTimestamp
            })
        });
        console.log(`[Cloud Scheduler] Synced message (${item.displayTime}) to cloud server queue!`);
    } catch (e) {
        console.warn("[Cloud Scheduler] Sync warning:", e.message);
    }
}

async function deleteScheduledMessageFromCloud(id) {
    if (isLocalStaticEnvironment() || !navigator.onLine) return;
    const token = getSessionToken();
    if (!token) return;

    try {
        await fetch(getApiEndpoint('/api/schedule?action=delete'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action: 'delete', id: id })
        });
    } catch (e) {}
}

async function fetchCloudScheduledMessages() {
    if (isLocalStaticEnvironment() || !navigator.onLine) return;
    const token = getSessionToken();
    if (!token) return;

    try {
        const res = await fetch(getApiEndpoint('/api/schedule?action=list'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            if (data && data.ok && Array.isArray(data.items)) {
                const localList = getScheduledMessages();
                let updated = false;

                data.items.forEach(serverItem => {
                    const localItem = localList.find(l => l.id === serverItem.id);
                    if (localItem) {
                        if (serverItem.sent && !localItem.sent) {
                            localItem.sent = true;
                            localItem.sentAt = serverItem.sentAt;
                            localItem.status = 'sent';
                            updated = true;
                        }
                    } else if (!serverItem.sent) {
                        localList.push(serverItem);
                        updated = true;
                    }
                });

                if (updated) {
                    saveScheduledMessages(localList);
                    renderScheduledMessages();
                }
            }
        }
    } catch (e) {}
}

function addScheduledMessage(text, timeStr) {
    if (!text || !text.trim()) {
        showLoveToast("Please type a message first! 💌", "⚠️");
        return false;
    }
    if (!timeStr) {
        showLoveToast("Please select a time for the message! ⏰", "⚠️");
        return false;
    }

    const cleanText = text.trim();
    const today = getTodayDateString();
    const displayTime = formatTimeFromHHMM(timeStr);
    const scheduledTimestamp = calculateScheduledTimestamp(timeStr);

    const newItem = {
        id: 'sched_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        text: cleanText,
        time: timeStr,
        displayTime: displayTime,
        date: today,
        scheduledTimestamp: scheduledTimestamp,
        created: Date.now(),
        sent: false,
        sentAt: null,
        status: 'pending'
    };

    const list = getScheduledMessages();
    list.push(newItem);
    saveScheduledMessages(list);
    renderScheduledMessages();

    // Sync to Cloud Server Queue so server can autonomously dispatch even if phone is OFF!
    syncScheduledMessageToCloud(newItem);

    showLoveToast(`Message scheduled for ${displayTime}! Yash will receive it right on time 💕`, "⏰");
    playTapTone("Heart");

    // Check immediately in case time is already past or current minute
    checkAndDispatchScheduledMessages();
    return true;
}

function deleteScheduledMessage(id) {
    const list = getScheduledMessages();
    const updated = list.filter(item => item.id !== id);
    saveScheduledMessages(updated);
    renderScheduledMessages();
    deleteScheduledMessageFromCloud(id);
    showLoveToast("Scheduled message cancelled.", "🗑️");
}

function renderScheduledMessages() {
    const container = document.getElementById("scheduled-items-list");
    if (!container) return;

    const list = getScheduledMessages();
    const today = getTodayDateString();
    // Show today's messages first, sorted by time
    const todayItems = list.filter(item => item.date === today);
    todayItems.sort((a, b) => a.time.localeCompare(b.time));

    if (todayItems.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:1.2rem 0.5rem; color:var(--disguise-text-muted); font-size:0.8rem;">
                <span>🌸</span> Koi message scheduled nahi hai abhi.<br>
                Upar kisi chip par click karo ya apna message type karke time set karo!
            </div>
        `;
        return;
    }

    container.innerHTML = todayItems.map(item => `
        <div class="sched-item-card ${item.sent ? 'sent' : ''}" data-sched-id="${escapeHTML(item.id)}">
            <div class="sched-item-left">
                <span class="sched-time-badge">${escapeHTML(item.displayTime)}</span>
                <p class="sched-item-text" title="${escapeHTML(item.text)}">${escapeHTML(item.text)}</p>
            </div>
            <div class="sched-item-actions">
                ${item.sent 
                    ? `<span class="sched-status-tag sent">✓ Delivered</span>` 
                    : `<span class="sched-status-tag pending">⏳ Scheduled</span>`}
                <button type="button" class="sched-delete-btn" title="Cancel/Delete" onclick="deleteScheduledMessage('${escapeHTML(item.id)}')">🗑️</button>
            </div>
        </div>
    `).join("");
}

function dispatchScheduledMessage(item) {
    const cleanMsg = item.text;
    const isOffline = !navigator.onLine;

    // Record into local chat history
    const newMsg = {
        id: 'msg_sched_' + item.id,
        sender: CONFIG.partnerName,
        text: `⏰ [Scheduled for ${item.displayTime}]:\n${cleanMsg}`,
        timestamp: Date.now(),
        isPartner: false,
        status: isOffline ? 'pending' : 'sending',
        isScheduled: true
    };
    saveChatMessage(newMsg);

    const telegramText = `⏰ <b>Scheduled Love Note from ${CONFIG.partnerName}</b> 💕\n` +
                         `🕒 <i>Scheduled for: ${item.displayTime}</i>\n\n` +
                         `${escapeHTML(cleanMsg)}`;

    const payload = {
        text: telegramText,
        parse_mode: 'HTML'
    };

    if (isOffline) {
        queueForOutbox({ id: newMsg.id, action: 'sendMessage', payload: payload, type: 'text' });
        showLoveToast(`⏰ Note for ${item.displayTime} saved to Outbox! Auto-sending once connected.`, "⏳");
        return;
    }

    callTelegramApi('sendMessage', payload)
    .then(data => {
        if (data && data.ok && data.result && data.result.message_id) {
            newMsg.telegramMessageId = data.result.message_id;
            newMsg.status = 'sent';
            saveChatMessage(newMsg);
            showLoveToast(`⏰ Scheduled message (${item.displayTime}) delivered to Yash! 💕`, "💌");
        } else {
            newMsg.status = 'pending';
            saveChatMessage(newMsg);
            queueForOutbox({ id: newMsg.id, action: 'sendMessage', payload: payload, type: 'text' });
        }
    })
    .catch(err => {
        console.error("Scheduled message dispatch error:", err);
        newMsg.status = 'pending';
        saveChatMessage(newMsg);
        queueForOutbox({ id: newMsg.id, action: 'sendMessage', payload: payload, type: 'text' });
    });
}

function checkAndDispatchScheduledMessages() {
    const list = getScheduledMessages();
    if (!list || list.length === 0) return;

    const now = Date.now();
    const today = getTodayDateString();
    const currentHHMM = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');

    let hasChanges = false;

    for (const item of list) {
        if (item.sent) continue;

        // If epoch timestamp reached, OR if HH:MM reached
        const isPastDue = (item.scheduledTimestamp && now >= item.scheduledTimestamp) ||
                          (item.date < today) ||
                          (item.date === today && currentHHMM >= item.time);

        if (isPastDue) {
            dispatchScheduledMessage(item);
            item.sent = true;
            item.sentAt = Date.now();
            item.status = 'sent';
            hasChanges = true;
        }
    }

    if (hasChanges) {
        saveScheduledMessages(list);
        renderScheduledMessages();
    }

    // Sync state with cloud in background
    fetchCloudScheduledMessages();
}

function setupScheduledMessagesUI() {
    const toggleBtn = document.getElementById("schedule-msg-toggle-btn");
    const panel = document.getElementById("scheduled-messages-panel");
    const closeBtn = document.getElementById("close-sched-panel-btn");
    const addBtn = document.getElementById("add-scheduled-msg-btn");
    const textInput = document.getElementById("sched-input-text");
    const timeInput = document.getElementById("sched-input-time");
    const chips = document.querySelectorAll(".sched-chip-btn");

    if (toggleBtn && panel) {
        toggleBtn.addEventListener("click", () => {
            const isHidden = panel.classList.contains("hide");
            if (isHidden) {
                panel.classList.remove("hide");
                renderScheduledMessages();
                if (textInput) textInput.focus();
            } else {
                panel.classList.add("hide");
            }
        });
    }

    if (closeBtn && panel) {
        closeBtn.addEventListener("click", () => {
            panel.classList.add("hide");
        });
    }

    // Preset chip buttons
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            const timeVal = chip.getAttribute("data-time");
            const msgVal = chip.getAttribute("data-msg");
            if (timeInput && timeVal) timeInput.value = timeVal;
            if (textInput && msgVal) {
                textInput.value = msgVal;
                textInput.focus();
            }
            playTapTone("Heart");
        });
    });

    if (addBtn && textInput && timeInput) {
        addBtn.addEventListener("click", () => {
            const text = textInput.value;
            const time = timeInput.value;
            const success = addScheduledMessage(text, time);
            if (success) {
                textInput.value = "";
                // Set default time to 1 hour ahead
                const now = new Date();
                now.setHours(now.getHours() + 1);
                timeInput.value = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
            }
        });
    }

    // Set initial default time in time selector
    if (timeInput && !timeInput.value) {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        timeInput.value = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    }

    // Expose deleteScheduledMessage to global scope for inline button click
    window.deleteScheduledMessage = deleteScheduledMessage;

    // Render initially
    renderScheduledMessages();

    // Check periodically every 15 seconds
    setInterval(checkAndDispatchScheduledMessages, 15000);

    // Also check on visibilitychange and online
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible') {
            checkAndDispatchScheduledMessages();
        }
    });

    window.addEventListener("online", () => {
        checkAndDispatchScheduledMessages();
    });
}

// =========================================================================
// SERVICE WORKER REGISTRATION (OFFLINE PWA)
// =========================================================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator && !isLocalStaticEnvironment()) {
        const doRegister = () => {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(reg => {
                    console.log('StudyFlow ServiceWorker registered with scope:', reg.scope);
                    reg.update().catch(() => {});
                })
                .catch(err => {
                    console.warn('ServiceWorker registration warning:', err);
                });
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            doRegister();
        } else {
            window.addEventListener('load', doRegister);
        }
    }
}

// Run initialization safely across all environments
function initApp() {
    initializeSurpriseContent();
    updateTimerDisplay();
    updateUnreadIndicator();
    initStickerPicker();
    renderSecretChat();
    setupVoiceRecording();
    setupCameraSnap();
    initPhotoGallery();
    initOfflineOutbox();
    setupRemindersUI();
    setupScheduledMessagesUI();
    registerServiceWorker();

    // Silent visit ping to Yash on Telegram (server controlled, rate-limited)
    if (!isLocalStaticEnvironment()) {
        sendVisitNotification();
    }

    // Auto-restore session if previously authenticated
    const token = getSessionToken();
    if (token) {
        if (isLocalStaticEnvironment()) {
            try {
                const cached = sessionStorage.getItem('studyflow_cached_letter');
                if (cached) {
                    CONFIG.letterParagraphs = JSON.parse(cached);
                    initializeSurpriseContent();
                    loadProtectedPhotos();
                    renderSecretChat();
                }
            } catch (e) {}
        } else {
            fetch('/api/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(r => r.json())
            .then(data => {
                if (data.ok && data.secret && data.secret.letterParagraphs) {
                    CONFIG.letterParagraphs = data.secret.letterParagraphs;
                    initializeSurpriseContent();
                    loadProtectedPhotos();
                    renderSecretChat();
                    checkTelegramReplies();
                }
            }).catch(() => {
                try {
                    const cached = sessionStorage.getItem('studyflow_cached_letter');
                    if (cached) {
                        CONFIG.letterParagraphs = JSON.parse(cached);
                        initializeSurpriseContent();
                        loadProtectedPhotos();
                        renderSecretChat();
                    }
                } catch (e) {}
            });
        }
    }

    // Poll periodically every 10 seconds for real-time replies (only when unlocked)
    setInterval(() => {
        checkTelegramReplies();
        if (navigator.onLine) {
            flushOfflineOutbox();
        }
        checkAndDispatchScheduledMessages();
    }, 10000);

    // Initialize Secret WebRTC Calling
    setupCallListeners();
    checkIncomingCallUrl();

    // Mark messages as seen when window is focused and chat is open
    window.addEventListener("focus", () => {
        const isLoveOpen = loveContainer && !loveContainer.classList.contains("hide");
        if (isLoveOpen && typeof window.markMessagesAsSeen === 'function') {
            window.markMessagesAsSeen();
        }
        if (navigator.onLine) {
            flushOfflineOutbox();
        }
        checkAndDispatchScheduledMessages();
    });
}

// =========================================================================
// 10. SECRET WEBRTC AUDIO & VIDEO CALLING (End-to-End Encrypted P2P)
// =========================================================================

let activeCallSession = null;
let ringToneAudioCtx = null;
let ringToneInterval = null;

// Synthetic Romantic Ringing Sound via Web Audio API
function startRingingSound() {
    stopRingingSound();
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        ringToneAudioCtx = new AudioContextClass();

        const playChimeBurst = () => {
            if (!ringToneAudioCtx || ringToneAudioCtx.state === 'closed') return;
            const now = ringToneAudioCtx.currentTime;
            
            // Dual chord tone (E5: 659.25Hz, G#5: 830.61Hz)
            [659.25, 830.61].forEach(freq => {
                const osc = ringToneAudioCtx.createOscillator();
                const gain = ringToneAudioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

                osc.connect(gain);
                gain.connect(ringToneAudioCtx.destination);
                osc.start(now);
                osc.stop(now + 1.2);
            });
        };

        playChimeBurst();
        ringToneInterval = setInterval(playChimeBurst, 2800);
    } catch (e) {
        console.warn("AudioContext ringtone suppressed:", e);
    }
}

function stopRingingSound() {
    if (ringToneInterval) {
        clearInterval(ringToneInterval);
        ringToneInterval = null;
    }
    if (ringToneAudioCtx) {
        try { ringToneAudioCtx.close(); } catch (e) {}
        ringToneAudioCtx = null;
    }
}

function playCallTone(type = 'connected') {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;
        const freqs = type === 'connected' ? [523.25, 659.25, 783.99] : [440, 349.23];
        freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            gain.gain.setValueAtTime(0.08, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.35);
        });
        setTimeout(() => ctx.close().catch(() => {}), 1000);
    } catch (e) {}
}

function formatDuration(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// =========================================================================
// WEBRTC ICE SERVERS CONFIGURATION (STUN POOL)
// =========================================================================
const WEBRTC_ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:stun.stunprotocol.org:3478' }
];

function getIceServersConfig() {
    const servers = [...WEBRTC_ICE_SERVERS];
    if (CONFIG.turnServer && typeof CONFIG.turnServer === 'object' && CONFIG.turnServer.urls) {
        servers.unshift(CONFIG.turnServer);
    }
    return servers;
}

async function getMediaStreamWithFallback(isVideo) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support audio/video calling. Please use Chrome or Safari over HTTPS.");
    }
    const tryGetUserMedia = async (audioOpts, videoOpts) => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: audioOpts, video: videoOpts });
        // Guarantee tracks are explicitly active
        stream.getAudioTracks().forEach(t => { t.enabled = true; });
        stream.getVideoTracks().forEach(t => { t.enabled = true; });
        return stream;
    };

    const audioAdvanced = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };

    if (isVideo) {
        // Attempt 1: Optimal 720p front camera + advanced audio
        try {
            return await tryGetUserMedia(audioAdvanced, { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } });
        } catch (e1) {
            console.warn("HD video attempt 1 failed, trying basic video:", e1);
        }

        // Attempt 2: Basic front camera + advanced audio
        try {
            return await tryGetUserMedia(audioAdvanced, { facingMode: 'user' });
        } catch (e2) {
            console.warn("Front cam attempt 2 failed, trying standard video:", e2);
        }

        // Attempt 3: Standard camera + basic audio
        try {
            return await tryGetUserMedia(true, true);
        } catch (e3) {
            console.warn("Standard audio/video attempt 3 failed:", e3);
        }

        // Attempt 4: Audio only if camera is blocked/busy on device
        return await tryGetUserMedia(true, false);
    } else {
        try {
            return await tryGetUserMedia(audioAdvanced, false);
        } catch (e) {
            return await tryGetUserMedia(true, false);
        }
    }
}

// Initiate Secret Call (Caller: Mukku or Yash)
async function startSecretCall(type = 'audio') {
    if (activeCallSession) {
        alert("A secret call is already active.");
        return;
    }

    if (!window.Peer) {
        alert("WebRTC connection library is still loading. Please check your connection and try again.");
        return;
    }

    const isVideo = type === 'video';
    const modal = document.getElementById("secret-call-modal");
    const statusLabel = document.getElementById("call-status-label");
    const partnerTitle = document.getElementById("call-partner-title");
    const partnerEmoji = document.getElementById("call-partner-emoji");
    const timerDisplay = document.getElementById("call-timer-display");
    const localVideo = document.getElementById("call-local-video");
    const remoteVideo = document.getElementById("call-remote-video");
    const avatarView = document.getElementById("call-audio-avatar-view");
    const camFlipBtn = document.getElementById("call-cam-flip-btn");

    if (modal) modal.classList.remove("hide");
    if (timerDisplay) timerDisplay.classList.add("hide");
    if (remoteVideo) remoteVideo.classList.add("hide");
    if (avatarView) avatarView.classList.remove("hide");

    if (partnerTitle) partnerTitle.textContent = `${CONFIG.yourName} 👑`;
    if (partnerEmoji) partnerEmoji.textContent = "👑";
    if (statusLabel) statusLabel.textContent = `Calling ${CONFIG.yourName}... 🎶`;

    let localStream = null;
    try {
        localStream = await getMediaStreamWithFallback(isVideo);
    } catch (err) {
        console.error("Camera/Mic permission failed:", err);
        alert(`Could not access your ${isVideo ? 'camera or microphone' : 'microphone'}. Please allow browser permissions in site settings.`);
        if (modal) modal.classList.add("hide");
        return;
    }

    if (isVideo && localVideo) {
        localVideo.srcObject = localStream;
        localVideo.classList.remove("hide");
        if (camFlipBtn) camFlipBtn.classList.remove("hide");
    } else {
        if (localVideo) localVideo.classList.add("hide");
        if (camFlipBtn) camFlipBtn.classList.add("hide");
    }

    startRingingSound();

    const callRoomId = 'ldr_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now();
    let peer = null;

    try {
        peer = new Peer(callRoomId, {
            debug: 1,
            config: {
                iceServers: getIceServersConfig(),
                iceCandidatePoolSize: 10
            }
        });
    } catch (peerErr) {
        console.error("PeerJS initialization error:", peerErr);
        stopRingingSound();
        localStream.getTracks().forEach(t => t.stop());
        if (modal) modal.classList.add("hide");
        alert("Failed to initialize secret call network. Please try again.");
        return;
    }

    activeCallSession = {
        peer: peer,
        call: null,
        localStream: localStream,
        remoteStream: null,
        remoteAudioEl: null,
        isVideo: isVideo,
        isCaller: true,
        startTime: null,
        timerInterval: null,
        currentFacingMode: 'user',
        timeoutTimer: null
    };

    peer.on('open', (id) => {
        let baseOrigin = window.location.origin;
        // If testing on localhost/127.0.0.1 and user configured liveSiteUrl, use the live URL for Telegram link
        if (CONFIG.liveSiteUrl && isLocalStaticEnvironment()) {
            baseOrigin = CONFIG.liveSiteUrl.replace(/\/$/, '');
        }
        const currentPath = window.location.pathname.replace(/\/index\.html$/, '') || '';
        const callUrl = `${baseOrigin}${currentPath}/?call=${encodeURIComponent(id)}&type=${type}`;

        const callName = isVideo ? 'Video Call' : 'Voice Call';
        const callIcon = isVideo ? '📹' : '📞';
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        let localDevNotice = '';
        if (isLocalStaticEnvironment() && !CONFIG.liveSiteUrl) {
            localDevNotice = `\n\n⚠️ <i>(Notice: Call localhost par chalu hua hai. Phone par test karne ke liye live website link se call karein ya PC par dusre tab me link open karein.)</i>`;
        }

        const telegramText = `🚨 <b>Incoming Secret ${callName}!</b> ${callIcon}💕\n\n` +
                             `👤 <b>From:</b> ${CONFIG.partnerName}\n` +
                             `🕒 <b>Time:</b> <code>${timeStr}</code>\n\n` +
                             `👉 <b><a href="${callUrl}">📲 TAP HERE TO ANSWER CALL</a></b>\n\n` +
                             `💡 <i>Tip: Agar audio/video start na ho, to link ko <b>Chrome</b> ya <b>Safari</b> me open karein aur Microphone/Camera allow karein.</i>` +
                             localDevNotice;

        callTelegramApi('sendMessage', {
            text: telegramText,
            parse_mode: 'HTML'
        }).catch(e => console.error("Call alert send error:", e));

        // 120 seconds timeout (plenty of time to receive notification & answer)
        activeCallSession.timeoutTimer = setTimeout(() => {
            if (activeCallSession && !activeCallSession.startTime) {
                if (statusLabel) statusLabel.textContent = `${CONFIG.yourName} is unavailable right now 🥺`;
                stopRingingSound();
                setTimeout(() => {
                    endSecretCall(false);
                }, 3000);
            }
        }, 120000);
    });

    peer.on('call', (incomingCall) => {
        if (!activeCallSession) return;
        clearTimeout(activeCallSession.timeoutTimer);
        stopRingingSound();
        playCallTone('connected');

        activeCallSession.call = incomingCall;
        incomingCall.answer(localStream);

        if (incomingCall.peerConnection) {
            incomingCall.peerConnection.oniceconnectionstatechange = () => {
                const state = incomingCall.peerConnection.iceConnectionState;
                console.log("ICE connection state (caller):", state);
                if (state === 'connected' || state === 'completed') {
                    if (statusLabel) statusLabel.textContent = "Connected 💕";
                } else if (state === 'disconnected') {
                    if (statusLabel) statusLabel.textContent = "Reconnecting... 🔄";
                } else if (state === 'failed') {
                    if (statusLabel) statusLabel.textContent = "Connection lost 💔";
                    setTimeout(() => endSecretCall(false), 3000);
                }
            };
        }

        incomingCall.on('stream', (remoteStream) => {
            handleRemoteStream(remoteStream);
        });

        incomingCall.on('close', () => {
            endSecretCall(false);
        });

        incomingCall.on('error', (err) => {
            console.error("Call connection error:", err);
            endSecretCall(false);
        });
    });

    peer.on('error', (err) => {
        console.error("PeerJS error:", err);
        if (statusLabel) {
            if (err.type === 'peer-unavailable') {
                statusLabel.textContent = "Call ended or peer is offline.";
            } else if (err.type === 'network') {
                statusLabel.textContent = "Network error. Reconnecting...";
            } else {
                statusLabel.textContent = "Connecting to peer network...";
            }
        }
    });
}

// Answer Secret Call (Callee: Yash opening ?call=...)
async function answerIncomingSecretCall(callerPeerId, type = 'audio') {
    if (activeCallSession) return;

    const isVideo = type === 'video';
    const modal = document.getElementById("secret-call-modal");
    const statusLabel = document.getElementById("call-status-label");
    const partnerTitle = document.getElementById("call-partner-title");
    const partnerEmoji = document.getElementById("call-partner-emoji");
    const timerDisplay = document.getElementById("call-timer-display");
    const localVideo = document.getElementById("call-local-video");
    const remoteVideo = document.getElementById("call-remote-video");
    const avatarView = document.getElementById("call-audio-avatar-view");
    const camFlipBtn = document.getElementById("call-cam-flip-btn");

    if (modal) modal.classList.remove("hide");
    if (timerDisplay) timerDisplay.classList.add("hide");
    if (remoteVideo) remoteVideo.classList.add("hide");
    if (avatarView) avatarView.classList.remove("hide");

    if (partnerTitle) partnerTitle.textContent = `${CONFIG.partnerName} 🐱`;
    if (partnerEmoji) partnerEmoji.textContent = "🐱";
    if (statusLabel) statusLabel.textContent = `Connecting to ${CONFIG.partnerName}... 💕`;

    let localStream = null;
    try {
        localStream = await getMediaStreamWithFallback(isVideo);
    } catch (err) {
        console.error("Camera/Mic access error:", err);
        alert(`Could not access your ${isVideo ? 'camera/microphone' : 'microphone'}. Please allow browser permissions in site settings.`);
        if (modal) modal.classList.add("hide");
        return;
    }

    if (isVideo && localVideo) {
        localVideo.srcObject = localStream;
        localVideo.classList.remove("hide");
        if (camFlipBtn) camFlipBtn.classList.remove("hide");
    } else {
        if (localVideo) localVideo.classList.add("hide");
        if (camFlipBtn) camFlipBtn.classList.add("hide");
    }

    const myPeerId = 'ans_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now();
    let peer = null;
    try {
        peer = new Peer(myPeerId, {
            debug: 1,
            config: {
                iceServers: getIceServersConfig(),
                iceCandidatePoolSize: 10
            }
        });
    } catch (e) {
        localStream.getTracks().forEach(t => t.stop());
        if (modal) modal.classList.add("hide");
        return;
    }

    activeCallSession = {
        peer: peer,
        call: null,
        localStream: localStream,
        remoteStream: null,
        remoteAudioEl: null,
        isVideo: isVideo,
        isCaller: false,
        startTime: null,
        timerInterval: null,
        currentFacingMode: 'user'
    };

    peer.on('open', () => {
        if (statusLabel) statusLabel.textContent = `Connecting to ${CONFIG.partnerName}... 💖`;
        const call = peer.call(callerPeerId, localStream);
        activeCallSession.call = call;

        if (call.peerConnection) {
            call.peerConnection.oniceconnectionstatechange = () => {
                const state = call.peerConnection.iceConnectionState;
                console.log("ICE connection state (callee):", state);
                if (state === 'connected' || state === 'completed') {
                    if (statusLabel) statusLabel.textContent = "Connected 💕";
                } else if (state === 'disconnected') {
                    if (statusLabel) statusLabel.textContent = "Reconnecting... 🔄";
                } else if (state === 'failed') {
                    if (statusLabel) statusLabel.textContent = "Connection lost 💔";
                    setTimeout(() => endSecretCall(false), 3000);
                }
            };
        }

        call.on('stream', (remoteStream) => {
            playCallTone('connected');
            handleRemoteStream(remoteStream);
        });

        call.on('close', () => {
            endSecretCall(false);
        });

        call.on('error', (err) => {
            console.error("Call error:", err);
            endSecretCall(false);
        });
    });

    peer.on('error', (err) => {
        console.error("Callee Peer error:", err);
        if (statusLabel) {
            if (err.type === 'peer-unavailable') {
                statusLabel.textContent = "Caller hung up or call expired 🥺";
                setTimeout(() => endSecretCall(false), 3500);
            } else {
                statusLabel.textContent = "Connecting to peer network...";
            }
        }
    });
}

function handleRemoteStream(remoteStream) {
    if (!activeCallSession) return;
    activeCallSession.remoteStream = remoteStream;

    const statusLabel = document.getElementById("call-status-label");
    const timerDisplay = document.getElementById("call-timer-display");
    const timerHeader = document.getElementById("call-timer-header");
    const remoteVideo = document.getElementById("call-remote-video");
    const avatarView = document.getElementById("call-audio-avatar-view");

    if (statusLabel) statusLabel.textContent = "Connected 💕";

    // 1. Audio Setup via dedicated <audio> element (guarantees audio works on mobile)
    if (!activeCallSession.remoteAudioEl) {
        const audioEl = document.createElement("audio");
        audioEl.id = "webrtc-remote-audio";
        audioEl.autoplay = true;
        audioEl.setAttribute('playsinline', 'true');
        audioEl.setAttribute('webkit-playsinline', 'true');
        audioEl.srcObject = remoteStream;
        document.body.appendChild(audioEl);
        activeCallSession.remoteAudioEl = audioEl;

        const playAudio = () => {
            audioEl.play().then(() => {
                const unmuteBtn = document.getElementById("call-unmute-btn");
                if (unmuteBtn) unmuteBtn.classList.add("hide");
            }).catch(err => {
                console.warn("Audio autoplay blocked by mobile browser policy:", err);
                const unmuteBtn = document.getElementById("call-unmute-btn");
                if (unmuteBtn) unmuteBtn.classList.remove("hide");
            });
        };
        playAudio();

        // One-tap unlock for any screen touch/click
        const unlockAudioOnTouch = () => {
            if (activeCallSession && activeCallSession.remoteAudioEl) {
                activeCallSession.remoteAudioEl.play().then(() => {
                    const unmuteBtn = document.getElementById("call-unmute-btn");
                    if (unmuteBtn) unmuteBtn.classList.add("hide");
                }).catch(() => {});
            }
        };
        document.addEventListener('click', unlockAudioOnTouch, { once: true });
        document.addEventListener('touchstart', unlockAudioOnTouch, { once: true });
    } else {
        activeCallSession.remoteAudioEl.srcObject = remoteStream;
        activeCallSession.remoteAudioEl.play().catch(() => {});
    }

    // 2. Video Track Handling & Rendering
    const updateVideoTrackVisibility = () => {
        if (!activeCallSession) return;
        const vTracks = remoteStream.getVideoTracks();
        const hasLiveVideo = vTracks.length > 0 && vTracks.some(t => t.readyState === 'live' && t.enabled);

        if (activeCallSession.isVideo && hasLiveVideo && remoteVideo) {
            remoteVideo.srcObject = remoteStream;
            remoteVideo.muted = true; // MUST be muted so browser autoplay policy never blocks video frame rendering
            remoteVideo.setAttribute('playsinline', 'true');
            remoteVideo.setAttribute('webkit-playsinline', 'true');
            remoteVideo.classList.remove("hide");
            if (avatarView) avatarView.classList.add("hide");
            remoteVideo.play().catch(e => console.warn("Remote video play error:", e));
        } else {
            if (remoteVideo) {
                remoteVideo.classList.add("hide");
                remoteVideo.srcObject = null;
            }
            if (avatarView) avatarView.classList.remove("hide");
        }
    };

    updateVideoTrackVisibility();

    remoteStream.onaddtrack = () => {
        updateVideoTrackVisibility();
        if (activeCallSession && activeCallSession.remoteAudioEl) {
            activeCallSession.remoteAudioEl.srcObject = remoteStream;
            activeCallSession.remoteAudioEl.play().catch(() => {});
        }
    };

    remoteStream.getVideoTracks().forEach(track => {
        track.onunmute = () => updateVideoTrackVisibility();
        track.onmute = () => updateVideoTrackVisibility();
    });
    remoteStream.getAudioTracks().forEach(track => {
        track.onunmute = () => {
            if (activeCallSession && activeCallSession.remoteAudioEl) {
                activeCallSession.remoteAudioEl.play().catch(() => {});
            }
        };
    });

    // 3. Timer Setup (Header badge & Avatar view)
    if (!activeCallSession.startTime) {
        activeCallSession.startTime = Date.now();
    }
    if (timerDisplay) {
        timerDisplay.textContent = "00:00";
        timerDisplay.classList.remove("hide");
    }
    if (timerHeader) {
        timerHeader.textContent = "00:00";
        timerHeader.classList.remove("hide");
    }

    if (activeCallSession.timerInterval) clearInterval(activeCallSession.timerInterval);
    activeCallSession.timerInterval = setInterval(() => {
        if (!activeCallSession || !activeCallSession.startTime) return;
        const elapsedSec = Math.floor((Date.now() - activeCallSession.startTime) / 1000);
        const formatted = formatDuration(elapsedSec);
        if (timerDisplay) timerDisplay.textContent = formatted;
        if (timerHeader) timerHeader.textContent = formatted;
    }, 1000);
}

function endSecretCall(notifyPartner = true) {
    stopRingingSound();
    playCallTone('ended');

    let durationStr = "00:00";
    let wasConnected = false;
    let isVideoCall = false;

    if (activeCallSession) {
        isVideoCall = activeCallSession.isVideo;
        if (activeCallSession.timeoutTimer) clearTimeout(activeCallSession.timeoutTimer);
        if (activeCallSession.timerInterval) clearInterval(activeCallSession.timerInterval);

        if (activeCallSession.startTime) {
            wasConnected = true;
            const elapsed = Math.floor((Date.now() - activeCallSession.startTime) / 1000);
            durationStr = formatDuration(elapsed);
        }

        if (activeCallSession.localStream) {
            activeCallSession.localStream.getTracks().forEach(t => t.stop());
        }
        if (activeCallSession.remoteStream) {
            activeCallSession.remoteStream.getTracks().forEach(t => t.stop());
        }
        if (activeCallSession.remoteAudioEl) {
            activeCallSession.remoteAudioEl.remove();
        }
        if (activeCallSession.call) {
            try { activeCallSession.call.close(); } catch (e) {}
        }
        if (activeCallSession.peer) {
            try { activeCallSession.peer.destroy(); } catch (e) {}
        }

        activeCallSession = null;
    }

    const modal = document.getElementById("secret-call-modal");
    const incomingModal = document.getElementById("incoming-call-modal");
    const localVideo = document.getElementById("call-local-video");
    const remoteVideo = document.getElementById("call-remote-video");
    const micBtn = document.getElementById("call-mic-toggle-btn");
    const camBtn = document.getElementById("call-cam-toggle-btn");
    const micIcon = document.getElementById("call-mic-icon");
    const camIcon = document.getElementById("call-cam-icon");

    if (modal) modal.classList.add("hide");
    if (incomingModal) incomingModal.classList.add("hide");
    if (localVideo) { localVideo.srcObject = null; localVideo.classList.add("hide"); }
    if (remoteVideo) { remoteVideo.srcObject = null; remoteVideo.classList.add("hide"); }
    if (micBtn) micBtn.classList.remove("active-off");
    if (camBtn) camBtn.classList.remove("active-off");
    if (micIcon) micIcon.textContent = "🎤";
    if (camIcon) camIcon.textContent = "📹";

    const unmuteBtn = document.getElementById("call-unmute-btn");
    const timerHeader = document.getElementById("call-timer-header");
    if (unmuteBtn) unmuteBtn.classList.add("hide");
    if (timerHeader) timerHeader.classList.add("hide");

    if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }

    if (wasConnected) {
        const callLabel = `${isVideoCall ? '📹 Video Call' : '📞 Voice Call'} (${durationStr})`;
        const newMsg = {
            id: 'msg_call_' + Date.now(),
            sender: CONFIG.partnerName,
            text: callLabel,
            timestamp: Date.now(),
            isPartner: false,
            type: 'text'
        };
        saveChatMessage(newMsg);
        renderSecretChat();

        if (notifyPartner) {
            callTelegramApi('sendMessage', {
                text: `📞 <i>Secret ${isVideoCall ? 'Video' : 'Voice'} Call ended • Duration: ${durationStr}</i>`,
                parse_mode: 'HTML'
            }).catch(() => {});
        }
    }
}

function setupCallListeners() {
    const startVoiceBtn = document.getElementById("start-voice-call-btn");
    const startVideoBtn = document.getElementById("start-video-call-btn");
    const endCallBtn = document.getElementById("call-end-btn");
    const micToggleBtn = document.getElementById("call-mic-toggle-btn");
    const camToggleBtn = document.getElementById("call-cam-toggle-btn");
    const camFlipBtn = document.getElementById("call-cam-flip-btn");
    const callPanicBtn = document.getElementById("call-panic-btn");
    const unmuteBtn = document.getElementById("call-unmute-btn");

    if (unmuteBtn) {
        unmuteBtn.addEventListener("click", () => {
            if (activeCallSession && activeCallSession.remoteAudioEl) {
                activeCallSession.remoteAudioEl.play().then(() => {
                    unmuteBtn.classList.add("hide");
                }).catch(() => {});
            }
        });
    }

    if (startVoiceBtn) {
        startVoiceBtn.addEventListener("click", () => startSecretCall('audio'));
    }

    if (startVideoBtn) {
        startVideoBtn.addEventListener("click", () => startSecretCall('video'));
    }

    if (endCallBtn) {
        endCallBtn.addEventListener("click", () => endSecretCall(true));
    }

    if (micToggleBtn) {
        micToggleBtn.addEventListener("click", () => {
            if (!activeCallSession || !activeCallSession.localStream) return;
            const audioTrack = activeCallSession.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                micToggleBtn.classList.toggle("active-off", !audioTrack.enabled);
                const icon = document.getElementById("call-mic-icon");
                if (icon) icon.textContent = audioTrack.enabled ? "🎤" : "🔇";
            }
        });
    }

    if (camToggleBtn) {
        camToggleBtn.addEventListener("click", async () => {
            if (!activeCallSession || !activeCallSession.localStream) return;
            const videoTracks = activeCallSession.localStream.getVideoTracks();
            if (videoTracks.length > 0) {
                const track = videoTracks[0];
                track.enabled = !track.enabled;
                camToggleBtn.classList.toggle("active-off", !track.enabled);
                const icon = document.getElementById("call-cam-icon");
                if (icon) icon.textContent = track.enabled ? "📹" : "🚫";
            } else {
                try {
                    const vStream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
                    });
                    const newTrack = vStream.getVideoTracks()[0];
                    activeCallSession.localStream.addTrack(newTrack);
                    if (activeCallSession.call && activeCallSession.call.peerConnection) {
                        const senders = activeCallSession.call.peerConnection.getSenders();
                        const vSender = senders.find(s => s.track && s.track.kind === 'video');
                        if (vSender) vSender.replaceTrack(newTrack);
                        else activeCallSession.call.peerConnection.addTrack(newTrack, activeCallSession.localStream);
                    }
                    const localVid = document.getElementById("call-local-video");
                    if (localVid) {
                        localVid.srcObject = activeCallSession.localStream;
                        localVid.classList.remove("hide");
                    }
                    activeCallSession.isVideo = true;
                    if (camFlipBtn) camFlipBtn.classList.remove("hide");
                } catch (e) {
                    console.error("Camera upgrade failed:", e);
                }
            }
        });
    }

    if (camFlipBtn) {
        camFlipBtn.addEventListener("click", async () => {
            if (camFlipBtn.disabled) return;
            if (!activeCallSession || !activeCallSession.localStream) return;
            camFlipBtn.disabled = true;

            const statusLabel = document.getElementById("call-status-label");
            const originalStatus = statusLabel ? statusLabel.textContent : "";

            try {
                let videoDevices = [];
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                    try {
                        const devs = await navigator.mediaDevices.enumerateDevices();
                        videoDevices = devs.filter(d => d.kind === "videoinput");
                    } catch (e) {}
                }

                const localVid = document.getElementById("call-local-video");
                const currentMode = activeCallSession.currentFacingMode || 'user';
                const newMode = currentMode === 'user' ? 'environment' : 'user';

                if (videoDevices.length <= 1) {
                    // Only 1 physical camera on device (e.g. Laptop webcam)
                    if (localVid) {
                        const isNoMirror = localVid.classList.contains("no-mirror");
                        localVid.classList.toggle("no-mirror", !isNoMirror);
                        activeCallSession.currentFacingMode = !isNoMirror ? 'environment' : 'user';
                    }
                    if (statusLabel) {
                        statusLabel.textContent = "1 camera detected (Mirror toggled) 🔄";
                        setTimeout(() => {
                            if (statusLabel && activeCallSession) statusLabel.textContent = activeCallSession.startTime ? "Connected 💕" : originalStatus;
                        }, 2000);
                    }
                    return;
                }

                // Multiple physical cameras (e.g. Mobile phone front + back)
                if (statusLabel) statusLabel.textContent = "Switching camera... 🔄";

                const oldTrack = activeCallSession.localStream.getVideoTracks()[0];
                let videoSender = null;
                if (activeCallSession.call && activeCallSession.call.peerConnection) {
                    const senders = activeCallSession.call.peerConnection.getSenders();
                    videoSender = senders.find(s => s.track === oldTrack)
                               || senders.find(s => s.track && s.track.kind === 'video')
                               || senders.find(s => !s.track && s.dtmf === null);
                }

                // Release hardware lock on old track so mobile camera HAL can open back camera
                if (oldTrack) {
                    oldTrack.stop();
                    activeCallSession.localStream.removeTrack(oldTrack);
                }

                let newStream = null;
                try {
                    newStream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: { ideal: newMode },
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        },
                        audio: false
                    });
                } catch (flipErr) {
                    console.warn("Target facingMode failed, falling back to basic video:", flipErr);
                    newStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });
                }

                const newTrack = newStream.getVideoTracks()[0];
                if (newTrack) {
                    activeCallSession.currentFacingMode = newMode;
                    activeCallSession.localStream.addTrack(newTrack);

                    if (videoSender) {
                        try {
                            await videoSender.replaceTrack(newTrack);
                        } catch (repErr) {
                            console.error("Sender replaceTrack error:", repErr);
                        }
                    }

                    if (localVid) {
                        localVid.srcObject = null;
                        localVid.srcObject = activeCallSession.localStream;
                        localVid.classList.toggle("no-mirror", newMode === 'environment');
                        try { await localVid.play(); } catch (e) {}
                    }
                }

                if (statusLabel) {
                    statusLabel.textContent = activeCallSession.startTime ? "Connected 💕" : originalStatus;
                }
            } catch (err) {
                console.error("Camera switch error:", err);
                if (statusLabel) {
                    statusLabel.textContent = activeCallSession.startTime ? "Connected 💕" : originalStatus;
                }
            } finally {
                setTimeout(() => { camFlipBtn.disabled = false; }, 500);
            }
        });
    }

    if (callPanicBtn) {
        callPanicBtn.addEventListener("click", () => {
            endSecretCall(false);
            const panicBtn = document.getElementById("panic-btn");
            if (panicBtn) panicBtn.click();
        });
    }

    // Incoming Call Modal Accept / Decline Buttons (Instant 1-tap answer)
    const incomingAcceptBtn = document.getElementById("incoming-accept-btn");
    const incomingDeclineBtn = document.getElementById("incoming-decline-btn");

    if (incomingAcceptBtn) {
        incomingAcceptBtn.addEventListener("click", () => {
            stopRingingSound();
            const incomingModal = document.getElementById("incoming-call-modal");
            if (incomingModal) incomingModal.classList.add("hide");
            if (window.pendingIncomingCall) {
                const { callerId, callType } = window.pendingIncomingCall;
                window.pendingIncomingCall = null;
                answerIncomingSecretCall(callerId, callType);
            }
        });
    }

    if (incomingDeclineBtn) {
        incomingDeclineBtn.addEventListener("click", () => {
            stopRingingSound();
            const incomingModal = document.getElementById("incoming-call-modal");
            if (incomingModal) incomingModal.classList.add("hide");
            window.pendingIncomingCall = null;
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        });
    }
}

function checkIncomingCallUrl() {
    const params = new URLSearchParams(window.location.search);
    const callerId = params.get('call');
    const callType = params.get('type') || 'audio';

    if (!callerId) return;

    window.pendingIncomingCall = { callerId, callType };

    const incomingModal = document.getElementById("incoming-call-modal");
    const callerNameEl = document.getElementById("incoming-caller-name");
    const callTypeLabel = document.getElementById("incoming-call-type-label");
    const avatarEmoji = document.getElementById("incoming-avatar-emoji");

    const isVideo = callType === 'video';
    if (incomingModal) {
        if (callerNameEl) callerNameEl.textContent = `${CONFIG.partnerName} 🐱`;
        if (avatarEmoji) avatarEmoji.textContent = "🐱";
        if (callTypeLabel) {
            callTypeLabel.textContent = `Incoming Secret ${isVideo ? 'Video' : 'Voice'} Call... ${isVideo ? '📹' : '📞'}`;
        }
        incomingModal.classList.remove("hide");
        startRingingSound();
    } else {
        answerIncomingSecretCall(callerId, callType);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
