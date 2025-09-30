
// =====================================
//  KIDO AI Frontend Script (Updated)
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
  // Added language select fallback:
  const languageInput = document.getElementById("cg-language");
  const language = languageInput ? languageInput.value.trim() : "English";

  const outputDiv = document.getElementById("cg-output");

  if (!topic || !grade) {
    alert("Please enter topic and grade!");
    return;
  }

  outputDiv.innerText = "⏳ Generating content...";
  const prompt = `Generate ${language} lesson content for grade ${grade} about ${topic}`;
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
  const prompt = `Create a ${questions}-question worksheet for grade ${grade} on ${topic}`;
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
  const prompt = `Answer the following question: ${question}`;
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
  const prompt = `Describe a simple visual aid for: ${topic}`;
  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}

// 5️⃣ Reading Assessment (Speech)
let speechSynthesisUtterance = null;
let isPaused = false;

async function generateReadingAssessment() {
  // In HTML you have id="ra-topic" and "ra-lang", no "ra-grade"
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

  outputDiv.innerText = "⏳ Preparing reading assessment...";
  const prompt = `Generate a short reading passage for topic: ${topic}`;
  const text = await realAIResponse(prompt);
  outputDiv.innerText = text;

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
  speechSynthesisUtterance.lang = lang;
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
  // Hide voice controls and waveform
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
  const prompt = `Create a weekly lesson plan for grade ${grade} in ${subject}`;
  const result = await realAIResponse(prompt);
  outputDiv.innerText = result;
}
window.addEventListener('beforeunload', () => {
  document.body.style.opacity = '0';
});
