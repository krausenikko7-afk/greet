const agentsEl = document.getElementById("agents");
const chatSection = document.getElementById("chat-section");
const chatTitle = document.getElementById("chat-title");
const log = document.getElementById("log");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const backBtn = document.getElementById("back");

let currentAgentId = null;
let history = [];

function addMsg(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

async function loadAgents() {
  const agents = await fetch("/api/agents").then((r) => r.json());
  for (const [id, a] of Object.entries(agents)) {
    const card = document.createElement("button");
    card.className = "agent-card";
    card.innerHTML = `<div class="emoji">${a.emoji}</div><h3>${a.name}</h3><p>${a.blurb}</p>`;
    card.addEventListener("click", () => openChat(id, a));
    agentsEl.appendChild(card);
  }
}

function openChat(id, agent) {
  currentAgentId = id;
  history = [];
  log.innerHTML = "";
  chatTitle.textContent = `${agent.emoji} ${agent.name}`;
  agentsEl.hidden = true;
  chatSection.hidden = false;
  input.focus();
}

backBtn.addEventListener("click", () => {
  agentsEl.hidden = false;
  chatSection.hidden = true;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMsg("user", text);
  history.push({ role: "user", content: text });
  input.value = "";
  form.querySelector("button").disabled = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId: currentAgentId, history }),
    });
    const data = await res.json();
    if (data.error) {
      addMsg("error", data.error);
    } else {
      addMsg("agent", data.text);
      history.push({ role: "assistant", content: data.text });
    }
  } catch (err) {
    addMsg("error", String(err));
  } finally {
    form.querySelector("button").disabled = false;
    input.focus();
  }
});

loadAgents();
