// =======================
// UI Navigation
// =======================
function openFeature(featureId) {
    document.querySelectorAll(".feature-section, .main-content").forEach(sec => sec.style.display = "none");
    document.getElementById(featureId).style.display = "block";

    document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
}

function goBack() {
    document.querySelectorAll(".feature-section").forEach(sec => sec.style.display = "none");
    document.getElementById("dashboard").style.display = "block";
    document.querySelectorAll(".menu button").forEach(btn => btn.classList.remove("active"));
    document.querySelector(".menu button:first-child").classList.add("active");
}

// =======================
// Content Generator
// =======================
function generateContentGenerator() {
    const topic = document.getElementById("cg-topic").value;
    const grade = document.getElementById("cg-grade").value;
    const output = document.getElementById("cg-output");

    output.innerHTML = `<strong>Generating content...</strong>`;
    setTimeout(() => {
        output.innerHTML = `Here’s AI-generated content for <b>${topic}</b> (Grade ${grade}).`;
    }, 1000);
}

// =======================
// Worksheet Creator
// =======================
function generateWorksheet() {
    const topic = document.getElementById("ws-topic").value;
    const grade = document.getElementById("ws-grade").value;
    const num = document.getElementById("ws-questions").value;
    const output = document.getElementById("ws-output");

    output.innerHTML = `<strong>Generating worksheet...</strong>`;
    setTimeout(() => {
        output.innerHTML = `Worksheet on <b>${topic}</b> for Grade ${grade} with ${num} questions.`;
    }, 1000);
}

// =======================
// Knowledge Base
// =======================
function generateKnowledgeBase() {
    const question = document.getElementById("kb-question").value;
    const output = document.getElementById("kb-output");

    output.innerHTML = `<strong>Searching knowledge base...</strong>`;
    setTimeout(() => {
        output.innerHTML = `Answer to your question: <b>${question}</b>.`;
    }, 1000);
}

// =======================
// Visual Aid Designer
// =======================
function generateVisualAid() {
    const topic = document.getElementById("va-topic").value;
    const output = document.getElementById("va-output");

    output.innerHTML = `<strong>Designing visual aid...</strong>`;
    setTimeout(() => {
        output.innerHTML = `Generated a visual representation for <b>${topic}</b>.`;
    }, 1000);
}

// =======================
// Reading Assessment
// =======================
let isSpeaking = false;

function generateReadingAssessment() {
    const topic = document.getElementById("ra-topic").value;
    const lang = document.getElementById("ra-lang").value;
    const voice = document.getElementById("ra-voice").value === "male" ? "UK English Male" : "UK English Female";
    const volume = document.getElementById("ra-volume").value;

    document.getElementById("ra-output").innerHTML = `Reading passage on: <b>${topic}</b>`;
    document.getElementById("voice-controls").style.display = "block";
    document.getElementById("waveform").style.display = "block";

    responsiveVoice.speak(`Reading passage for ${topic}`, voice, { volume: parseFloat(volume), rate: 1 });
    isSpeaking = true;
}

function toggleSpeech() {
    if (isSpeaking) {
        responsiveVoice.pause();
        document.getElementById("ra-toggle").innerText = "▶ Resume";
        isSpeaking = false;
    } else {
        responsiveVoice.resume();
        document.getElementById("ra-toggle").innerText = "⏸ Pause";
        isSpeaking = true;
    }
}

function stopSpeech() {
    responsiveVoice.cancel();
    isSpeaking = false;
    document.getElementById("ra-toggle").innerText = "⏸ Pause";
    document.getElementById("waveform").style.display = "none";
}

// =======================
// Lesson Planner
// =======================
function generateLessonPlanner() {
    const grade = document.getElementById("lp-grade").value;
    const subject = document.getElementById("lp-subject").value;
    const output = document.getElementById("lp-output");

    output.innerHTML = `<strong>Generating lesson plan...</strong>`;
    setTimeout(() => {
        output.innerHTML = `Lesson plan for Grade ${grade} on ${subject}.`;
    }, 1000);
}

// =======================
// Particle Background Animation
// =======================
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
