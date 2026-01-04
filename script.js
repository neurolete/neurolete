// ---------- CONFIG ----------
// Paste your signup endpoint here (Google Apps Script or Formspree).
// If blank, the form will still validate but won't submit anywhere.
const SIGNUP_ENDPOINT_URL = ""; // e.g. "https://script.google.com/macros/s/XXXX/exec"

const gate = document.getElementById("gate");
const app = document.getElementById("app");
const enterBtn = document.getElementById("enterBtn");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

const subscribeForm = document.getElementById("subscribeForm");
const statusEl = document.getElementById("formStatus");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

// ----- ENTER -----
enterBtn.addEventListener("click", () => {
  gate.style.opacity = "0";
  gate.style.pointerEvents = "none";

  setTimeout(() => {
    gate.style.display = "none";
    app.classList.remove("app--hidden");
    app.setAttribute("aria-hidden", "false");

    // Smoothly land at hero
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 220);
});

// ----- MODAL CONTENT -----
const modalContent = {
  athlete: `
    <h2 style="margin:0 0 10px">Athlete Pathway</h2>
    <p style="color:rgba(231,236,234,.78); margin:0 0 14px; line-height:1.6">
      Built for current & former pro-athletes who already have the physical training —
      but need the missing playbook for the mind, recovery, and identity.
    </p>
    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">What this looks like</h3>
      <ul class="list">
        <li>Nervous system regulation + recovery protocols tailored to your season/off-season.</li>
        <li>High-level mindset training for pressure, noise, confidence, composure.</li>
        <li>Nutrition + body composition strategy that supports performance and longevity.</li>
        <li>Identity & transition work so you stay grounded beyond the “game”.</li>
      </ul>
      <p style="color:rgba(231,236,234,.68); margin:12px 0 0">
        Want to explore fit? Use the email form below to get the next steps.
      </p>
    </div>
  `,
  executive: `
    <h2 style="margin:0 0 10px">Executive Pathway</h2>
    <p style="color:rgba(231,236,234,.78); margin:0 0 14px; line-height:1.6">
      For leaders who treat business as their sport — and want to win without burning out.
      Lead with clarity, thrive under pressure, and build the body + health that sustains the output.
    </p>
    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">What this looks like</h3>
      <ul class="list">
        <li>Mindset performance coaching for pressure, decision-making, leadership.</li>
        <li>Fitness + body composition programming that’s safe, effective, and sustainable.</li>
        <li>Nutrition protocols designed for performance — not survival.</li>
        <li>Lifestyle + identity work so you’re not “waiting until later” to live well.</li>
      </ul>
      <p style="color:rgba(231,236,234,.68); margin:12px 0 0">
        Want to explore fit? Use the email form below to get the next steps.
      </p>
    </div>
  `,
};

// open modal buttons
document.querySelectorAll("[data-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-open");
    modalBody.innerHTML = modalContent[key] || "";
    modal.classList.add("isOpen");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

// close modal
modal.addEventListener("click", (e) => {
  const shouldClose = e.target && e.target.getAttribute("data-close") === "true";
  if (shouldClose) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("isOpen")) closeModal();
});

function closeModal() {
  modal.classList.remove("isOpen");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// ----- SUBSCRIBE FORM -----
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
    // Use POST with JSON
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
  // Cursor glow follow
const glow = document.querySelector(".cursorGlow");
window.addEventListener("mousemove", (e) => {
  if (!glow) return;
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// Scroll reveal (simple + clean)
const revealEls = document.querySelectorAll(".card, .section__head, .quote, .tableWrap");
revealEls.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("reveal--in");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));
});
