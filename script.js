// =====================================
//  kido AI Frontend Script
//  Connected to Gemini Backend
// =====================================

// ===== Backend Connection =====
async function realAIResponse(prompt) {
  try {
    const res = await fetch("https://kido-ai-952519942620.asia-south1.run.app/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }) // ✅ backend expects "prompt"
    });

    const data = await res.json();
    return data.result || "⚠ No response from AI.";
  } catch (err) {
    console.error("❌ AI request failed:", err);
    return "⚠ Could not reach backend!";
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
// 2️⃣ Worksheet Creator
// ==============================
async function generateWorksheet() {
  const topic = document.getElementById("ws-topic").value.trim();
  const grade = document.getElementById("ws-grade").value.trim();
  const questions = document.getElementById("ws-questions").value.trim();
  const outputDiv = document.getElementById("ws-output");

  if (!topic || !grade || !questions) {
    alert("Please enter topic, grade, and number of questions!");
    return;
  }

  outputDiv.innerText = "⏳ Creating worksheet...";
  const result = await realAIResponse(`Create a ${questions}-question worksheet for grade ${grade} on ${topic}`);
  outputDiv.innerText = result;
}

// ==============================
// 3️⃣ Knowledge Base + Search
// ==============================
async function generateKnowledgeBase() {
  const question = document.getElementById("kb-question").value.trim();
  const outputDiv = document.getElementById("kb-output");

  if (!question) {
    alert("Please enter a question!");
    return;
  }

  outputDiv.innerText = "⏳ Searching knowledge base...";
  const result = await realAIResponse(`Answer the following question: ${question}`);
  outputDiv.innerText = result;
}

// ==============================
// 4️⃣ Visual Aid Designer
// ==============================
async function generateVisualAid() {
  const topic = document.getElementById("va-topic").value.trim();
  const outputDiv = document.getElementById("va-output");

  if (!topic) {
    alert("Please enter a topic!");
    return;
  }

  outputDiv.innerText = "🎨 Generating visual idea...";
  const result = await realAIResponse(`Describe a simple visual aid for: ${topic}`);
  outputDiv.innerText = result;
}

// ==============================
// 5️⃣ Reading Assessment (Speech)
// ==============================
let speechSynthesisUtterance = null;
let isPaused = false;

async function generateReadingAssessment() {
  const grade = document.getElementById("ra-grade").value.trim();
  const voiceType = document.getElementById("ra-voice").value;
  const lang = document.getElementById("ra-lang").value;
  const outputDiv = document.getElementById("ra-output");

  if (!grade) {
    alert("Please enter grade!");
    return;
  }

  outputDiv.innerText = "⏳ Preparing reading assessment...";
  const text = await realAIResponse(`Generate a short reading passage for grade ${grade}`);
  outputDiv.innerText = text;

  // Setup speech
  speechSynthesis.cancel();
  speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
  speechSynthesisUtterance.lang = lang;
  speechSynthesisUtterance.volume = document.getElementById("ra-volume").value;

  // Choose male/female voice
  const voices = speechSynthesis.getVoices();
  if (voiceType === "female") {
    const femaleVoice = voices.find(v => /female/i.test(v.name) || v.name.includes("Zira"));
    if (femaleVoice) speechSynthesisUtterance.voice = femaleVoice;
  } else {
    const maleVoice = voices.find(v => /male/i.test(v.name) || v.name.includes("David"));
    if (maleVoice) speechSynthesisUtterance.voice = maleVoice;
  }

  speechSynthesis.speak(speechSynthesisUtterance);
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
// 6️⃣ Lesson Planner
// ==============================
async function generateLessonPlanner() {
  const grade = document.getElementById("lp-grade").value.trim();
  const subject = document.getElementById("lp-subject").value.trim();
  const outputDiv = document.getElementById("lp-output");

  if (!grade || !subject) {
    alert("Please enter grade and subject!");
    return;
  }

  outputDiv.innerText = "⏳ Generating lesson plan...";
  const result = await realAIResponse(`Create a weekly lesson plan for grade ${grade} in ${subject}`);
  outputDiv.innerText = result;
}

// ==============================
// Particle Background Animation
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
