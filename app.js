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
    // 2. Hide love container & show disguise container
    loveContainer.classList.add("hide");
    loveContainer.classList.remove("fade-in");

    disguiseContainer.classList.remove("hide");
    disguiseContainer.classList.remove("fade-out");

    // 3. Clear any sensitive data
    passcodeInput.value = "";
    closeUnlockModal();

    // Check if new unread indicator should show in disguise mode
    updateUnreadIndicator();
}

// Click panic button or press "Escape" on keyboard
if (panicBtn) panicBtn.addEventListener("click", triggerPanicLock);
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.keyCode === 27) {
        // Check if love container is currently visible
        if (!loveContainer.classList.contains("hide")) {
            triggerPanicLock();
        } else if (!passcodeModal.classList.contains("hide")) {
            closeUnlockModal();
        }
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

async function resolveTelegramFileUrl(fileId) {
    if (!fileId || !CONFIG.telegramBotToken) return null;
    if (telegramFileUrlCache[fileId]) return telegramFileUrlCache[fileId];

    try {
        const localCache = JSON.parse(localStorage.getItem('studyflow_file_cache') || '{}');
        if (localCache[fileId]) {
            telegramFileUrlCache[fileId] = localCache[fileId];
            return localCache[fileId];
        }
    } catch (e) {}

    try {
        const res = await fetch(`https://api.telegram.org/bot${CONFIG.telegramBotToken}/getFile?file_id=${fileId}`);
        const data = await res.json();
        if (data.ok && data.result && data.result.file_path) {
            const fileUrl = `https://api.telegram.org/file/bot${CONFIG.telegramBotToken}/${data.result.file_path}`;
            telegramFileUrlCache[fileId] = fileUrl;
            
            try {
                const localCache = JSON.parse(localStorage.getItem('studyflow_file_cache') || '{}');
                localCache[fileId] = fileUrl;
                localStorage.setItem('studyflow_file_cache', JSON.stringify(localCache));
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
        } else {
            bubbleContent = `
                <div class="chat-bubble">
                    ${escapeHTML(msg.text)}
                </div>
            `;
        }

        row.innerHTML = `
            <span class="chat-sender-name">${escapeHTML(senderLabel)}</span>
            ${bubbleContent}
            <span class="chat-timestamp">${formatTime(msg.timestamp)}</span>
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
    saveChatMessage({
        id: 'msg_' + Date.now(),
        sender: CONFIG.partnerName,
        text: cleanMsg,
        timestamp: Date.now(),
        isPartner: false
    });

    if (!CONFIG.telegramBotToken || !CONFIG.telegramChatId) {
        console.warn("Sync inactive: Missing credentials.");
        return;
    }
    
    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/sendMessage`;
    const data = {
        chat_id: CONFIG.telegramChatId,
        text: `💌 Secret Update from ${CONFIG.partnerName}:\n\n${cleanMsg}`
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Task synced with cloud server.");
        setTimeout(checkTelegramReplies, 1500);
    })
    .catch(error => console.error("Cloud sync error."));
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
        isPartner: false
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
            text: `💌 Sticker from ${CONFIG.partnerName}:\n\n${sticker.emoji} ${sticker.name ? `(${sticker.name})` : ''}`
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(() => setTimeout(checkTelegramReplies, 1500)).catch(e => console.error("Cloud sync error."));
    } else {
        const endpoint = sticker.isAnim ? 'sendAnimation' : 'sendPhoto';
        const paramKey = sticker.isAnim ? 'animation' : 'photo';
        const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/${endpoint}`;
        const data = {
            chat_id: CONFIG.telegramChatId,
            [paramKey]: sticker.url,
            caption: `💌 Sticker from ${CONFIG.partnerName}: ${sticker.emoji || '💕'} ${sticker.name || ''}`
        };
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
                });
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

    function renderCategory(cat) {
        currentCategory = cat;
        const items = STICKER_CATALOG[cat] || [];
        stickerGrid.innerHTML = "";

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
    const url = `https://api.telegram.org/bot${CONFIG.telegramBotToken}/getUpdates?offset=${lastOffset}`;

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
                            } else if (msg.text) {
                                // 4. Yash sent a Text message
                                const text = msg.text.trim();
                                if (text && !text.startsWith("/")) {
                                    history.push({
                                        id: newMsgId,
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
                    const isLoveOpen = loveContainer && !loveContainer.classList.contains("hide");
                    if (!isLoveOpen) {
                        let currentUnread = parseInt(localStorage.getItem('studyflow_unread_count') || "0");
                        currentUnread += newPartnerMessages;
                        localStorage.setItem('studyflow_unread_count', currentUnread);
                        updateUnreadIndicator();
                    } else {
                        renderSecretChat();
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

// Secret chat input listeners in Love Space
if (secretSendBtn && secretReplyInput) {
    const handleSecretSend = () => {
        const text = secretReplyInput.value.trim();
        if (text) {
            sendSecretUpdate(text);
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

    // Check Telegram for replies immediately on load
    checkTelegramReplies();

    // Poll periodically every 10 seconds for real-time replies
    setInterval(checkTelegramReplies, 10000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
