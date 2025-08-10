// =====================================
//  Sahayak AI Frontend Script
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
// 2️⃣ Worksheet Creator
// ==============================
async function generateWorksheet() {
  const topic = document.getElementById("ws-topic").value.trim();
  const grade = document.getElementById("ws-grade").value.trim();
  const questions = document.getElementById("ws-questions").value;
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
    alert("Please enter Topic!");
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

