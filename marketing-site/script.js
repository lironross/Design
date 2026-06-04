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

  function applyMarquee() {
    if (reducedMotion.matches) {
      track.style.animation = "none";
      track.style.transform = "none";
      return;
    }

    const halfWidth = track.scrollWidth / 2;
    const speed = 35;
    const duration = halfWidth / speed;
    const offset = Number.parseFloat(getComputedStyle(track).getPropertyValue("--marquee-offset")) || 0;

    track.style.animation = `marquee ${duration}s linear infinite`;

    let sheet = document.getElementById("marquee-keyframes");
    if (!sheet) {
      sheet = document.createElement("style");
      sheet.id = "marquee-keyframes";
      document.head.appendChild(sheet);
    }
    sheet.textContent = `
      @keyframes marquee {
        from { transform: translateX(${offset}px); }
        to   { transform: translateX(${offset - halfWidth}px); }
      }
    `;
  }

  applyMarquee();

  document.addEventListener("visibilitychange", () => {
    track.style.animationPlayState = document.hidden ? "paused" : "running";
  });

  rail.addEventListener("focusin", () => {
    track.style.animationPlayState = "paused";
  });

  rail.addEventListener("focusout", () => {
    track.style.animationPlayState = "running";
  });

  window.addEventListener("resize", applyMarquee);
  reducedMotion.addEventListener("change", applyMarquee);
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
