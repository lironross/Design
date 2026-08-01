const rail = document.querySelector("[data-hero-rail]");
const track = document.querySelector("[data-hero-track]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (rail && track) {
  const originals = Array.from(track.children);
  originals.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  let resizeTimer;
  let reducedStepTimer;
  let reducedStepIndex = 0;

  function stopReducedStepper() {
    window.clearInterval(reducedStepTimer);
    reducedStepTimer = undefined;
  }

  function getMarqueeMeasurements() {
    const firstOriginal = originals[0];
    const firstClone = track.children[originals.length];
    const secondOriginal = originals[1];
    if (!firstOriginal || !firstClone) return null;

    const travel = firstClone.offsetLeft - firstOriginal.offsetLeft;
    const step = secondOriginal ? secondOriginal.offsetLeft - firstOriginal.offsetLeft : travel;
    if (!Number.isFinite(travel) || travel <= 0 || !Number.isFinite(step) || step <= 0) return null;

    return { travel, step };
  }

  function setReducedPosition(offset, step) {
    track.style.transform = `translate3d(${offset - reducedStepIndex * step}px, 0, 0)`;
  }

  function startReducedStepper(offset, step) {
    stopReducedStepper();
    reducedStepIndex = 0;
    setReducedPosition(offset, step);
    reducedStepTimer = window.setInterval(() => {
      reducedStepIndex = (reducedStepIndex + 1) % originals.length;
      setReducedPosition(offset, step);
    }, 5000);
  }

  function applyMarquee() {
    stopReducedStepper();
    track.classList.remove("is-css-animated");
    track.classList.remove("is-marquee-paused");
    track.style.removeProperty("transform");

    const measurements = getMarqueeMeasurements();
    if (!measurements) return;

    const speed = 35;
    const duration = measurements.travel / speed;
    const offset = Number.parseFloat(getComputedStyle(track).getPropertyValue("--marquee-offset")) || 0;

    if (reducedMotion.matches) {
      startReducedStepper(offset, measurements.step);
      return;
    }

    track.style.setProperty("--marquee-start", `${offset}px`);
    track.style.setProperty("--marquee-end", `${offset - measurements.travel}px`);
    track.style.setProperty("--marquee-duration", `${duration}s`);
    void track.offsetWidth;
    track.classList.add("is-css-animated");
  }

  requestAnimationFrame(() => requestAnimationFrame(applyMarquee));
  window.addEventListener("load", applyMarquee, { once: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopReducedStepper();
      track.classList.add("is-marquee-paused");
      return;
    }

    applyMarquee();
  });

  window.addEventListener("pageshow", () => {
    applyMarquee();
  });

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applyMarquee, 120);
  });
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", applyMarquee);
  } else {
    reducedMotion.addListener(applyMarquee);
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
