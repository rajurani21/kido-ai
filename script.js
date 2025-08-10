// script.js
// All-features frontend (works with your index.html + style.css)
// - typing animation
// - particle background
// - feature navigation
// - calls real backend if available, falls back to mock text
// - reading assessment with ResponsiveVoice (if included)

(() => {
  // ===== Configuration =====
  const API_URL = "https://kido-ai-952519942620.asia-south1.run.app/generate-content";
  const USE_REAL_BACKEND = true; // set false to force mock responses

  // ===== Utility: safe async typing (shows final HTML after typing plain text) =====
  async function typeText(element, finalHTML, speed = 20) {
    if (!element) return;
    const parser = new DOMParser();
    const plain = parser.parseFromString(finalHTML, "text/html").body.textContent || finalHTML;
    element.innerHTML = "";
    for (let i = 1; i <= plain.length; i++) {
      element.innerText = plain.slice(0, i);
      await new Promise((r) => setTimeout(r, speed));
    }
    // finally set formatted HTML (safe because we typed plain text first)
    element.innerHTML = finalHTML;
  }

  // ===== Backend call with graceful fallback =====
  async function realAIResponse(prompt) {
    if (!USE_REAL_BACKEND) {
      console.warn("Backend disabled — returning mock response.");
      return `**(mock)** Response for prompt: ${prompt}`;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn("Backend returned error status:", res.status);
        return `⚠️ Server error: ${res.status}`;
      }

      const data = await res.json();
      if (!data || typeof data.result !== "string") {
        console.warn("Unexpected backend response:", data);
        return `⚠️ Unexpected response from backend.`;
      }
      return data.result.trim();
    } catch (err) {
      console.error("❌ AI request failed:", err);
      return `⚠️ Could not reach backend: ${err.message}`;
    }
  }

  // ===== Navigation (menu mapping done on load so HTML unchanged) =====
  function openFeature(featureId) {
    // hide everything
    document.querySelectorAll(".feature-section, .main-content").forEach((sec) => (sec.style.display = "none"));

    const target = document.getElementById(featureId);
    if (!target) {
      console.warn("openFeature: unknown featureId", featureId);
      return;
    }
    target.style.display = "block";

    // mark active button by dataset.target if set, else by the mapping we set on load
    document.querySelectorAll(".menu button").forEach((btn) => {
      const btnTarget = btn.dataset.target;
      btn.classList.toggle("active", btnTarget === featureId);
    });
  }

  function goBack() {
    document.querySelectorAll(".feature-section").forEach((sec) => (sec.style.display = "none"));
    const dash = document.getElementById("dashboard");
    if (dash) dash.style.display = "block";
    // set first menu button active (if any)
    const first = document.querySelector(".menu button");
    document.querySelectorAll(".menu button").forEach((b) => b.classList.remove("active"));
    if (first) first.classList.add("active");
  }

  // ===== Features =====
  async function generateContentGenerator() {
    const topic = document.getElementById("cg-topic")?.value?.trim();
    const grade = document.getElementById("cg-grade")?.value?.trim();
    const output = document.getElementById("cg-output");
    if (!topic || !grade) {
      alert("Please enter topic and grade!");
      return;
    }

    await typeText(output, `Generating content for "${topic}" (Grade ${grade})...`);
    const prompt = `Generate engaging lesson content for grade ${grade} about: ${topic}`;

    let result = await realAIResponse(prompt);
    // fallback if backend unreachable
    if (result.startsWith("⚠️ Could not reach backend") || result.startsWith("⚠️ Server")) {
      result = `<strong>Sample content</strong>\nIntroduction to ${topic} for Grade ${grade}.\nKey points:\n- Point 1\n- Point 2\n`;
    }

    // set final (allow simple html like <strong>, <em>, <ul> if returned)
    await typeText(output, result, 14);
  }

  async function generateWorksheet() {
    const topic = document.getElementById("ws-topic")?.value?.trim();
    const grade = document.getElementById("ws-grade")?.value?.trim();
    const questions = document.getElementById("ws-questions")?.value?.trim() || "5";
    const output = document.getElementById("ws-output");
    if (!topic || !grade) return alert("Please enter topic and grade!");

    await typeText(output, `Creating worksheet for "${topic}" (Grade ${grade})...`);
    const prompt = `Create a ${questions}-question worksheet for grade ${grade} on ${topic} (mix question types).`;
    let result = await realAIResponse(prompt);
    if (result.startsWith("⚠️ Could not reach backend")) {
      result = `Worksheet for ${topic} - Grade ${grade}\n1. (MCQ) ...\n2. (Short) ...`;
    }
    await typeText(output, result, 14);
  }

  async function generateKnowledgeBase() {
    const question = document.getElementById("kb-question")?.value?.trim();
    const output = document.getElementById("kb-output");
    if (!question) return alert("Please enter a question!");

    await typeText(output, `Searching knowledge base for: "${question}"...`);
    const prompt = `Answer concisely: ${question}`;
    let result = await realAIResponse(prompt);
    if (result.startsWith("⚠️ Could not reach backend")) {
      result = `Sample answer to: ${question}`;
    }
    await typeText(output, result, 14);
  }

  async function generateVisualAid() {
    const topic = document.getElementById("va-topic")?.value?.trim();
    const output = document.getElementById("va-output");
    if (!topic) return alert("Please enter a topic!");

    await typeText(output, `Designing visual aid for "${topic}"...`);
    const prompt = `Describe a simple visual aid for teaching: ${topic} (step-by-step).`;
    let result = await realAIResponse(prompt);
    if (result.startsWith("⚠️ Could not reach backend")) {
      result = `Visual aid idea for ${topic}:\n- Draw ...\n- Label ...`;
    }
    await typeText(output, result, 14);
  }

  // Reading assessment + TTS (ResponsiveVoice if available)
  let isSpeaking = false;
  function showVoiceControls(show) {
    const vc = document.getElementById("voice-controls");
    const wf = document.getElementById("waveform");
    if (vc) vc.style.display = show ? "flex" : "none";
    if (wf) wf.style.display = show ? "flex" : "none";
  }

  async function generateReadingAssessment() {
    const topic = document.getElementById("ra-topic")?.value?.trim();
    const voiceChoice = document.getElementById("ra-voice")?.value || "female";
    const volume = parseFloat(document.getElementById("ra-volume")?.value || "1");
    const output = document.getElementById("ra-output");
    if (!topic) return alert("Please enter passage topic!");

    await typeText(output, `Generating reading passage for "${topic}"...`);
    const prompt = `Write a simple reading passage about: ${topic}`;
    let text = await realAIResponse(prompt);
    if (text.startsWith("⚠️ Could not reach backend")) {
      text = `Sample reading passage about ${topic}: Once upon a time...`;
    }
    await typeText(output, text, 14);

    // TTS: prefer ResponsiveVoice if loaded, else try Web Speech API
    showVoiceControls(true);

    if (window.responsiveVoice && window.responsiveVoice.speak) {
      const voiceName = voiceChoice === "male" ? "UK English Male" : "UK English Female";
      try {
        window.responsiveVoice.speak(text, voiceName, { volume, rate: 1 });
        isSpeaking = true;
      } catch (err) {
        console.warn("ResponsiveVoice error:", err);
      }
    } else if ("speechSynthesis" in window) {
      // Web Speech API fallback
      const utter = new SpeechSynthesisUtterance(text);
      utter.volume = volume;
      utter.lang = "en-US";
      // try to pick male/female if available (best-effort)
      const voices = speechSynthesis.getVoices();
      if (voiceChoice === "female") {
        const v = voices.find((v) => /female/i.test(v.name));
        if (v) utter.voice = v;
      } else {
        const v = voices.find((v) => /male/i.test(v.name));
        if (v) utter.voice = v;
      }
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
      isSpeaking = true;
    } else {
      console.warn("No TTS available in this browser.");
    }
  }

  function toggleSpeech() {
    if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
      // responsiveVoice doesn't have reliable isPlaying in some builds; best-effort
      try {
        window.responsiveVoice.pause();
        document.getElementById("ra-toggle").innerText = "▶ Resume";
        isSpeaking = false;
        return;
      } catch {}
    }

    if (isSpeaking && "speechSynthesis" in window) {
      speechSynthesis.pause();
      document.getElementById("ra-toggle").innerText = "▶ Resume";
      isSpeaking = false;
    } else if ("speechSynthesis" in window) {
      speechSynthesis.resume();
      document.getElementById("ra-toggle").innerText = "⏸ Pause";
      isSpeaking = true;
    }
  }

  function stopSpeech() {
    if (window.responsiveVoice && window.responsiveVoice.cancel) {
      try {
        window.responsiveVoice.cancel();
      } catch {}
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    isSpeaking = false;
    document.getElementById("ra-toggle").innerText = "⏸ Pause";
    showVoiceControls(false);
  }

  async function generateLessonPlanner() {
    const grade = document.getElementById("lp-grade")?.value?.trim();
    const subject = document.getElementById("lp-subject")?.value?.trim();
    const output = document.getElementById("lp-output");
    if (!grade || !subject) return alert("Please enter grade and subject!");

    await typeText(output, `Creating lesson plan for ${subject} (Grade ${grade})...`);
    const prompt = `Create a weekly lesson plan for grade ${grade} for subject ${subject}`;
    let result = await realAIResponse(prompt);
    if (result.startsWith("⚠️ Could not reach backend")) {
      result = `Sample lesson plan for ${subject} - Grade ${grade}`;
    }
    await typeText(output, result, 14);
  }

  // ===== Particle background (guarded) =====
  function startParticles() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let cw = (canvas.width = window.innerWidth);
    let ch = (canvas.height = window.innerHeight);

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.baseHue = Math.random() * 360;
        this.color = `hsl(${this.baseHue}, 100%, 60%)`;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.glow = 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > cw) this.vx *= -1;
        if (this.y < 0 || this.y > ch) this.vy *= -1;
        this.glow *= 0.92;
      }
      draw() {
        ctx.shadowBlur = 20 + this.glow * 30;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particles = Array.from({ length: 100 }, () => new Particle(Math.random() * cw, Math.random() * ch));

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = particles[a].color;
            ctx.lineWidth = 0.3;
            ctx.globalAlpha = 1 - dist / 120;
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

    function loop() {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, cw, ch);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener("resize", () => {
      cw = canvas.width = window.innerWidth;
      ch = canvas.height = window.innerHeight;
    });
  }

  // ===== Init on DOM ready =====
  document.addEventListener("DOMContentLoaded", () => {
    // attach dataset.target mapping to menu buttons (keeps your HTML intact)
    const mapping = [
      "dashboard",
      "content-generator",
      "worksheet-creator",
      "lesson-planner",
      "visual-aid-designer",
      "knowledge-base",
      "reading-assessment",
    ];
    const menuButtons = Array.from(document.querySelectorAll(".menu button"));
    menuButtons.forEach((btn, i) => {
      if (!btn.dataset.target) btn.dataset.target = mapping[i] || "";
      // attach safe click handler that uses our mapping
      btn.addEventListener("click", (e) => {
        const t = btn.dataset.target;
        if (t) openFeature(t);
      });
    });

    // default show dashboard
    openFeature("dashboard");

    // wire global functions to window so inline buttons still work
    window.openFeature = openFeature;
    window.goBack = goBack;
    window.generateContentGenerator = generateContentGenerator;
    window.generateWorksheet = generateWorksheet;
    window.generateKnowledgeBase = generateKnowledgeBase;
    window.generateVisualAid = generateVisualAid;
    window.generateReadingAssessment = generateReadingAssessment;
    window.toggleSpeech = toggleSpeech;
    window.stopSpeech = stopSpeech;
    window.generateLessonPlanner = generateLessonPlanner;

    // start particle bg
    startParticles();
  });
})();
