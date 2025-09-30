const backendURL = "https://kido-ai-952519942620.asia-south1.run.app/generate-content";

// Helper: Sanitize Input
function sanitizeInput(input) {
  return input.replace(/[<>"'&]/g, "");
}

// Helper: Send Prompt to Backend
async function realAIResponse(prompt) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.result || "⚠ No response from AI.";
  } catch (err) {
    console.error("❌ AI request failed:", err);
    return "⚠ Could not reach backend!";
  }
}

// Typing Effect
function startTypingEffect(elementId, text, speed = 30) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = "";
  let index = 0;
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
      cursor.classList.add("done");
    }
  }
  typeChar();
}

// Feature Navigation
function openFeature(featureId) {
  document.getElementById("dashboard").style.display = "none";
  document.querySelectorAll(".feature-section").forEach(sec => {
    sec.style.display = "none";
    sec.setAttribute("aria-hidden", "true");
  });
  const section = document.getElementById(featureId);
  section.style.display = "block";
  section.setAttribute("aria-hidden", "false");
  section.classList.add("visible");
  localStorage.setItem("recentFeature", featureId.split("-")[0]);
  loadSuggestions();
}

function goBack() {
  document.getElementById("dashboard").style.display = "block";
  document.querySelectorAll(".feature-section").forEach(sec => {
    sec.style.display = "none";
    sec.setAttribute("aria-hidden", "true");
  });
}

// AI Suggestions
function loadSuggestions() {
  const recent = localStorage.getItem("recentFeature") || "Content Generator";
  document.getElementById("suggestion-text").innerText = `Based on your usage: Try ${recent} again or explore new tools!`;
}

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
  const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("mode", mode);
  document.querySelector(".mode-toggle i").classList.toggle("fa-moon");
  document.querySelector(".mode-toggle i").classList.toggle("fa-sun");
}

// Sidebar Collapse
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

// Gesture Navigation
let touchStartX = 0;
document.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener("touchend", e => {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchEndX - touchStartX > 100) {
    goBack();
  }
});

// Canvas Animation
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    vx: Math.random() * 2 - 1,
    vy: Math.random() * 2 - 1
  });
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 245, 255, 0.5)";
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// Content Generator
async function generateContentGenerator() {
  const topic = sanitizeInput(document.getElementById("cg-topic").value.trim());
  const grade = sanitizeInput(document.getElementById("cg-grade").value.trim());
  const language = document.getElementById("cg-language").value.trim();
  const outputDiv = document.getElementById("cg-output");
  const errorDiv = document.getElementById("cg-error");

  if (!topic || !grade) {
    errorDiv.innerText = "Please enter topic and grade!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  outputDiv.innerHTML = '<div class="image-loader"><div class="loader-spinner"></div><div class="loader-text">Generating content...</div></div>';

  const prompt = `Generate ${language} lesson content for grade ${grade} about ${topic}`;
  try {
    const result = await realAIResponse(prompt);
    startTypingEffect("cg-output", result, 30);
  } catch (err) {
    errorDiv.innerText = "⚠ Failed to generate content. Please try again.";
    errorDiv.style.display = "block";
    outputDiv.innerText = "";
  }
}

// Worksheet Creator
async function generateWorksheet() {
  const topic = sanitizeInput(document.getElementById("ws-topic").value.trim());
  const grade = sanitizeInput(document.getElementById("ws-grade").value.trim());
  const questions = sanitizeInput(document.getElementById("ws-questions").value.trim());
  const outputDiv = document.getElementById("ws-output");
  const errorDiv = document.getElementById("ws-error");

  if (!topic || !grade || !questions) {
    errorDiv.innerText = "Please enter topic, grade, and number of questions!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  outputDiv.innerHTML = '<div class="image-loader"><div class="loader-spinner"></div><div class="loader-text">Creating worksheet...</div></div>';

  const prompt = `Create a ${questions}-question worksheet for grade ${grade} on ${topic}`;
  try {
    const result = await realAIResponse(prompt);
    startTypingEffect("ws-output", result, 30);
  } catch (err) {
    errorDiv.innerText = "⚠ Failed to create worksheet. Please try again.";
    errorDiv.style.display = "block";
    outputDiv.innerText = "";
  }
}

// Knowledge Base
async function generateKnowledgeBase() {
  const question = sanitizeInput(document.getElementById("kb-question").value.trim());
  const outputDiv = document.getElementById("kb-output");
  const errorDiv = document.getElementById("kb-error");

  if (!question) {
    errorDiv.innerText = "Please enter a question!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  outputDiv.innerHTML = '<div class="image-loader"><div class="loader-spinner"></div><div class="loader-text">Searching knowledge base...</div></div>';

  const prompt = `Answer the following question: ${question}`;
  try {
    const result = await realAIResponse(prompt);
    startTypingEffect("kb-output", result, 30);
  } catch (err) {
    errorDiv.innerText = "⚠ Failed to retrieve answer. Please try again.";
    errorDiv.style.display = "block";
    outputDiv.innerText = "";
  }
}

// Visual Aid Designer
async function generateVisualAid() {
  const topic = sanitizeInput(document.getElementById("va-topic").value.trim());
  const outputDiv = document.getElementById("va-output");
  const errorDiv = document.getElementById("va-error");

  if (!topic) {
    errorDiv.innerText = "Please enter a topic!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  outputDiv.innerHTML = '<div class="image-loader"><div class="loader-spinner"></div><div class="loader-text">Generating visual idea...</div></div>';

  const prompt = `Describe a simple visual aid for: ${topic}`;
  try {
    const result = await realAIResponse(prompt);
    startTypingEffect("va-output", result, 30);
  } catch (err) {
    errorDiv.innerText = "⚠ Failed to generate visual aid. Please try again.";
    errorDiv.style.display = "block";
    outputDiv.innerText = "";
  }
}

// Reading Assessment
let speechSynthesisUtterance = null;
let isPaused = false;

async function generateReadingAssessment() {
  const topic = sanitizeInput(document.getElementById("ra-topic").value.trim());
  const lang = document.getElementById("ra-lang").value.trim() || "en-US";
  const voiceType = document.getElementById("ra-voice").value;
  const volume = parseFloat(document.getElementById("ra-volume").value) || 1;
  const outputDiv = document.getElementById("ra-output");
  const errorDiv = document.getElementById("ra-error");

  if (!topic) {
    errorDiv.innerText = "Please enter a topic!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  outputDiv.innerHTML = '<div class="image-loader"><div class="loader-spinner"></div><div class="loader-text">Preparing reading assessment...</div></div>';

  const prompt = `Generate a short reading passage for topic: ${topic}`;
  try {
    const text = await realAIResponse(prompt);
    startTypingEffect("ra-output", text, 30);

    speechSynthesis.cancel();
    speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.lang = lang;
    speechSynthesisUtterance.volume = volume;

    let voices = speechSynthesis.getVoices();
    if (!voices.length) {
      await new Promise(resolve => {
        speechSynthesis.onvoiceschanged = () => {
          voices = speechSynthesis.getVoices();
          resolve();
        };
      });
    }

    if (voiceType === "female") {
      const femaleVoice = voices.find(v => /female/i.test(v.name) || v.name.toLowerCase().includes("zira"));
      if (femaleVoice) speechSynthesisUtterance.voice = femaleVoice;
    } else {
      const maleVoice = voices.find(v => /male/i.test(v.name) || v.name.toLowerCase().includes("david"));
      if (maleVoice) speechSynthesisUtterance.voice = maleVoice;
    }

    speechSynthesis.speak(speechSynthesisUtterance);
    document.querySelector(".voice-controls").style.display = "flex";
    document.querySelector(".waveform").style.display = "flex";
  } catch (err) {
    errorDiv.innerText = "⚠ Failed to generate reading passage. Please try again.";
    errorDiv.style.display = "block";
    outputDiv.innerText = "";
  }
}

function toggleSpeech() {
  if (!speechSynthesisUtterance) return;

  if (!isPaused) {
    speechSynthesis.pause();
    document.getElementById("ra-toggle").innerText = "▶ Resume";
  } else {
    speechSynthesis.resume();
    document.getElementById("ra-toggle").innerText = "⏸ Pause";
  }
  isPaused = !isPaused;
}

function stopSpeech() {
  speechSynthesis.cancel();
  isPaused = false;
  document.getElementById("ra-toggle").innerText = "⏸ Pause";
  document.querySelector(".voice-controls").style.display = "none";
  document.querySelector(".waveform").style.display = "none";
}

// Lesson Planner
async function generateLessonPlanner() {
  const grade = sanitizeInput(document.getElementById("lp-grade").value.trim());
  const subject = sanitizeInput(document.getElementById("lp-subject").value.trim());
  const outputDiv = document.getElementById("lp-output");
  const errorDiv = document.getElementById("lp-error");

  if (!grade || !subject) {
    errorDiv.innerText = "Please enter grade and subject!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  outputDiv.innerHTML = '<div class="image-loader"><div class="loader-spinner"></div><div class="loader-text">Generating lesson plan...</div></div>';

  const prompt = `Create a weekly lesson plan for grade ${grade} in ${subject}`;
  try {
    const result = await realAIResponse(prompt);
    startTypingEffect("lp-output", result, 30);
  } catch (err) {
    errorDiv.innerText = "⚠ Failed to generate lesson plan. Please try again.";
    errorDiv.style.display = "block";
    outputDiv.innerText = "";
  }
}

// Image Generator (Placeholder)
async function generateImage() {
  const prompt = sanitizeInput(document.getElementById("img-prompt").value.trim());
  const outputDiv = document.getElementById("image-result");
  const errorDiv = document.getElementById("img-error");
  const metaDiv = document.getElementById("result-meta");

  if (!prompt) {
    errorDiv.innerText = "Please enter a prompt!";
    errorDiv.style.display = "block";
    return;
  }

  errorDiv.style.display = "none";
  outputDiv.innerHTML = '<div class="image-loader"><div class="loader-spinner"></div><div class="loader-text">Generating image...</div></div>';
  metaDiv.style.display = "none";

  try {
    // Placeholder: Replace with actual image generation API
    const res = await fetch("https://kido-ai-952519942620.asia-south1.run.app/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (data.imageUrl) {
      outputDiv.innerHTML = `<img src="${data.imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 8px;" />`;
      metaDiv.style.display = "flex";
      document.getElementById("download-btn").onclick = () => {
        const link = document.createElement("a");
        link.href = data.imageUrl;
        link.download = "generated-image.png";
        link.click();
      };
      document.getElementById("open-btn").onclick = () => window.open(data.imageUrl, "_blank");
    } else {
      outputDiv.innerText = "⚠ No image generated.";
    }
  } catch (err) {
    errorDiv.innerText = "⚠ Failed to generate image. Please try again.";
    errorDiv.style.display = "block";
    outputDiv.innerText = "";
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("mode") || "dark";
  document.body.classList.add(savedMode + "-mode");
  if (savedMode === "light") {
    document.querySelector(".mode-toggle i").classList.replace("fa-moon", "fa-sun");
  }
  loadSuggestions();
});

// Cleanup
window.addEventListener("beforeunload", () => {
  document.body.style.opacity = "0";
});

