// =====================================
//  Sahayak AI - All Features in One JS
//  With Particle Background
// =====================================

// ===== Backend Connection =====
async function realAIResponse(prompt) {
  try {
    const res = await fetch("https://kido-ai-952519942620.asia-south1.run.app/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.result || "⚠️ No response from AI.";
  } catch (err) {
    console.error("❌ AI request failed:", err);
    return "⚠️ Could not reach backend!";
  }
}

// ===== Feature Navigation =====
function openFeature(featureId) {
  document.getElementById("dashboard").style.display = "none";
  document.querySelectorAll(".feature-section").forEach(sec => sec.style.display = "none");
  document.getElementById(featureId).style.display = "block";
}

function goBack() {
  document.getElementById("dashboard").style.display = "block";
  document.querySelectorAll(".feature-section").forEach(sec => sec.style.display = "none");
}

// ==============================
// 1️⃣ Content Generator
// ==============================
async function generateContentGenerator() {
  const topic = document.getElementById("cg-topic").value.trim();
  const grade = document.getElementById("cg-grade").value.trim();
  const language = document.getElementById("cg-language").value;
  const outputDiv = document.getElementById("cg-output");

  if (!topic || !grade) {
    alert("Please enter topic and grade!");
    return;
  }

  outputDiv.innerText = "⏳ Generating content...";
  const result = await realAIResponse(`Generate ${language} lesson content for grade ${grade} about ${topic}`);
  outputDiv.innerText = result;
}

// ==============================
// 2️⃣ Worksheet Generator
// ==============================
async function generateWorksheet() {
  const topic = document.getElementById("ws-topic").value.trim();
  const grade = document.getElementById("ws-grade").value.trim();
  const outputDiv = document.getElementById("ws-output");

  if (!topic || !grade) {
    alert("Please enter topic and grade!");
    return;
  }

  outputDiv.innerText = "⏳ Generating worksheet...";
  const result = await realAIResponse(`Create a worksheet for grade ${grade} on topic ${topic}`);
  outputDiv.innerText = result;
}

// ==============================
// 3️⃣ Quiz Maker
// ==============================
async function generateQuiz() {
  const topic = document.getElementById("quiz-topic").value.trim();
  const grade = document.getElementById("quiz-grade").value.trim();
  const outputDiv = document.getElementById("quiz-output");

  if (!topic || !grade) {
    alert("Please enter topic and grade!");
    return;
  }

  outputDiv.innerText = "⏳ Generating quiz...";
  const result = await realAIResponse(`Create a quiz for grade ${grade} on topic ${topic}`);
  outputDiv.innerText = result;
}

// ==============================
// 4️⃣ Lesson Plan Creator
// ==============================
async function generateLessonPlan() {
  const topic = document.getElementById("lp-topic").value.trim();
  const grade = document.getElementById("lp-grade").value.trim();
  const outputDiv = document.getElementById("lp-output");

  if (!topic || !grade) {
    alert("Please enter topic and grade!");
    return;
  }

  outputDiv.innerText = "⏳ Generating lesson plan...";
  const result = await realAIResponse(`Create a lesson plan for grade ${grade} on topic ${topic}`);
  outputDiv.innerText = result;
}

// ==============================
// 5️⃣ Reading Assessment (Speech)
// ==============================
let speechSynthesisUtterance = null;
let isPaused = false;

function loadVoices(callback) {
  let voices = speechSynthesis.getVoices();
  if (voices.length) {
    callback(voices);
  } else {
    speechSynthesis.onvoiceschanged = () => callback(speechSynthesis.getVoices());
  }
}

async function generateReadingAssessment() {
  const grade = document.getElementById("ra-grade").value.trim();
  const voiceType = document.getElementById("ra-voice").value;
  const lang = document.getElementById("ra-lang").value;
  const outputDiv = document.getElementById("ra-output");

  if (!grade) {
    alert("Please enter Grade!");
    return;
  }

  outputDiv.innerText = "⏳ Preparing reading assessment...";
  const text = await realAIResponse(`Generate a short reading passage for grade ${grade}`);
  outputDiv.innerText = text;

  speechSynthesis.cancel();
  speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
  speechSynthesisUtterance.lang = lang;
  speechSynthesisUtterance.volume = document.getElementById("ra-volume").value;

  loadVoices((voices) => {
    let selectedVoice;
    if (voiceType === "female") {
      selectedVoice = voices.find(v => /female/i.test(v.name) || v.name.includes("Zira"));
    } else {
      selectedVoice = voices.find(v => /male/i.test(v.name) || v.name.includes("David"));
    }
    if (selectedVoice) speechSynthesisUtterance.voice = selectedVoice;
    speechSynthesis.speak(speechSynthesisUtterance);
  });
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
}

// ==============================
// 6️⃣ Progress Tracker
// ==============================
let progressData = [];

function updateProgress(subject, score) {
  progressData.push({ subject, score });
  renderProgress();
}

function renderProgress() {
  const container = document.getElementById("progress-output");
  container.innerHTML = "";
  progressData.forEach(item => {
    const div = document.createElement("div");
    div.innerText = `${item.subject}: ${item.score}%`;
    container.appendChild(div);
  });
}

// ==============================
// 7️⃣ Chatbot
// ==============================
async function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const output = document.getElementById("chat-output");
  const message = input.value.trim();
  if (!message) return;

  output.innerHTML += `<div><b>You:</b> ${message}</div>`;
  input.value = "";

  const reply = await realAIResponse(`Student asked: ${message}`);
  output.innerHTML += `<div><b>Sahayak AI:</b> ${reply}</div>`;
  output.scrollTop = output.scrollHeight;
}

// ==============================
// 🌌 Particle Background
// ==============================
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.baseColor = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.color = this.baseColor;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.glow = 0;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    this.glow *= 0.92;
  }
  draw(ctx) {
    ctx.shadowBlur = 20 + this.glow * 30;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

const particles = Array.from({ length: 100 }, () => new Particle(Math.random() * canvas.width, Math.random() * canvas.height));

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.strokeStyle = particles[a].baseColor;
        ctx.lineWidth = 0.3;
        ctx.globalAlpha = 1 - distance / 120;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
        particles[a].glow = 1;
        particles[b].glow = 1;
      }
    }
  }
  ctx.globalAlpha = 1;
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw(ctx);
  });
  connectParticles();
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
