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
    reasons: ["🛜 Dependable Wi-Fi", "🔌 Outlets near most tables", "🤫 Quiet weekday atmosphere"],
    summary: "<strong>An ideal café for remote work</strong>, this spot offers a brew that keeps you energized, <strong>cozy ambiance and dependable Wi-Fi</strong>, it’s perfect for productivity. You'll find <strong>plenty of power outlets</strong> and the soundtrack plays gentle tunes."
  },
  dog: {
    score: "6.5",
    title: "Dog-friendly café",
    reasons: ["🐕 Not ideal for pets", "🤫 Calm indoor seating", "👨‍💻 Work friendly environment"],
    summary: "This cozy café <strong>isn't dog-friendly as barking can annoy the staff and disrupt the calm vibe.</strong> While the menu is great for humans, the indoor seating is ideal for those wanting peace. It's <strong>best to leave your pup at home for a more relaxing visit.</strong>"
  },
  date: {
    score: "8.9",
    title: "A café for a first date",
    reasons: ["💕 Romantic downstairs", "💡 Soft lighting", "🎶 Mellow tunes", "💬 Good for conversations"],
    summary: "The café's <strong>cozy downstairs vibe is perfect for a romantic date</strong>, featuring <strong>soft lighting and comfy seating for couples</strong> to relax with mellow tunes. The <strong>upstairs area is dedicated for working on laptops.</strong>"
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

const mobileIntentCarousel = document.querySelector("[data-mobile-intent-carousel]");

if (mobileIntentCarousel) {
  const viewport = mobileIntentCarousel.querySelector("[data-mobile-intent-viewport]");
  const track = mobileIntentCarousel.querySelector(".mobile-intent-carousel__track");
  const slides = Array.from(mobileIntentCarousel.querySelectorAll(".mobile-intent-carousel__slide"));
  const dots = Array.from(mobileIntentCarousel.querySelectorAll("[data-mobile-intent-dot]"));
  const mobileReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileLayout = window.matchMedia("(max-width: 720px)");
  const autoplayDelay = 5000;
  let activeIndex = 0;
  let autoplayTimer;
  let interactionActive = false;
  let activePointerId;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragDeltaX = 0;
  let horizontalDrag = false;

  function updatePagination(index) {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
  }

  function slideOffset(index) {
    return slides[index]?.offsetLeft || 0;
  }

  function positionTrack(index, delta = 0, animate = false) {
    if (!track) return;
    track.classList.toggle("is-animating", animate && !mobileReducedMotion.matches);
    track.classList.toggle("is-dragging", delta !== 0);
    track.style.transform = `translate3d(${-slideOffset(index) + delta}px, 0, 0)`;
  }

  function goToSlide(index, behavior = "smooth") {
    if (!viewport || !track || slides.length === 0) return;
    const nextIndex = (index + slides.length) % slides.length;
    const wrapsToStart = activeIndex === slides.length - 1 && nextIndex === 0;
    updatePagination(nextIndex);
    positionTrack(nextIndex, 0, behavior !== "auto" && !wrapsToStart);
  }

  function stopAutoplay() {
    window.clearTimeout(autoplayTimer);
    autoplayTimer = undefined;
  }

  function startAutoplay() {
    stopAutoplay();
    if (!mobileLayout.matches || interactionActive || document.hidden) return;
    autoplayTimer = window.setTimeout(() => {
      goToSlide(activeIndex + 1);
      startAutoplay();
    }, autoplayDelay);
  }

  function resetDragState() {
    activePointerId = undefined;
    dragDeltaX = 0;
    horizontalDrag = false;
    interactionActive = false;
    track?.classList.remove("is-dragging");
  }

  function finishDrag(event, cancelled = false) {
    if (activePointerId === undefined || (event && event.pointerId !== activePointerId)) return;

    if (viewport?.hasPointerCapture?.(activePointerId)) {
      viewport.releasePointerCapture(activePointerId);
    }

    const threshold = Math.min(64, (viewport?.clientWidth || 1) * 0.16);
    let nextIndex = activeIndex;
    if (!cancelled && horizontalDrag && Math.abs(dragDeltaX) >= threshold) {
      nextIndex = Math.max(0, Math.min(activeIndex + (dragDeltaX < 0 ? 1 : -1), slides.length - 1));
    }

    resetDragState();
    goToSlide(nextIndex);
    startAutoplay();
  }

  if (viewport && track && slides.length > 0) {
    mobileIntentCarousel.classList.add("is-transform-carousel");
    viewport.scrollLeft = 0;

    viewport.addEventListener("pointerdown", (event) => {
      if (!mobileLayout.matches || event.button > 0 || event.isPrimary === false) return;
      interactionActive = true;
      stopAutoplay();
      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragDeltaX = 0;
      horizontalDrag = false;
      track.classList.remove("is-animating");
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointermove", (event) => {
      if (event.pointerId !== activePointerId) return;
      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;

      if (!horizontalDrag && Math.abs(deltaX) < 6) return;
      if (!horizontalDrag && Math.abs(deltaY) > Math.abs(deltaX)) {
        finishDrag(event, true);
        return;
      }

      horizontalDrag = true;
      dragDeltaX = deltaX;
      positionTrack(activeIndex, dragDeltaX, false);
    });

    viewport.addEventListener("pointerup", (event) => finishDrag(event));
    viewport.addEventListener("pointercancel", (event) => finishDrag(event, true));

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      goToSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
      startAutoplay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.mobileIntentDot));
      startAutoplay();
    });
  });

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(() => {
      viewport.scrollLeft = 0;
      goToSlide(activeIndex, "auto");
      startAutoplay();
    });
  });
  window.addEventListener("pageshow", () => {
    viewport.scrollLeft = 0;
    goToSlide(activeIndex, "auto");
    startAutoplay();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  const handleMotionChange = () => {
    goToSlide(activeIndex, "auto");
    startAutoplay();
  };
  if (typeof mobileReducedMotion.addEventListener === "function") {
    mobileReducedMotion.addEventListener("change", handleMotionChange);
    mobileLayout.addEventListener("change", handleMotionChange);
  } else {
    mobileReducedMotion.addListener(handleMotionChange);
    mobileLayout.addListener(handleMotionChange);
  }

  updatePagination(0);
  positionTrack(0);
  startAutoplay();
}
