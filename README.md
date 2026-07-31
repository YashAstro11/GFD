# 💖 Our Love Story - Girlfriend's Day Surprise Web App

A premium, interactive, and fully responsive digital card built from scratch to surprise your girlfriend for Girlfriend's Day (August 1st). 

## ✨ Features Included:
- **Lock Screen Intro:** Floating heart canvas particles and an interactive lock button that plays a rising chime to unlock the page.
- **Letter Envelope:** An animated envelope that opens to reveal your personalized handwritten-style letter.
- **Our Journey Timeline:** An elegant timeline mapping key milestones in your relationship.
- **Why I Love You Polaroids:** 3D flip-cards containing detailed reasons why she is special.
- **Virtual Coupon Book:** Interactive coupons she can redeem. Redeeming triggers a confetti explosion and opens a WhatsApp pre-fill link to claim the coupon from you directly!
- **Date Night Spinner Wheel:** A canvas-rendered interactive spinner that play tick sound effects as it rotates, randomly picking your next date activity.
- **Media Gallery:** A modern glassmorphic photo grid for your memories.

---

## 🛠️ How to Customize

All configurations are extremely easy to edit. You just need to open the files and edit the marked variables.

### 1. Personalize Names and WhatsApp Number
Open **`app.js`** and locate the `CONFIG` block at the top:
```javascript
const CONFIG = {
    partnerName: "My Love",         // Your girlfriend's name
    yourName: "Yash",             // Your name (displays as the letter signature)
    whatsappNumber: "919876543210", // Your phone number with country code (no + or spaces)
    spinnerOptions: [               // Custom date options for the wheel
        "Pizza & Movie Night 🍕",
        "Fancy Dinner Date 🍽️",
        ...
    ]
};
```
Change these values to match yours. **Make sure the WhatsApp number has the correct country code** (e.g., `91` for India, `1` for US) without any spaces or symbols so the coupon system works.

### 2. Edit Your Letter Content
Open **`index.html`** and locate the `<div class="letter-content">` section (around line 72). Update the paragraphs inside the letter to express your feelings!

### 3. Edit Timeline Milestones
Open **`index.html`** and locate the `<div class="timeline">` section (around line 90). You can change the dates (e.g., "August 2024"), the titles (e.g., "First Hello 👋"), and the description text for each card.

### 4. Swap Photos in Polaroid & Gallery
You can drop your own photos (JPEG or PNG) directly into the `d:\mukku` folder.
- **For Polaroid cards:** Open **`index.html`** and search for `style="background-image: url('https://...')"`. Replace the Unsplash link inside the quotes with your local file name (e.g., `style="background-image: url('first_date.jpg')"`).
- **For the Gallery grid:** Locate `<div class="gallery-grid">` in **`index.html`** and replace the `src` attribute of the `<img>` tags with your image filenames (e.g., `src="beach.jpg"`).

---

## 🚀 How to Host & Share It for Free!

To send it to her phone so she can open it, you need to host it online. Here are the easiest 2-minute free methods:

### Option A: GitHub Pages (Recommended)
1. Push this folder (`d:\mukku`) to a public repository on your GitHub account.
2. Go to **Settings** in your GitHub repository.
3. Scroll down to **Pages** on the left menu.
4. Under **Build and deployment**, select the `main` branch and folder `/ (root)`, then click **Save**.
5. Your custom URL (e.g., `https://yourusername.github.io/your-repository-name/`) will be live in 1 minute!

### Option B: Netlify (Drag and Drop)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop the entire `mukku` folder onto the page.
3. It will instantly generate a free, shareable link for you (which you can shorten or customize)!
