// Interactive content reused from the existing intelligence landing build.
const queryExamples = {
  work: {
    place: "Monday Coffee",
    score: "9.2",
    intent: "Excellent match for a focused work session",
    signals: ["Dependable Wi-Fi", "Outlets near most tables", "Quiet weekday atmosphere"],
    evidence: "Based on 184 recent signals · verified July 2026 · high confidence",
    image: "Images/2.webp",
    alt: "Bright café interior"
  },
  celiac: {
    place: "Example Bakery",
    score: "9.6",
    intent: "Strong match for a celiac-safe bakery near your hotel",
    signals: ["Dedicated preparation area", "Cross-contact details", "Recent community validation"],
    evidence: "Based on 126 dietary-safety signals · verified July 2026 · high confidence",
    image: "Images/5.webp",
    alt: "Bakery display case with pastries"
  },
  conversation: {
    place: "Example Bar",
    score: "8.9",
    intent: "Lively atmosphere with space for conversation",
    signals: ["Low-noise seating zone", "Energetic after 8pm", "Tables suited to small groups"],
    evidence: "Based on 211 recent signals · verified July 2026 · medium-high confidence",
    image: "Images/7.webp",
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
  const settleDuration = 420;
  let activeIndex = 0;
  let autoplayTimer;
  let interactionActive = false;
  let settling = false;
  let settleTimer;
  let settleFrame;
  let gestureActive = false;
  let gestureAxis = "pending";
  let dragStartX = 0;
  let dragStartY = 0;
  let dragLastX = 0;
  let dragLastTime = 0;
  let dragBaseX = 0;
  let dragDeltaX = 0;
  let dragVelocityX = 0;
  let dragFrame;
  let pendingDragX = 0;

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

  function slidePosition(index) {
    return -slideOffset(index);
  }

  function renderTranslate(value) {
    if (!track) return;
    track.style.transform = `translate3d(${value}px, 0, 0)`;
  }

  function currentTranslate() {
    if (!track) return slidePosition(activeIndex);
    const transform = getComputedStyle(track).transform;
    if (!transform || transform === "none") return slidePosition(activeIndex);

    const values = transform.slice(transform.indexOf("(") + 1, -1).split(",").map(Number);
    if (transform.startsWith("matrix3d(") && Number.isFinite(values[12])) return values[12];
    if (transform.startsWith("matrix(") && Number.isFinite(values[4])) return values[4];
    return slidePosition(activeIndex);
  }

  function stopSettling() {
    window.clearTimeout(settleTimer);
    window.cancelAnimationFrame(settleFrame);
    settleTimer = undefined;
    settleFrame = undefined;
    settling = false;
    track?.classList.remove("is-animating");
  }

  function finishSettling() {
    if (!settling) return;
    window.clearTimeout(settleTimer);
    settleTimer = undefined;
    settling = false;
    track?.classList.remove("is-animating");
    startAutoplay();
  }

  function settleTrack(index, animate) {
    if (!track) return;
    const startPosition = currentTranslate();
    stopSettling();
    track.classList.remove("is-dragging");
    renderTranslate(startPosition);

    if (!animate || mobileReducedMotion.matches) {
      renderTranslate(slidePosition(index));
      startAutoplay();
      return;
    }

    settling = true;
    void track.offsetWidth;
    settleFrame = window.requestAnimationFrame(() => {
      track.classList.add("is-animating");
      renderTranslate(slidePosition(index));
      settleTimer = window.setTimeout(finishSettling, settleDuration + 120);
    });
  }

  function goToSlide(index, behavior = "smooth") {
    if (!viewport || !track || slides.length === 0) return;
    const nextIndex = (index + slides.length) % slides.length;
    const wrapsToStart = activeIndex === slides.length - 1 && nextIndex === 0;
    updatePagination(nextIndex);
    settleTrack(nextIndex, behavior !== "auto" && !wrapsToStart);
  }

  function stopAutoplay() {
    window.clearTimeout(autoplayTimer);
    autoplayTimer = undefined;
  }

  function startAutoplay() {
    stopAutoplay();
    if (!mobileLayout.matches || interactionActive || settling || document.hidden) return;
    autoplayTimer = window.setTimeout(() => {
      goToSlide(activeIndex + 1);
    }, autoplayDelay);
  }

  function resetGesture() {
    window.cancelAnimationFrame(dragFrame);
    dragFrame = undefined;
    gestureActive = false;
    gestureAxis = "pending";
    dragDeltaX = 0;
    dragVelocityX = 0;
    interactionActive = false;
    track?.classList.remove("is-dragging");
  }

  function applyPendingDrag() {
    dragFrame = undefined;
    renderTranslate(dragBaseX + pendingDragX);
  }

  function scheduleDrag(value) {
    pendingDragX = value;
    if (!dragFrame) dragFrame = window.requestAnimationFrame(applyPendingDrag);
  }

  function beginGesture(x, y, timestamp) {
    if (!mobileLayout.matches || gestureActive) return;
    interactionActive = true;
    gestureActive = true;
    gestureAxis = "pending";
    stopAutoplay();
    dragBaseX = currentTranslate();
    stopSettling();
    renderTranslate(dragBaseX);
    dragStartX = x;
    dragStartY = y;
    dragLastX = x;
    dragLastTime = timestamp;
    dragDeltaX = 0;
    dragVelocityX = 0;
    pendingDragX = 0;
    track?.classList.add("is-dragging");
  }

  function moveGesture(x, y, timestamp, event) {
    if (!gestureActive) return;
    const rawDeltaX = x - dragStartX;
    const deltaY = y - dragStartY;

    if (gestureAxis === "pending") {
      if (Math.max(Math.abs(rawDeltaX), Math.abs(deltaY)) < 8) return;
      gestureAxis = Math.abs(rawDeltaX) > Math.abs(deltaY) * 1.15 ? "horizontal" : "vertical";
    }

    if (gestureAxis !== "horizontal") return;
    if (event?.cancelable) event.preventDefault();

    const elapsed = Math.max(1, timestamp - dragLastTime);
    const instantaneousVelocity = (x - dragLastX) / elapsed;
    dragVelocityX = dragVelocityX * 0.72 + instantaneousVelocity * 0.28;
    dragLastX = x;
    dragLastTime = timestamp;

    const atStart = activeIndex === 0 && rawDeltaX > 0;
    const atEnd = activeIndex === slides.length - 1 && rawDeltaX < 0;
    dragDeltaX = atStart || atEnd ? rawDeltaX * 0.28 : rawDeltaX;
    scheduleDrag(dragDeltaX);
  }

  function finishGesture(cancelled = false) {
    if (!gestureActive) return;
    if (dragFrame) {
      window.cancelAnimationFrame(dragFrame);
      dragFrame = undefined;
      renderTranslate(dragBaseX + pendingDragX);
    }
    const threshold = Math.min(64, (viewport?.clientWidth || 1) * 0.16);
    const skipAnimation = cancelled || gestureAxis !== "horizontal";
    let nextIndex = activeIndex;
    const hasDistance = Math.abs(dragDeltaX) >= threshold;
    const hasVelocity = Math.abs(dragVelocityX) >= 0.35;
    if (!cancelled && gestureAxis === "horizontal" && (hasDistance || hasVelocity)) {
      const direction = dragDeltaX !== 0 ? dragDeltaX : dragVelocityX;
      nextIndex = Math.max(0, Math.min(activeIndex + (direction < 0 ? 1 : -1), slides.length - 1));
    }

    resetGesture();
    goToSlide(nextIndex, skipAnimation ? "auto" : "smooth");
  }

  if (viewport && track && slides.length > 0) {
    mobileIntentCarousel.classList.add("is-transform-carousel");
    renderTranslate(slidePosition(0));

    viewport.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      beginGesture(touch.clientX, touch.clientY, event.timeStamp);
    }, { passive: true });

    viewport.addEventListener("touchmove", (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      moveGesture(touch.clientX, touch.clientY, event.timeStamp, event);
    }, { passive: false });

    viewport.addEventListener("touchend", () => finishGesture(), { passive: true });
    viewport.addEventListener("touchcancel", () => finishGesture(true), { passive: true });

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      beginGesture(event.clientX, event.clientY, event.timeStamp);
    });
    window.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      moveGesture(event.clientX, event.clientY, event.timeStamp, event);
    });
    window.addEventListener("pointerup", (event) => {
      if (event.pointerType === "mouse") finishGesture();
    });
    window.addEventListener("pointercancel", (event) => {
      if (event.pointerType === "mouse") finishGesture(true);
    });

    track.addEventListener("transitionend", (event) => {
      if (event.propertyName === "transform") finishSettling();
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      goToSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.mobileIntentDot));
    });
  });

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(() => {
      goToSlide(activeIndex, "auto");
    });
  });
  window.addEventListener("pageshow", () => {
    goToSlide(activeIndex, "auto");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  const handleMotionChange = () => {
    goToSlide(activeIndex, "auto");
  };
  if (typeof mobileReducedMotion.addEventListener === "function") {
    mobileReducedMotion.addEventListener("change", handleMotionChange);
    mobileLayout.addEventListener("change", handleMotionChange);
  } else {
    mobileReducedMotion.addListener(handleMotionChange);
    mobileLayout.addListener(handleMotionChange);
  }

  updatePagination(0);
  startAutoplay();
}
