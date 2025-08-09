// ==========================
// KIDO AI - Typing Animation
// ==========================

function startTypingEffect(elementId, text, speed = 30) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.innerHTML = "";  // Clear old content
    let index = 0;

    // Create a blinking cursor
    const cursor = document.createElement("span");
    cursor.classList.add("typing-cursor");
    cursor.innerHTML = "|";
    element.appendChild(cursor);

    function typeChar() {
        if (index < text.length) {
            cursor.insertAdjacentText("beforebegin", text.charAt(index));
            index++;
            setTimeout(typeChar, speed);
        } else {
            cursor.classList.add("done"); // Stop cursor blinking after finishing
        }
    }
    typeChar();
}

// ==========================
// Animate Output for Sections
// ==========================
function animateOutput(elementId, text) {
    startTypingEffect(elementId, text, 25);
}

// Optional: Cursor styling
const style = document.createElement("style");
style.innerHTML = `
.typing-cursor {
    display: inline-block;
    animation: blink 0.7s infinite;
}
@keyframes blink { 50% { opacity: 0; } }
.typing-cursor.done { animation: none; opacity: 0; }
`;
document.head.appendChild(style);
