// ---------- CONFIG ----------
// Paste your signup endpoint here (Google Apps Script or Formspree). If blank, the form shows a helpful message.
const SIGNUP_ENDPOINT_URL = ""; // e.g. "https://script.google.com/macros/s/XXXX/exec"

const gate = document.getElementById("gate");
const app = document.getElementById("app");
const enterBtn = document.getElementById("enterBtn");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

const subscribeForm = document.getElementById("subscribeForm");
const statusEl = document.getElementById("formStatus");

const yearEl = document.getElementById("year");
const signalValue = document.getElementById("signalValue");

yearEl.textContent = new Date().getFullYear();

// ---------- Cursor glow ----------
const glow = document.querySelector(".cursorGlow");
window.addEventListener("mousemove", (e) => {
  if (!glow) return;
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ---------- Starfield canvas ----------
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w, h, stars;
function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = canvas.width = Math.floor(window.innerWidth * dpr);
  h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  const count = Math.floor((window.innerWidth * window.innerHeight) / 12000);
  const n = Math.max(90, Math.min(240, count));
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: (Math.random() * 1.2 + 0.25) * dpr,
    a: Math.random() * 0.7 + 0.15,
    s: (Math.random() * 0.45 + 0.15) * dpr,
  }));
}
window.addEventListener("resize", resize);
resize();

function draw() {
  ctx.clearRect(0, 0, w, h);

  // green nebula glow
  const g = ctx.createRadialGradient(w * 0.7, h * 0.2, 0, w * 0.7, h * 0.2, Math.max(w, h) * 0.75);
  g.addColorStop(0, "rgba(87,255,122,0.08)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  for (const st of stars) {
    st.y += st.s;
    if (st.y > h + 10) {
      st.y = -10;
      st.x = Math.random() * w;
    }
    const tw = (Math.sin((st.x + st.y) * 0.002) + 1) * 0.25;
    const alpha = Math.min(0.9, st.a + tw * 0.35);

    ctx.beginPath();
    ctx.fillStyle = `rgba(234,240,238,${alpha})`;
    ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// ---------- “signal” cycling ----------
const signals = ["stability ↑", "clarity ↑", "recovery ↑", "output ↑", "focus ↑"];
let si = 0;
setInterval(() => {
  if (!signalValue) return;
  si = (si + 1) % signals.length;
  signalValue.textContent = signals[si];
}, 1600);

// ---------- ENTER transition (bulletproof) ----------
if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    gate.style.transition = "opacity 260ms ease, transform 260ms ease, filter 260ms ease";
    gate.style.transform = "scale(1.01)";
    gate.style.filter = "brightness(1.05)";
    gate.style.opacity = "0";
    gate.style.pointerEvents = "none";

    setTimeout(() => {
      gate.style.display = "none";
      app.classList.remove("app--hidden");
      app.setAttribute("aria-hidden", "false");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 280);
  });
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("reveal--in");
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => io.observe(el));

// ---------- Card tilt ----------
function attachTilt(el) {
  const max = 10;
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (y - 0.5) * -max;
    const ry = (x - 0.5) * max;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
}
document.querySelectorAll(".tilt").forEach(attachTilt);

// ---------- Modal ----------
const modalContent = {
  athlete: `
    <h2 style="margin:0 0 10px; font-family:Orbitron, sans-serif; letter-spacing:.08em;">Athlete Pathway</h2>
    <p style="color:rgba(234,240,238,.78); margin:0 0 14px; line-height:1.65;">
      For current and former pro-athletes who want their edge to last. This is reprogramming for performance, recovery,
      and identity — on and off the ice/field/court.
    </p>

    <div style="display:grid; gap:12px;">
      <div class="card">
        <h3 style="margin:0 0 8px; font-family:Orbitron, sans-serif; letter-spacing:.06em;">Core outcomes</h3>
        <ul class="list">
          <li><strong>Pressure control:</strong> composure, focus, confidence that holds up in big moments.</li>
          <li><strong>Recovery upgrade:</strong> regulation + sleep + recovery behavior engineered into your week.</li>
          <li><strong>Physique & fuel:</strong> nutrition and body composition aligned with performance.</li>
          <li><strong>Identity expansion:</strong> performance without losing yourself to the role.</li>
        </ul>
      </div>

      <div class="card">
        <h3 style="margin:0 0 8px; font-family:Orbitron, sans-serif; letter-spacing:.06em;">This is for you if</h3>
        <ul class="list">
          <li>You’re high-performing but wired, foggy, heavy, or inconsistent underneath.</li>
          <li>You train hard but recovery is lagging, sleep is off, or stress runs the show.</li>
          <li>You want a system that holds up under travel, pressure, and real life.</li>
        </ul>
      </div>
      <p style="color:rgba(234,240,238,.72); margin:0;">
        Want next steps? Subscribe below — we’ll send the intake link + updates.
      </p>
    </div>
  `,
  executive: `
    <h2 style="margin:0 0 10px; font-family:Orbitron, sans-serif; letter-spacing:.08em;">Executive Pathway</h2>
    <p style="color:rgba(234,240,238,.78); margin:0 0 14px; line-height:1.65;">
      For men running teams, companies, portfolios, and families — and refusing to sacrifice health to keep winning.
      We build the nervous system + body that can sustain output.
    </p>

    <div style="display:grid; gap:12px;">
      <div class="card">
        <h3 style="margin:0 0 8px; font-family:Orbitron, sans-serif; letter-spacing:.06em;">Core outcomes</h3>
        <ul class="list">
          <li><strong>Clarity under pressure:</strong> steadier decisions, stronger presence, less noise.</li>
          <li><strong>Body composition:</strong> leaner, stronger, more capable — built with a plan.</li>
          <li><strong>Fuel strategy:</strong> nutrition designed around performance + lifestyle reality.</li>
          <li><strong>Identity + lifestyle:</strong> systems that match your standards (not your excuses).</li>
        </ul>
      </div>

      <div class="card">
        <h3 style="margin:0 0 8px; font-family:Orbitron, sans-serif; letter-spacing:.06em;">This is for you if</h3>
        <ul class="list">
          <li>You’re productive but living on edge or burnt out underneath.</li>
          <li>Your fitness is inconsistent because your calendar owns you.</li>
          <li>You want a simple system that makes execution automatic.</li>
        </ul>
      </div>
      <p style="color:rgba(234,240,238,.72); margin:0;">
        Want next steps? Subscribe below — we’ll send the intake link + updates.
      </p>
    </div>
  `,
};

function openModal(key) {
  modalBody.innerHTML = modalContent[key] || "";
  modal.classList.add("isOpen");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("isOpen");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open]").forEach((el) => {
  el.addEventListener("click", (e) => {
    const key = el.getAttribute("data-open");
    openModal(key);
  });

  // keyboard support
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const key = el.getAttribute("data-open");
      openModal(key);
    }
  });
});

modal.addEventListener("click", (e) => {
  const shouldClose = e.target && e.target.getAttribute("data-close") === "true";
  if (shouldClose) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("isOpen")) closeModal();
});

// ---------- Subscribe form ----------
subscribeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";

  const formData = new FormData(subscribeForm);
  const payload = Object.fromEntries(formData.entries());

  if (!SIGNUP_ENDPOINT_URL) {
    statusEl.textContent = "Add your signup endpoint URL in script.js to collect emails.";
    return;
  }

  statusEl.textContent = "Submitting…";

  try {
    const res = await fetch(SIGNUP_ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    statusEl.textContent = "You’re in. ✅";
    subscribeForm.reset();
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Something glitched. Try again.";
  }
});
