// =========================================================================
// ❤️ CONFIGURATION - CUSTOMIZE YOURSurprise HERE!
// =========================================================================
const CONFIG = {
    partnerName: "Mukku",               // Your girlfriend's name (displays in heading/letter)
    yourName: "Yash",                   // Your name (signature on the letter)
    passcode: "2603",                   // The secret code to unlock the private page (e.g. your anniversary date)

    // SECRET TELEGRAM UPDATES (Ninja Mode)
    // 1. Search @BotFather on Telegram, send /newbot, create a bot to get your Token.
    // 2. Search @userinfobot on Telegram, send /start to get your Chat ID.
    telegramBotToken: "8234605358:AAFMtO2nTnFS-UYOIMpUyb-K43o2cu4ew3E",               // Paste your bot token here
    telegramChatId: "8935359444",                 // Paste your chat ID here

    // LDR Settings
    yourLocation: "Lucknow",            // Where you live
    partnerLocation: "Sahar",           // Where she lives
    distanceText: "126 km",             // Distance between you two
    relationshipStartDate: "2026-03-27", // YYYY-MM-DD - When you guys started dating
    nextMeetDate: "2026-09-27",         // YYYY-MM-DD - Next time you'll see each other (set to empty "" to hide countdown)

    whatsappNumber: "919919480574",     // Your phone number with country code (no +, spaces, or dashes)

    // Heartfelt Letter Paragraphs
    letterParagraphs: [
        "meri mukku darling my love my life mujhe pata hai girlfrind ek bohot chota word hai jo tumhe define kar payega lekin tum mere liye bohot jyada khaas ho tumhara meri life me hona bhagwan ke hone se kam nhi hai",
        "mujhe pata hai abhi hum door hai lekin dono mehnat krte rhenge aur dono ek doosre ka saath hasil kr lenege khoob sara ghoomenge khoob sara khayenge aur khoob sara pyaar kiya krenge",
        "my love my wife my universe i love you bohot bohot bohot bohot saraa",
        "love you meri jaan mera babu meri shona meri cuta patuta"
    ]
};

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
    passcodeInput.focus();
    passcodeError.classList.add("hide");
    passcodeInput.value = "";
}

function closeUnlockModal() {
    passcodeModal.classList.add("hide");
    passcodeInput.value = "";
    passcodeError.classList.add("hide");
}

window.markMessagesAsSeen = function() {
    if (!CONFIG.telegramBotToken || !CONFIG.telegramChatId) return;
    const history = getChatHistory();
    let updated = false;

    history.forEach(msg => {
        if (msg.isPartner && !msg.botReacted && msg.telegramMessageId) {
            msg.botReacted = true;
            updated = true;
            fetch(`https://api.telegram.org/bot${CONFIG.telegramBotToken}/setMessageReaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CONFIG.telegramChatId,
                    message_id: msg.telegramMessageId,
                    reaction: [{ type: "emoji", emoji: "👀" }]
                })
            }).catch(e => console.error("Reaction failed:", e));
        }
    });

    if (updated) {
        localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
    }
};

function verifyPasscode() {
    const entered = passcodeInput.value.trim();
    if (entered === CONFIG.passcode) {
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
            checkTelegramReplies(); // Fresh check
        }, 400);
    } else {
        // Incorrect passcode
        passcodeError.classList.remove("hide");
        passcodeInput.value = "";
        passcodeInput.focus();

        // Shake modal card slightly for premium feel
        const card = passcodeModal.querySelector(".modal-card");
        card.classList.add("shake");
        setTimeout(() => card.classList.remove("shake"), 500);
    }
}

if (privateLockBtn) privateLockBtn.addEventListener("click", openUnlockModal);
if (closePasscodeBtn) closePasscodeBtn.addEventListener("click", closeUnlockModal);
if (verifyPasscodeBtn) verifyPasscodeBtn.addEventListener("click", verifyPasscode);

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
        { name: "Mochi Hug", url: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif", emoji: "😻", isAnim: true },
        { name: "Love Hearts", url: "https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif", emoji: "🐱", isAnim: true },
        { name: "Cat Cuddle", url: "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif", emoji: "🐾", isAnim: true },
        { name: "Cat Heart Eyes", url: "https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif", emoji: "😻", isAnim: true },
        { name: "Cute Peck Kiss", url: "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif", emoji: "😽", isAnim: true },
        { name: "Cheek Kiss", url: "https://media.giphy.com/media/3oT0Fsr4bB1wK4m63e/giphy.gif", emoji: "😘", isAnim: true },
        { name: "Cute Roll", url: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif", emoji: "😺", isAnim: true },
        { name: "Happy Dance", url: "https://media.giphy.com/media/g5qEgeTM20WPm/giphy.gif", emoji: "💃", isAnim: true }
    ],
    love: [
        { name: "Blowing Kiss", url: "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif", emoji: "💋", isAnim: true },
        { name: "Love You Forever", url: "https://media.giphy.com/media/R6gVNROjBy4UM/giphy.gif", emoji: "💖", isAnim: true },
        { name: "Warm Cuddle", url: "https://media.giphy.com/media/l2Je2M4Nfrit0L7sQ/giphy.gif", emoji: "🫂", isAnim: true },
        { name: "Heart Pop", url: "https://media.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif", emoji: "💓", isAnim: true },
        { name: "Sparkle Love", url: "https://media.giphy.com/media/l41JWw65TcBGjPpRK/giphy.gif", emoji: "✨", isAnim: true },
        { name: "Couple Blanket", url: "https://media.giphy.com/media/26xBI73gWquCBBCDe/giphy.gif", emoji: "🥰", isAnim: true }
    ],
    bears: [
        { name: "Bear Hug", url: "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif", emoji: "🧸", isAnim: true },
        { name: "Pouty Love", url: "https://media.giphy.com/media/3oEjI4sFlIE732SHEY/giphy.gif", emoji: "🥺", isAnim: true },
        { name: "Warm Cuddle", url: "https://media.giphy.com/media/l2Je2M4Nfrit0L7sQ/giphy.gif", emoji: "🐻", isAnim: true },
        { name: "Happy Dance", url: "https://media.giphy.com/media/g5qEgeTM20WPm/giphy.gif", emoji: "✨", isAnim: true }
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

// In-memory cache for Telegram file URLs
const telegramFileUrlCache = {};
const audioBlobCache = {};

async function resolveTelegramFileUrl(fileId) {
    if (!fileId || !CONFIG.telegramBotToken) return null;
    const now = Date.now();
    if (telegramFileUrlCache[fileId] && (now - telegramFileUrlCache[fileId].ts < 3000000)) return telegramFileUrlCache[fileId].url;

    try {
        const localCache = JSON.parse(localStorage.getItem('studyflow_file_cache_v2') || '{}');
        if (localCache[fileId] && (now - localCache[fileId].ts < 3000000)) {
            telegramFileUrlCache[fileId] = localCache[fileId];
            return localCache[fileId].url;
        }
    } catch (e) {}

    try {
        const res = await fetch(`https://api.telegram.org/bot${CONFIG.telegramBotToken}/getFile?file_id=${fileId}`);
        const data = await res.json();
        if (data.ok && data.result && data.result.file_path) {
            const fileUrl = `https://api.telegram.org/file/bot${CONFIG.telegramBotToken}/${data.result.file_path}`;
            const cacheObj = { url: fileUrl, ts: now };
            telegramFileUrlCache[fileId] = cacheObj;
            
            try {
                const localCache = JSON.parse(localStorage.getItem('studyflow_file_cache_v2') || '{}');
                localCache[fileId] = cacheObj;
                localStorage.setItem('studyflow_file_cache_v2', JSON.stringify(localCache));
            } catch (e) {}

            return fileUrl;
        }
    } catch (e) {
        console.error("Failed to resolve Telegram file URL:", e);
    }
    return null;
}

function getChatHistory() {
    try {
        return JSON.parse(localStorage.getItem('studyflow_chat_history')) || [];
    } catch (e) {
        return [];
    }
}

function saveChatMessage(msg) {
    const history = getChatHistory();
    if (!history.some(m => m.id === msg.id)) {
        history.push(msg);
        localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
    }
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
            if (msg.stickerUrl) {
                bubbleContent = `
                    <div class="chat-bubble sticker-bubble">
                        <img src="${escapeHTML(msg.stickerUrl)}" alt="${escapeHTML(msg.stickerEmoji || 'sticker')}" class="chat-sticker-img" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-block';">
                        <span class="sticker-fallback-emoji" style="display:none;">${escapeHTML(msg.stickerEmoji || '💖')}</span>
                    </div>
                `;
            } else if (msg.stickerEmoji && !msg.stickerFileId) {
                bubbleContent = `
                    <div class="chat-bubble sticker-bubble">
                        <span class="sticker-fallback-emoji">${escapeHTML(msg.stickerEmoji)}</span>
                    </div>
                `;
            } else {
                bubbleContent = `
                    <div class="chat-bubble sticker-bubble">
                        <div class="sticker-loading-placeholder">
                            <span class="sticker-fallback-emoji">${escapeHTML(msg.stickerEmoji || '✨')}</span>
                            <span class="sticker-loading-spinner"></span>
                        </div>
                    </div>
                `;
                if (msg.stickerFileId) {
                    resolveTelegramFileUrl(msg.stickerFileId).then(url => {
                        if (url) {
                            const curHistory = getChatHistory();
                            const item = curHistory.find(m => m.id === msg.id);
                            if (item) {
                                item.stickerUrl = url;
                                localStorage.setItem('studyflow_chat_history', JSON.stringify(curHistory));
                                renderSecretChat();
                            }
                        }
                    });
                }
            }
        } else if (msg.type === 'photo') {
            const captionHtml = msg.text ? `<div class="chat-media-caption">${escapeHTML(msg.text)}</div>` : '';
            if (msg.stickerUrl) {
                bubbleContent = `
                    <div class="chat-bubble photo-bubble">
                        <img src="${escapeHTML(msg.stickerUrl)}" alt="Photo" class="chat-sticker-img" loading="lazy">
                        ${captionHtml}
                    </div>
                `;
            } else {
                bubbleContent = `
                    <div class="chat-bubble photo-bubble">
                        <div class="sticker-loading-placeholder">
                            <span class="sticker-fallback-emoji">📷</span>
                            <span class="sticker-loading-spinner"></span>
                        </div>
                        ${captionHtml}
                    </div>
                `;
                if (msg.stickerFileId) {
                    resolveTelegramFileUrl(msg.stickerFileId).then(url => {
                        if (url) {
                            const curHistory = getChatHistory();
                            const item = curHistory.find(m => m.id === msg.id);
                            if (item) {
                                item.stickerUrl = url;
                                localStorage.setItem('studyflow_chat_history', JSON.stringify(curHistory));
                                renderSecretChat();
                            }
                        }
                    });
                }
            }
        } else if (msg.type === 'voice') {
            if (msg.stickerUrl) {
                bubbleContent = `
                    <div class="chat-bubble audio-bubble" style="padding: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;">
                        <audio controls style="max-width: 100%; height: 40px;" src="${escapeHTML(msg.stickerUrl)}">
                        </audio>
                        <a href="${escapeHTML(msg.stickerUrl)}" target="_blank" style="font-size: 0.65rem; color: var(--disguise-text-muted); text-align: right; text-decoration: underline;">Download Audio</a>
                    </div>
                `;
            } else {
                bubbleContent = `
                    <div class="chat-bubble audio-bubble" style="padding: 0.5rem;">
                        <div class="sticker-loading-placeholder">
                            <span class="sticker-fallback-emoji">🎤</span>
                            <span class="sticker-loading-spinner"></span>
                        </div>
                    </div>
                `;
                if (msg.stickerFileId) {
                    resolveTelegramFileUrl(msg.stickerFileId).then(url => {
                        if (url) {
                            const curHistory = getChatHistory();
                            const item = curHistory.find(m => m.id === msg.id);
                            if (item) {
                                item.stickerUrl = url;
                                localStorage.setItem('studyflow_chat_history', JSON.stringify(curHistory));
                                renderSecretChat();
                            }
                        }
                    });
                }
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

        let seenHtml = '';
        if (!msg.isPartner && msg.seen) {
            seenHtml = `<span style="font-size: 0.7rem; color: #3b82f6; font-weight: 600; display:flex; align-items:center; gap:0.1rem; margin-left: 0.2rem;">✓✓ Seen</span>`;
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
                ${seenHtml}
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

    // Record Mukku's message into local chat history
    const newMsg = {
        id: 'msg_' + Date.now(),
        sender: CONFIG.partnerName,
        text: cleanMsg,
        timestamp: Date.now(),
        isPartner: false,
        replyTo: typeof activeReplyState !== 'undefined' && activeReplyState ? { text: activeReplyState.text } : null
    };
    saveChatMessage(newMsg);

    if (!CONFIG.telegramBotToken || !CONFIG.telegramChatId) {
        console.warn("Sync inactive: Missing credentials.");
        if (typeof cancelReply !== 'undefined') cancelReply();
        return;
    }
    
    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`;
    const data = {
        chat_id: CONFIG.telegramChatId,
        text: `💌 Secret Update from ${CONFIG.partnerName}:\n\n${cleanMsg}`
    };

    if (typeof activeReplyState !== 'undefined' && activeReplyState && activeReplyState.telegramId) {
        data.reply_to_message_id = parseInt(activeReplyState.telegramId);
    }
    if (typeof cancelReply !== 'undefined') cancelReply();

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.ok && data.result && data.result.message_id) {
            const history = getChatHistory();
            const item = history.find(m => m.id === newMsg.id);
            if (item) {
                item.telegramMessageId = data.result.message_id;
                localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
                renderSecretChat();
            }
        }
        setTimeout(checkTelegramReplies, 1500);
    })
    .catch(error => console.error("Cloud sync error."));
}

// === VOICE RECORDING LOGIC ===
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

function setupVoiceRecording() {
    const recordBtn = document.getElementById("chat-record-btn");
    const recordIcon = document.getElementById("record-btn-icon");
    if (!recordBtn) return;

    recordBtn.addEventListener("click", async () => {
        if (isRecording && mediaRecorder) {
            mediaRecorder.stop();
            isRecording = false;
            recordIcon.textContent = "🎤";
            recordBtn.classList.remove("recording-active");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
                if (audioBlob.size === 0) return;
                sendSecretVoice(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            isRecording = true;
            recordIcon.textContent = "🛑";
            recordBtn.classList.add("recording-active");
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access is required to send voice notes.");
        }
    });
}

function sendSecretVoice(audioBlob) {
    const objectUrl = URL.createObjectURL(audioBlob);
    
    const newMsg = {
        id: 'msg_' + Date.now(),
        sender: CONFIG.partnerName,
        text: "Voice Note 🎤",
        timestamp: Date.now(),
        isPartner: false,
        type: 'voice',
        stickerUrl: objectUrl,
        replyTo: typeof activeReplyState !== 'undefined' && activeReplyState ? { text: activeReplyState.text } : null
    };
    saveChatMessage(newMsg);

    if (!CONFIG.telegramBotToken || !CONFIG.telegramChatId) {
        console.warn("Sync inactive: Missing credentials.");
        if (typeof cancelReply !== 'undefined') cancelReply();
        return;
    }

    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendVoice`;
    const formData = new FormData();
    formData.append('chat_id', CONFIG.telegramChatId);
    formData.append('caption', `💌 Voice Note from ${CONFIG.partnerName}`);
    formData.append('voice', audioBlob, 'voice.oga');

    if (typeof activeReplyState !== 'undefined' && activeReplyState && activeReplyState.telegramId) {
        formData.append('reply_to_message_id', parseInt(activeReplyState.telegramId));
    }
    if (typeof cancelReply !== 'undefined') cancelReply();

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.ok && data.result && data.result.message_id) {
            const history = getChatHistory();
            const item = history.find(m => m.id === newMsg.id);
            if (item) {
                item.telegramMessageId = data.result.message_id;
                if (data.result.voice) {
                    item.stickerFileId = data.result.voice.file_id;
                }
                localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
                renderSecretChat();
            }
        }
        setTimeout(checkTelegramReplies, 1500);
    })
    .catch(error => console.error("Cloud sync error."));
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

    if (!CONFIG.telegramBotToken || !CONFIG.telegramChatId) {
        console.warn("Sync inactive: Missing credentials.");
        if (typeof cancelEdit !== 'undefined') cancelEdit();
        return;
    }
    
    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/editMessageText`;
    const data = {
        chat_id: CONFIG.telegramChatId,
        message_id: parseInt(activeEditState.telegramId),
        text: `💌 Secret Update from ${CONFIG.partnerName}:\n\n${cleanMsg}`
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(error => console.error("Cloud edit error."));

    if (typeof cancelEdit !== 'undefined') cancelEdit();
}

function sendSecretSticker(sticker) {
    if (!sticker) return;

    const isEmoji = sticker.isEmoji || !sticker.url;
    const msgId = 'msg_stk_' + Date.now();
    const newMsg = {
        id: msgId,
        sender: CONFIG.partnerName,
        type: 'sticker',
        stickerUrl: sticker.url || '',
        stickerEmoji: sticker.emoji || '💖',
        text: sticker.name || sticker.emoji || 'Sticker',
        timestamp: Date.now(),
        isPartner: false,
        replyTo: typeof activeReplyState !== 'undefined' && activeReplyState ? { text: activeReplyState.text } : null
    };

    saveChatMessage(newMsg);

    // Audio chime feedback
    playTapTone("Heart");

    // Close sticker picker drawer
    const picker = document.getElementById("chat-sticker-picker");
    const toggleBtn = document.getElementById("chat-sticker-btn");
    if (picker) picker.classList.add("hide");
    if (toggleBtn) toggleBtn.classList.remove("active");

    if (!CONFIG.telegramBotToken || !CONFIG.telegramChatId) {
        console.warn("Sync inactive: Missing credentials.");
        return;
    }

    if (isEmoji) {
        const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`;
        const data = {
            chat_id: CONFIG.telegramChatId,
            text: `💌 Sticker from ${CONFIG.partnerName}:\n\n${sticker.emoji} ${sticker.name ? '(' + sticker.name + ')' : ''}`
        };
        if (typeof activeReplyState !== 'undefined' && activeReplyState && activeReplyState.telegramId) {
            data.reply_to_message_id = parseInt(activeReplyState.telegramId);
        }
        if (typeof cancelReply !== 'undefined') cancelReply();
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.ok && data.result && data.result.message_id) {
                const history = getChatHistory();
                const item = history.find(m => m.id === newMsg.id);
                if (item) {
                    item.telegramMessageId = data.result.message_id;
                    localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
                }
            }
            setTimeout(checkTelegramReplies, 1500);
        })
        .catch(e => console.error("Cloud sync error."));
    } else {
        const endpoint = sticker.isAnim ? 'sendAnimation' : 'sendPhoto';
        const paramKey = sticker.isAnim ? 'animation' : 'photo';
        const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/${endpoint}`;
        const data = {
            chat_id: CONFIG.telegramChatId,
            [paramKey]: sticker.url,
            caption: `💌 Sticker from ${CONFIG.partnerName}: ${sticker.emoji || '💕'} ${sticker.name || ''}`
        };
        if (typeof activeReplyState !== 'undefined' && activeReplyState && activeReplyState.telegramId) {
            data.reply_to_message_id = parseInt(activeReplyState.telegramId);
        }
        if (typeof cancelReply !== 'undefined') cancelReply();
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(resData => {
            if (!resData.ok) {
                console.warn("Media send failed, falling back to message:", resData);
                fetch(`https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CONFIG.telegramChatId,
                        text: `💌 Sticker from ${CONFIG.partnerName}:\n\n${sticker.emoji || '💖'} ${sticker.name || ''}\n${sticker.url}`
                    })
                })
                .then(r => r.json())
                .then(rData => {
                    if (rData && rData.ok && rData.result && rData.result.message_id) {
                        const history = getChatHistory();
                        const item = history.find(m => m.id === newMsg.id);
                        if (item) {
                            item.telegramMessageId = rData.result.message_id;
                            localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
                        }
                    }
                });
            } else {
                if (resData && resData.ok && resData.result && resData.result.message_id) {
                    const history = getChatHistory();
                    const item = history.find(m => m.id === newMsg.id);
                    if (item) {
                        item.telegramMessageId = resData.result.message_id;
                        localStorage.setItem('studyflow_chat_history', JSON.stringify(history));
                    }
                }
            }
            setTimeout(checkTelegramReplies, 1500);
        })
        .catch(e => {
            console.error("Cloud sync error.", e);
        });
    }
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
                        
                        const thumbUrl = gif.images.fixed_height_small.url;
                        const fullUrl = gif.images.fixed_height.url;
                        btn.innerHTML = `<img src="${thumbUrl}" alt="${gif.title || 'GIF'}" class="sticker-thumb" loading="lazy">`;

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
                btn.innerHTML = `<img src="${stk.url}" alt="${stk.name}" class="sticker-thumb" loading="lazy">`;
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
    if (!CONFIG.telegramBotToken || !CONFIG.telegramChatId) return;

    let lastOffset = parseInt(localStorage.getItem('studyflow_last_offset') || "0");
    const allowed = encodeURIComponent('["message", "edited_message", "message_reaction"]');
    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/getUpdates?offset=${lastOffset}&allowed_updates=${allowed}`;

    isCheckingReplies = true;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
                let newPartnerMessages = 0;
                let maxUpdateId = lastOffset;
                const history = getChatHistory();

                data.result.forEach(update => {
                    if (update.update_id >= maxUpdateId) {
                        maxUpdateId = update.update_id + 1;
                    }

                    // Strict Security: Only accept messages from Yash's Telegram Chat ID
                    const msg = update.message;
                    const editedMsg = update.edited_message;
                    const reactionUpdate = update.message_reaction;
                    
                    if (reactionUpdate && String(reactionUpdate.chat && reactionUpdate.chat.id) === String(CONFIG.telegramChatId)) {
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

                    if (editedMsg && String(editedMsg.chat && editedMsg.chat.id) === String(CONFIG.telegramChatId)) {
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

                    if (msg && String(msg.chat && msg.chat.id) === String(CONFIG.telegramChatId)) {
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
                                    stickerUrl: '',
                                    stickerEmoji: sticker.emoji || "💖",
                                    text: sticker.emoji || "Sticker",
                                    timestamp: time,
                                    isPartner: true
                                };
                                history.push(newMsg);
                                newPartnerMessages++;

                                if (targetFileId) {
                                    resolveTelegramFileUrl(targetFileId).then(fileUrl => {
                                        if (fileUrl) {
                                            const curHistory = getChatHistory();
                                            const item = curHistory.find(m => m.id === newMsgId);
                                            if (item) {
                                                item.stickerUrl = fileUrl;
                                                localStorage.setItem('studyflow_chat_history', JSON.stringify(curHistory));
                                                renderSecretChat();
                                            }
                                        }
                                    });
                                }
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
                                    stickerUrl: '',
                                    text: msg.caption ? msg.caption.trim() : "",
                                    timestamp: time,
                                    isPartner: true
                                };
                                history.push(newMsg);
                                newPartnerMessages++;

                                resolveTelegramFileUrl(photo.file_id).then(fileUrl => {
                                    if (fileUrl) {
                                        const curHistory = getChatHistory();
                                        const item = curHistory.find(m => m.id === newMsgId);
                                        if (item) {
                                            item.stickerUrl = fileUrl;
                                            localStorage.setItem('studyflow_chat_history', JSON.stringify(curHistory));
                                            renderSecretChat();
                                        }
                                    }
                                });
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
                                    stickerUrl: '',
                                    stickerEmoji: "✨",
                                    text: msg.caption ? msg.caption.trim() : "GIF",
                                    timestamp: time,
                                    isPartner: true
                                };
                                history.push(newMsg);
                                newPartnerMessages++;

                                if (targetFileId) {
                                    resolveTelegramFileUrl(targetFileId).then(fileUrl => {
                                        if (fileUrl) {
                                            const curHistory = getChatHistory();
                                            const item = curHistory.find(m => m.id === newMsgId);
                                            if (item) {
                                                item.stickerUrl = fileUrl;
                                                localStorage.setItem('studyflow_chat_history', JSON.stringify(curHistory));
                                                renderSecretChat();
                                            }
                                        }
                                    });
                                }
                            } else if (msg.voice || msg.audio) {
                                // 4. Yash sent a Voice Note or Audio
                                const audio = msg.voice || msg.audio;
                                const newMsg = {
                                    id: newMsgId,
                                    telegramMessageId: msg.message_id,
                                    replyTo: msg.reply_to_message ? { text: msg.reply_to_message.text || msg.reply_to_message.caption || 'Voice Note' } : null,
                                    sender: CONFIG.yourName,
                                    type: 'voice',
                                    stickerFileId: audio.file_id,
                                    stickerUrl: '',
                                    text: "Voice Note 🎤",
                                    timestamp: time,
                                    isPartner: true
                                };
                                history.push(newMsg);
                                newPartnerMessages++;

                                resolveTelegramFileUrl(audio.file_id).then(fileUrl => {
                                    if (fileUrl) {
                                        const curHistory = getChatHistory();
                                        const item = curHistory.find(m => m.id === newMsgId);
                                        if (item) {
                                            item.stickerUrl = fileUrl;
                                            localStorage.setItem('studyflow_chat_history', JSON.stringify(curHistory));
                                            renderSecretChat();
                                        }
                                    }
                                });
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
            if (CONFIG.telegramBotToken && CONFIG.telegramChatId) {
                fetch(`https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendChatAction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CONFIG.telegramChatId,
                        action: 'typing'
                    })
                }).catch(e => console.error("Error sending typing action", e));
            }
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

// Run initialization safely across all environments
function initApp() {
    initializeSurpriseContent();
    updateTimerDisplay();
    updateUnreadIndicator();
    initStickerPicker();
    renderSecretChat();
    setupVoiceRecording();

    // Check Telegram for replies immediately on load
    checkTelegramReplies();

    // Poll periodically every 10 seconds for real-time replies
    setInterval(checkTelegramReplies, 10000);

    // Mark messages as seen when window is focused and chat is open
    window.addEventListener("focus", () => {
        const isLoveOpen = loveContainer && !loveContainer.classList.contains("hide");
        if (isLoveOpen && typeof window.markMessagesAsSeen === 'function') {
            window.markMessagesAsSeen();
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
