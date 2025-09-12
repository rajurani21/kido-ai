// =====================================
//  KIDO AI Frontend Script (Multi-Language Support)
//  Connected to Gemini Backend
// =====================================

// Backend API URL (change if needed)
const backendURL = "https://kido-ai-952519942620.asia-south1.run.app/generate-content";

// Helper: Send prompt to backend and get AI response
async function realAIResponse(prompt) {
  try {
    const res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }) // backend expects "prompt" key
    });

    const data = await res.json();
    return data.result || "⚠ No response from AI.";
  } catch (err) {
    console.error("❌ AI request failed:", err);
    return "⚠ Could not reach backend!";
  }
}

// ======================
// Language Detection
// ======================
const langRanges = {
  Telugu: /[\u0C00-\u0C7F]/,
  Hindi: /[\u0900-\u097F]/,
  Tamil: /[\u0B80-\u0BFF]/,
  Kannada: /[\u0C80-\u0CFF]/,
  Malayalam: /[\u0D00-\u0D7F]/,
  Bengali: /[\u0980-\u09FF]/,
  Gujarati: /[\u0A80-\u0AFF]/,
};

function detectLanguage(text) {
  for (const [lang, regex] of Object.entries(langRanges)) {
    if (regex.test(text)) return lang;
  }
  return "English"; // fallback
}

// ======================
// Feature Handling
// ======================

// Show selected feature and hide others
function openFeature(featureId) {
  document.getElementById("dashboard").style.display = "none";
  document.querySelectorAll(".feature-section").forEach(sec => sec.style.display = "none");
  document.getElementById(featureId).style.display = "block";
}

function goBack() {
  document.getElementById("dashboard").style.display = "block";
  document.querySelectorAll(".feature-section").forEach(sec => sec.style.display = "none");
}

// 1️⃣ Content Generator
async function generateContentGenerator() {
  const topic = document.getElementById("cg-topic").value.trim();
  const grade = document.getElementById("cg-grade").value.trim();
  const languageInput = document.getElementById("cg-language");
  const language = languageInput ? languageInput.value.trim() : "";

  const outputDiv = document.getElementById("cg-output");

  if (!topic || !grade) {
    alert("Please enter topic and grade!");
    return;
  }

  outputDiv.innerText = "⏳ Generating content...";

  // 👇 Updated prompt to respect input language
  const prompt = language
    ? `Generate lesson content in ${language} for grade ${grade} on topic: ${topic}. 
       Respond ONLY in ${language}.`
    : `Generate lesson content for grade ${grade} on topic: ${topic}. 
       Respond in the same language as the topic/question.`;

  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}

// 2️⃣ Worksheet Creator
async function generateWorksheet() {
  const topic = document.getElementById("ws-topic").value.trim();
  const grade = document.getElementById("ws-grade").value.trim();
  const questions = document.getElementById("ws-questions").value.trim();
  const outputDiv = document.getElementById("ws-output");

  if (!topic || !grade || !questions) {
    alert("Please enter topic, grade, and number of questions!");
    return;
  }

  const language = detectLanguage(topic);
  outputDiv.innerText = "⏳ Creating worksheet...";

  const prompt = `
Create a ${questions}-question worksheet for Grade ${grade} on "${topic}".
IMPORTANT: Write all questions and instructions in ${language} only.
  `;

  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}

// 3️⃣ Knowledge Base + Search
async function generateKnowledgeBase() {
  const question = document.getElementById("kb-question").value.trim();
  const outputDiv = document.getElementById("kb-output");

  if (!question) {
    alert("Please enter a question!");
    return;
  }

  const language = detectLanguage(question);
  outputDiv.innerText = "⏳ Searching knowledge base...";

  const prompt = `
Answer the following question in ${language} only:
${question}
  `;

  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}

// 4️⃣ Visual Aid Designer
async function generateVisualAid() {
  const topic = document.getElementById("va-topic").value.trim();
  const outputDiv = document.getElementById("va-output");

  if (!topic) {
    alert("Please enter a topic!");
    return;
  }

  const language = detectLanguage(topic);
  outputDiv.innerText = "🎨 Generating visual idea...";

  const prompt = `
Describe a simple classroom visual aid for "${topic}".
IMPORTANT: The explanation must be in ${language} only.
  `;

  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}

// 5️⃣ Reading Assessment (Speech)
let speechSynthesisUtterance = null;

async function generateReadingAssessment() {
  const topic = document.getElementById("ra-topic").value.trim();
  const lang = document.getElementById("ra-lang").value.trim() || "en-US";
  const voiceType = document.getElementById("ra-voice").value;
  const volumeInput = document.getElementById("ra-volume");
  const volume = volumeInput ? parseFloat(volumeInput.value) : 1;
  const outputDiv = document.getElementById("ra-output");

  if (!topic) {
    alert("Please enter a topic!");
    return;
  }

  const language = detectLanguage(topic);
  outputDiv.innerText = "⏳ Preparing reading assessment...";

  const prompt = `
Generate a short reading passage on "${topic}" in ${language} only.
  `;

  const text = await realAIResponse(prompt);
  outputDiv.innerText = text;

  // Cancel any ongoing speech before starting new one
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

  // Show voice controls
  document.querySelector(".voice-controls").style.display = "flex";
  document.querySelector(".waveform").style.display = "flex";
}

function toggleSpeech() {
  if (!speechSynthesis.speaking && !speechSynthesis.paused) return;

  if (!speechSynthesis.paused) {
    speechSynthesis.pause();
    document.getElementById("ra-toggle").innerText = "▶ Resume";
  } else {
    speechSynthesis.resume();
    document.getElementById("ra-toggle").innerText = "⏸ Pause";
  }
}

function stopSpeech() {
  if (speechSynthesis.speaking || speechSynthesis.paused) {
    speechSynthesis.cancel();
  }
  document.getElementById("ra-toggle").innerText = "⏸ Pause";
  document.querySelector(".voice-controls").style.display = "none";
  document.querySelector(".waveform").style.display = "none";
}

// 6️⃣ Lesson Planner
async function generateLessonPlanner() {
  const grade = document.getElementById("lp-grade").value.trim();
  const subject = document.getElementById("lp-subject").value.trim();
  const outputDiv = document.getElementById("lp-output");

  if (!grade || !subject) {
    alert("Please enter grade and subject!");
    return;
  }

  const language = detectLanguage(subject);
  outputDiv.innerText = "⏳ Generating lesson plan...";

  const prompt = `
Create a weekly lesson plan for Grade ${grade} in subject "${subject}".
IMPORTANT: Write the entire response in ${language} only.
  `;

  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}

// Page fade-out effect
window.addEventListener('beforeunload', () => {
  document.body.style.opacity = '0';
});

