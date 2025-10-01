const API_URL = "https://kido-backend-952519942620.asia-south1.run.app/generate-content";

async function generateContent() {
  const userPrompt = prompt("Enter your teaching idea:");
  if (!userPrompt) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt })
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    alert(data.result || "No result received.");
  } catch (error) {
    console.error(error);
    alert("❌ Error connecting to server.");
  }
}

