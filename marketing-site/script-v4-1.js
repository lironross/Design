const rail = document.querySelector("[data-hero-rail]");
const track = document.querySelector("[data-hero-track]");
const marqueeGroup = track?.querySelector("[data-marquee-group]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (rail && track && marqueeGroup) {
  const fallbackSpeed = 35;
  const forceFallback = new URLSearchParams(window.location.search).has("forceMarqueeFallback");
  let fallbackFrame;
  let fallbackStartedAt;
  let fallbackDistance = 0;

  function marqueeOffset() {
    return Number.parseFloat(getComputedStyle(track).getPropertyValue("--marquee-offset")) || 0;
  }

  function measureFallback() {
    fallbackDistance = marqueeGroup.getBoundingClientRect().width;
  }

  function renderFallback(timestamp) {
    if (!fallbackStartedAt) fallbackStartedAt = timestamp;
    if (!fallbackDistance) measureFallback();

    const elapsed = (timestamp - fallbackStartedAt) / 1000;
    const travel = fallbackDistance ? (elapsed * fallbackSpeed) % fallbackDistance : 0;
    track.style.transform = `translate3d(${marqueeOffset() - travel}px, 0, 0)`;
    fallbackFrame = window.requestAnimationFrame(renderFallback);
  }

  function startFallback() {
    if (fallbackFrame || reducedMotion.matches) return;
    measureFallback();
    fallbackStartedAt = undefined;
    track.classList.add("is-raf-fallback");
    track.dataset.marqueeMode = "raf";
    fallbackFrame = window.requestAnimationFrame(renderFallback);
  }

  function stopFallback() {
    window.cancelAnimationFrame(fallbackFrame);
    fallbackFrame = undefined;
    fallbackStartedAt = undefined;
    track.classList.remove("is-raf-fallback");
    track.style.removeProperty("transform");
    track.dataset.marqueeMode = "css";
  }

  function verifyCssAnimation() {
    if (reducedMotion.matches || document.hidden || fallbackFrame) return;
    const startPosition = track.getBoundingClientRect().left;

    window.setTimeout(() => {
      if (reducedMotion.matches || document.hidden || fallbackFrame) return;
      const endPosition = track.getBoundingClientRect().left;
      if (Math.abs(endPosition - startPosition) < 2) startFallback();
    }, 1200);
  }

  if (forceFallback) {
    window.requestAnimationFrame(startFallback);
  } else {
    window.requestAnimationFrame(() => window.requestAnimationFrame(verifyCssAnimation));
    window.addEventListener("load", verifyCssAnimation, { once: true });
  }
  window.addEventListener("resize", measureFallback);
  window.addEventListener("pageshow", verifyCssAnimation);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && track.dataset.marqueeMode === "css") verifyCssAnimation();
  });

  const handleMotionChange = () => {
    if (reducedMotion.matches) stopFallback();
    else verifyCssAnimation();
  };
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionChange);
  } else {
    reducedMotion.addListener(handleMotionChange);
  }
}

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const menuClose = document.querySelector(".mobile-menu__close");

if (hamburger && mobileMenu) {
  function openMenu() {
    mobileMenu.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
      closeMenu();
    }
  });
}

if (!reducedMotion.matches) {
  const fadeEls = document.querySelectorAll(".fade-in-up");

  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "-40px 0px" }
    );

    fadeEls.forEach((el) => observer.observe(el));
  }
}
