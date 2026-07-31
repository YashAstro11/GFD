// =========================================================================
// ❤️ CONFIGURATION - CUSTOMIZE YOURSurprise HERE!
// =========================================================================
const CONFIG = {
    partnerName: "My Love",             // Your girlfriend's name (displays in heading/letter)
    yourName: "Yash",                 // Your name (signature on the letter)
    passcode: "2603",                   // The secret code to unlock the private page (e.g. your anniversary date)

    // LDR Settings
    yourLocation: "Lucknow",            // Where you live
    partnerLocation: "Sahar",  // Where she lives
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
// 1. DUAL TIME CLOCKS & COUNTERS
// =========================================================================
// =========================================================================
// 2. DISGUISE PAGE - FOCUS TIMER & TASKS
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
    timerDisplay.textContent = `${mins}:${secs}`;
}

function startTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerStartBtn.textContent = "Start";
        timerStartBtn.classList.remove("btn-warning");
        timerStartBtn.classList.add("btn-success");
        timerRunning = false;
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
            }
        }, 1000);
        timerStartBtn.textContent = "Pause";
        timerStartBtn.classList.remove("btn-success");
        timerStartBtn.classList.add("btn-warning");
        timerRunning = true;
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

if (addTaskBtn && newTaskInput && taskList) {
    addTaskBtn.addEventListener("click", () => {
        const text = newTaskInput.value.trim();
        if (text) {
            const li = document.createElement("li");
            li.innerHTML = `
                <label class="task-item">
                    <input type="checkbox">
                    <span class="task-text">${escapeHTML(text)}</span>
                </label>
            `;
            taskList.appendChild(li);
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

        // Add fade out to disguise, then show love container
        disguiseContainer.classList.add("fade-out");

        setTimeout(() => {
            disguiseContainer.classList.add("hide");
            loveContainer.classList.remove("hide");
            loveContainer.classList.add("fade-in");

            // Trigger clocks check immediately
            updateClocksAndCounters();
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
const loveBgMusic = document.getElementById("love-bg-music");
const playSvg = document.getElementById("music-play-svg");
const pauseSvg = document.getElementById("music-pause-svg");

function triggerPanicLock() {
    // 1. Instantly stop music silently
    if (loveBgMusic) {
        loveBgMusic.pause();
    }
    if (playSvg && pauseSvg) {
        playSvg.classList.remove("hide");
        pauseSvg.classList.add("hide");
    }

    // 2. Hide love container & show disguise container
    loveContainer.classList.add("hide");
    loveContainer.classList.remove("fade-in");

    disguiseContainer.classList.remove("hide");
    disguiseContainer.classList.remove("fade-out");

    // 3. Clear any sensitive data
    passcodeInput.value = "";
    closeUnlockModal();
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
// 5. MUSIC CONTROLLER (Earphone Safety Hint)
// =========================================================================
const loveMusicToggle = document.getElementById("love-music-toggle");

if (loveMusicToggle && loveBgMusic) {
    loveMusicToggle.addEventListener("click", () => {
        if (loveBgMusic.paused) {
            loveBgMusic.play().then(() => {
                playSvg.classList.add("hide");
                pauseSvg.classList.remove("hide");
            }).catch(err => {
                console.log("Music play blocked", err);
            });
        } else {
            loveBgMusic.pause();
            playSvg.classList.remove("hide");
            pauseSvg.classList.add("hide");
        }
    });
}

// =========================================================================
// 6. HEARTFELT LETTER INJECTION
// =========================================================================
function initializeSurpriseContent() {
    // Heading
    const loveHeading = document.getElementById("love-heading");
    if (loveHeading) loveHeading.textContent = `Happy Girlfriend's Day, ${CONFIG.partnerName} ❤️`;

    // Clocks header
    const locYourName = document.getElementById("loc-your-name");
    const locPartnerName = document.getElementById("loc-partner-name");
    const distanceVal = document.getElementById("distance-val");
    if (locYourName) locYourName.textContent = CONFIG.yourLocation;
    if (locPartnerName) locPartnerName.textContent = CONFIG.partnerLocation;
    if (distanceVal) distanceVal.textContent = CONFIG.distanceText;

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

// Run initialization on DOM load
document.addEventListener("DOMContentLoaded", () => {
    initializeSurpriseContent();
    updateClocksAndCounters();
    updateTimerDisplay();
});
