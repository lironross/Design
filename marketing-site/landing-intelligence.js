// Interactive content reused from the existing intelligence landing build.
const queryExamples = {
  work: {
    place: "Monday Coffee",
    score: "9.2",
    intent: "Excellent match for a focused work session",
    signals: ["Dependable Wi-Fi", "Outlets near most tables", "Quiet weekday atmosphere"],
    evidence: "Based on 184 recent signals · verified July 2026 · high confidence",
    image: "Images/2.png",
    alt: "Bright café interior"
  },
  celiac: {
    place: "Example Bakery",
    score: "9.6",
    intent: "Strong match for a celiac-safe bakery near your hotel",
    signals: ["Dedicated preparation area", "Cross-contact details", "Recent community validation"],
    evidence: "Based on 126 dietary-safety signals · verified July 2026 · high confidence",
    image: "Images/5.png",
    alt: "Bakery display case with pastries"
  },
  conversation: {
    place: "Example Bar",
    score: "8.9",
    intent: "Lively atmosphere with space for conversation",
    signals: ["Low-noise seating zone", "Energetic after 8pm", "Tables suited to small groups"],
    evidence: "Based on 211 recent signals · verified July 2026 · medium-high confidence",
    image: "Images/7.png",
    alt: "Warmly lit bar and restaurant interior"
  }
};

const queryButtons = Array.from(document.querySelectorAll("[data-query-key]"));
const queryImage = document.querySelector("[data-query-image]");
const queryPlace = document.querySelector("[data-query-place]");
const queryScore = document.querySelector("[data-query-score]");
const queryIntent = document.querySelector("[data-query-intent]");
const querySignals = document.querySelector("[data-query-signals]");
const queryEvidence = document.querySelector("[data-query-evidence]");

function renderQuery(key) {
  const example = queryExamples[key];
  if (!example || !queryImage || !querySignals) return;

  queryButtons.forEach((button) => {
    const isActive = button.dataset.queryKey === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  queryImage.src = example.image;
  queryImage.alt = example.alt;
  queryPlace.textContent = example.place;
  queryScore.textContent = example.score;
  queryIntent.textContent = example.intent;
  queryEvidence.textContent = example.evidence;
  querySignals.replaceChildren(
    ...example.signals.map((signal) => {
      const item = document.createElement("li");
      item.textContent = signal;
      return item;
    })
  );
}

queryButtons.forEach((button) => {
  button.addEventListener("click", () => renderQuery(button.dataset.queryKey));
});

const contextExamples = {
  work: {
    score: "9.2",
    title: "A café to focus and work",
    reasons: ["🛜 Dependable Wi-Fi", "🔌 Power outlets", "🤫 Quiet weekday atmosphere"],
    summary: "<strong>An ideal café for remote work</strong>, this spot offers cozy ambiance, dependable Wi‑Fi, plenty of power outlets, and gentle background music."
  },
  dog: {
    score: "8.7",
    title: "A dog-friendly café",
    reasons: ["🐕 Dogs welcome indoors", "💧 Water bowls available", "😌 Best for calm weekday visits"],
    summary: "<strong>Dogs are welcome in this laid-back space.</strong> Your furry friend will receive a bowl of water and a friendly smile from the staff. It's particularly suited for quieter dogs, as many visitors prefer to work remotely here and appreciate the quiet."
  },
  date: {
    score: "6.4",
    title: "A café for a first date",
    reasons: ["💡 Bright communal seating", "💻 Work-focused atmosphere", "🪑 Limited intimate tables"],
    summary: "<strong>While this location has its merits,</strong> it may not be the most suitable choice for impressing a date. The ambiance leans heavily towards a work-oriented vibe, which can detract from the intimacy and warmth typically desired for a romantic outing."
  }
};

const contextTabs = Array.from(document.querySelectorAll("[data-context-key]"));
const contextScore = document.querySelector("[data-context-score]");
const contextTitle = document.querySelector("[data-context-title]");
const contextReasons = document.querySelector("[data-context-reasons]");
const contextSummary = document.querySelector("[data-context-summary]");

function renderContext(key) {
  const example = contextExamples[key];
  if (!example || !contextReasons) return;

  contextTabs.forEach((tab) => {
    const isActive = tab.dataset.contextKey === key;
    const icon = tab.querySelector("img");
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (icon) {
      icon.src = isActive ? "assets/figma/search-active.svg" : "assets/figma/search-muted.svg";
    }
  });

  contextScore.textContent = example.score;
  contextTitle.textContent = example.title;
  contextSummary.innerHTML = example.summary;
  contextReasons.replaceChildren(
    ...example.reasons.map((reason) => {
      const item = document.createElement("li");
      item.textContent = reason;
      return item;
    })
  );
}

contextTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderContext(tab.dataset.contextKey));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + contextTabs.length) % contextTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % contextTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = contextTabs.length - 1;

    contextTabs[nextIndex].focus();
    renderContext(contextTabs[nextIndex].dataset.contextKey);
  });
});
