// =====================================
//  KIDO AI Frontend Script (Multilingual Updated)
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

// Helper: Detect language from input text
function detectLanguage(text) {
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";       // Telugu
  if (/[\u0900-\u097F]/.test(text)) return "Hindi";        // Hindi/Devanagari
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";        // Tamil
  if (/[\u0C80-\u0CFF]/.test(text)) return "Kannada";      // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return "Malayalam";    // Malayalam
  return "English"; // fallback
}

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
  const outputDiv = document.getElementById("cg-output");

  if (!topic || !grade) {
    alert("Please enter topic and grade!");
    return;
  }

  outputDiv.innerText = "⏳ Generating content...";
  const lang = detectLanguage(topic);

  const prompt = `Generate a Grade ${grade} lesson about "${topic}". 
  Respond ONLY in ${lang} language. Do not translate to English.`;

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

  outputDiv.innerText = "⏳ Creating worksheet...";
  const lang = detectLanguage(topic);

  const prompt = `Create a ${questions}-question worksheet for grade ${grade} on "${topic}". 
  Respond ONLY in ${lang} language.`;

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

  outputDiv.innerText = "⏳ Searching knowledge base...";
  const lang = detectLanguage(question);

  const prompt = `Answer the following question in ${lang} language only: ${question}`;
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

  outputDiv.innerText = "🎨 Generating visual idea...";
  const lang = detectLanguage(topic);

  const prompt = `Describe a simple visual aid for "${topic}". Respond ONLY in ${lang}.`;
  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}

// 🌍 Extended language detection with proper codes
function detectLanguage(text) {
  const telugu = /[\u0C00-\u0C7F]/;
  const hindi = /[\u0900-\u097F]/;
  const tamil = /[\u0B80-\u0BFF]/;
  const kannada = /[\u0C80-\u0CFF]/;
  const malayalam = /[\u0D00-\u0D7F]/;
  const bengali = /[\u0980-\u09FF]/;
  const gujarati = /[\u0A80-\u0AFF]/;
  const punjabi = /[\u0A00-\u0A7F]/;
  const urdu = /[\u0600-\u06FF]/;

  if (telugu.test(text)) return { lang: "Telugu", code: "te-IN" };
  if (hindi.test(text)) return { lang: "Hindi", code: "hi-IN" };
  if (tamil.test(text)) return { lang: "Tamil", code: "ta-IN" };
  if (kannada.test(text)) return { lang: "Kannada", code: "kn-IN" };
  if (malayalam.test(text)) return { lang: "Malayalam", code: "ml-IN" };
  if (bengali.test(text)) return { lang: "Bengali", code: "bn-IN" };
  if (gujarati.test(text)) return { lang: "Gujarati", code: "gu-IN" };
  if (punjabi.test(text)) return { lang: "Punjabi", code: "pa-IN" };
  if (urdu.test(text)) return { lang: "Urdu", code: "ur-IN" };

  // Default to English
  return { lang: "English", code: "en-US" };
}

// 5️⃣ Reading Assessment (Speech)
let speechSynthesisUtterance = null;

async function generateReadingAssessment() {
  const topic = document.getElementById("ra-topic").value.trim();
  const voiceType = document.getElementById("ra-voice").value;
  const volumeInput = document.getElementById("ra-volume");
  const volume = volumeInput ? parseFloat(volumeInput.value) : 1;
  const outputDiv = document.getElementById("ra-output");

  if (!topic) {
    alert("Please enter a topic!");
    return;
  }

  outputDiv.innerText = "⏳ Preparing reading assessment...";

  // Detect input language
  const { lang, code } = detectLanguage(topic);

  // Prompt AI to reply in same language
  const prompt = `Generate a short reading passage for topic "${topic}". Respond ONLY in ${lang}.`;
  const text = await realAIResponse(prompt);
  outputDiv.innerText = text;

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  // Setup speech synthesis
  speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
  speechSynthesisUtterance.lang = code; // Use detected voice code
  speechSynthesisUtterance.volume = volume;

  // Wait for voices to be loaded
  let voices = speechSynthesis.getVoices();
  if (!voices.length) {
    await new Promise(resolve => {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve();
      };
    });
  }

  // Pick gendered voice if available
  if (voiceType === "female") {
    const femaleVoice = voices.find(v => /female/i.test(v.name) || v.name.toLowerCase().includes("zira"));
    if (femaleVoice) speechSynthesisUtterance.voice = femaleVoice;
  } else {
    const maleVoice = voices.find(v => /male/i.test(v.name) || v.name.toLowerCase().includes("david"));
    if (maleVoice) speechSynthesisUtterance.voice = maleVoice;
  }

  // Speak the passage
  speechSynthesis.speak(speechSynthesisUtterance);

  // Show voice controls + waveform UI
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

  outputDiv.innerText = "⏳ Generating lesson plan...";
  const lang = detectLanguage(subject);

  const prompt = `Create a weekly lesson plan for grade ${grade} in "${subject}". Respond ONLY in ${lang}.`;
  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}

window.addEventListener('beforeunload', () => {
  document.body.style.opacity = '0';
});

