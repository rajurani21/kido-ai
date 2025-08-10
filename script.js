// ==========================
// KIDO AI Dashboard Script (Live AI + Voice Visible)
// ==========================

// Use your deployed backend endpoint here:
const API_URL = "https://kido-ai-952519942620.asia-south1.run.app/generate-content";

// Particle background setup
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

// Sidebar Navigation
function openFeature(id) {
  document.getElementById("dashboard").style.display = "none";
  document.querySelectorAll(".feature-section").forEach(div => div.style.display = "none");
  document.getElementById(id).style.display = "block";
}
function goBack() {
  document.querySelectorAll(".feature-section").forEach(div => div.style.display = "none");
  document.getElementById("dashboard").style.display = "block";
}

let lastSpokenText = "";
let isPaused = false;

// Helper: Fetch AI Response from backend
async function fetchAIResponse(prompt, outputId, speak = true) {
  const output = document.getElementById(outputId);
  output.innerText = "⏳ Generating response...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      let errText = `Server Error: ${res.status}`;
      try {
        const errData = await res.json();
        if (errData.error) errText += ` - ${errData.error}`;
      } catch {}
      output.innerText = `⚠️ ${errText}`;
      return;
    }

    const data = await res.json();

    if (data.result) {
      animateOutput(outputId, data.result);
      if (speak) {
        lastSpokenText = data.result;
        speakText(data.result, "en-US", "female", 1);
      }
    } else {
      output.innerText = "⚠️ Failed to get AI response.";
    }
  } catch (err) {
    output.innerText = "❌ Error connecting to server.";
    console.error("Fetch error:", err);
  }
}

// Speak text using responsiveVoice
function speakText(text, lang = "en-US", gender = "female", volume = 1) {
  lastSpokenText = text;
  isPaused = false;

  let voiceName = "UK English Female";
  if (gender === "male") voiceName = "UK English Male";

  document.getElementById("voice-controls").style.display = "flex";
  document.getElementById("waveform").style.display = "flex";

  responsiveVoice.speak(text, voiceName, {
    rate: 1,
    pitch: 1,
    volume: volume,
    onend: () => {
      document.getElementById("waveform").style.display = "none";
      document.getElementById("voice-controls").style.display = "none";
    }
  });
}

function toggleSpeech() {
  if (!lastSpokenText) return;
  if (isPaused) {
    responsiveVoice.resume();
    isPaused = false;
    document.getElementById("ra-toggle").innerText = "⏸ Pause";
  } else {
    responsiveVoice.pause();
    isPaused = true;
    document.getElementById("ra-toggle").innerText = "▶ Resume";
  }
}

function stopSpeech() {
  responsiveVoice.cancel();
  isPaused = false;
  document.getElementById("voice-controls").style.display = "none";
  document.getElementById("waveform").style.display = "none";
  document.getElementById("ra-toggle").innerText = "⏸ Pause";
}

// Animate output text like typing
function animateOutput(elementId, text) {
  const element = document.getElementById(elementId);
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
      setTimeout(typeChar, 20);
    } else {
      cursor.classList.add("done");
    }
  }
  typeChar();
}

// Feature functions
function generateContentGenerator() {
  const topic = document.getElementById("cg-topic").value.trim();
  const grade = document.getElementById("cg-grade").value.trim();
  if (!topic || !grade) return alert("Please enter topic and grade");
  const prompt = `Generate engaging educational content for the topic "${topic}" for Grade ${grade}. Include introduction, key concepts, and fun facts.`;
  fetchAIResponse(prompt, "cg-output");
}

function generateWorksheet() {
  const topic = document.getElementById("ws-topic").value.trim();
  const grade = document.getElementById("ws-grade").value.trim();
  const numQ = document.getElementById("ws-questions").value.trim();
  if (!topic || !grade || !numQ) return alert("Please enter all fields");
  const prompt = `Create a worksheet for the topic "${topic}" for Grade ${grade} with ${numQ} questions. Include multiple question types.`;
  fetchAIResponse(prompt, "ws-output");
}

function generateKnowledgeBase() {
  const q = document.getElementById("kb-question").value.trim();
  if (!q) return alert("Please enter a question");
  const prompt = `Answer the following educational question clearly and concisely: ${q}`;
  fetchAIResponse(prompt, "kb-output");
}

function generateVisualAid() {
  const topic = document.getElementById("va-topic").value.trim();
  if (!topic) return alert("Please enter a topic");
  const prompt = `Describe a creative visual aid or diagram for teaching the topic "${topic}" to students.`;
  fetchAIResponse(prompt, "va-output");
}

function generateLessonPlanner() {
  const grade = document.getElementById("lp-grade").value.trim();
  const subject = document.getElementById("lp-subject").value.trim();
  if (!grade || !subject) return alert("Please enter grade and subject");
  const prompt = `Create a detailed lesson plan for Grade ${grade} in the subject ${subject}, including objectives, activities, and homework.`;
  fetchAIResponse(prompt, "lp-output");
}

function generateReadingAssessment() {
  const topic = document.getElementById("ra-topic").value.trim();
  const lang = document.getElementById("ra-lang").value.trim() || "en-US";
  const gender = document.getElementById("ra-voice").value;
  const volume = parseFloat(document.getElementById("ra-volume").value);

  if (!topic) return alert("Please enter a topic");

  const prompt = `Write a simple and engaging reading passage for students about "${topic}".`;

  document.getElementById("voice-controls").style.display = "flex";
  document.getElementById("waveform").style.display = "flex";

  fetchAIResponse(prompt, "ra-output", (passage) => {
    lastSpokenText = passage;
    speakText(passage, lang, gender, volume);
  });
}
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));

});


