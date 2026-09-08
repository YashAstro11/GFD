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
    return str.replace(/[&<>'"]/g,
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
// 8. TWO-WAY SECRET TELEGRAM MESSAGING & STEALTH UPDATES
// =========================================================================
const secretChatContainer = document.getElementById("secret-chat-messages");
const secretReplyInput = document.getElementById("secret-reply-input");
const secretSendBtn = document.getElementById("secret-send-btn");
const clearChatBtn = document.getElementById("clear-chat-btn");
const unreadDot = document.getElementById("unread-dot");

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
    if (!secretChatContainer) return;
    const history = getChatHistory();

    if (history.length === 0) {
        secretChatContainer.innerHTML = `
            <div class="chat-empty-state">
                <span>💌</span>
                <p>No messages yet.</p>
                <p style="font-size:0.75rem; opacity:0.75; margin-top:0.35rem;">
                    When ${CONFIG.partnerName} adds a task with "." or types below, it goes to ${CONFIG.yourName}'s Telegram.<br>
                    ${CONFIG.yourName}'s Telegram replies will show up right here!
                </p>
            </div>
        `;
        return;
    }

    secretChatContainer.innerHTML = "";
    history.forEach(msg => {
        const row = document.createElement("div");
        row.className = `chat-bubble-row ${msg.isPartner ? 'partner' : 'mine'}`;
        
        const senderLabel = msg.isPartner ? `${CONFIG.yourName} 👑` : `${CONFIG.partnerName} 🐱`;
        
        row.innerHTML = `
            <span class="chat-sender-name">${escapeHTML(senderLabel)}</span>
            <div class="chat-bubble">
                ${escapeHTML(msg.text)}
            </div>
            <span class="chat-timestamp">${formatTime(msg.timestamp)}</span>
        `;
        secretChatContainer.appendChild(row);
    });

    // Auto-scroll to bottom of chat
    secretChatContainer.scrollTop = secretChatContainer.scrollHeight;
}

function updateUnreadIndicator() {
    const unreadCount = parseInt(localStorage.getItem('studyflow_unread_count') || "0");
    const isLoveOpen = loveContainer && !loveContainer.classList.contains("hide");

    if (unreadDot) {
        if (unreadCount > 0 && !isLoveOpen) {
            unreadDot.classList.remove("hide");
            if (privateLockBtn) privateLockBtn.setAttribute("title", `Private Notes (${unreadCount} unread)`);
        } else {
            unreadDot.classList.add("hide");
            if (privateLockBtn) privateLockBtn.setAttribute("title", "Private Notes");
        }
    }
}

function sendSecretUpdate(message) {
    if (!message || !message.trim()) return;
    const cleanMsg = message.trim();

    // 1. Record Mukku's message into local chat history
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
        console.log("Task synced with cloud server."); // Disguised log
        // Check for any quick replies shortly after sending
        setTimeout(checkTelegramReplies, 1500);
    })
    .catch(error => console.error("Cloud sync error.")); // Disguised error
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
                        const text = msg.text ? msg.text.trim() : "";
                        // Ignore standard bot commands like /start
                        if (text && !text.startsWith("/")) {
                            const newMsgId = 't_' + update.update_id;
                            if (!history.some(m => m.id === newMsgId)) {
                                history.push({
                                    id: newMsgId,
                                    sender: CONFIG.yourName,
                                    text: text,
                                    timestamp: (msg.date ? msg.date * 1000 : Date.now()),
                                    isPartner: true
                                });
                                newPartnerMessages++;
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
            // Disguised silent background catch
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

// Run initialization on DOM load
document.addEventListener("DOMContentLoaded", () => {
    initializeSurpriseContent();
    updateTimerDisplay();
    updateUnreadIndicator();
    renderSecretChat();

    // Check Telegram for replies immediately on page load
    checkTelegramReplies();

    // Poll periodically every 10 seconds for real-time replies
    setInterval(checkTelegramReplies, 10000);
});
