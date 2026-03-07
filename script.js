/* ===========
  Minimal JS:
  - Reveal-on-scroll for sections/cards
  - Active timeline dot highlighting while scrolling
  - Footer year
  Keep this file lightweight and easy to edit.
=========== */

(() => {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // If user prefers reduced motion, still show content immediately
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Reveal-on-scroll
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // Timeline active-dot behavior
  const timelineItems = Array.from(document.querySelectorAll(".timeline-item"));
  if (timelineItems.length === 0) return;

  // Mark the first as active initially for a clean first impression
  timelineItems[0].classList.add("is-active");

  let activeIndex = 0;

  const setActiveIndex = (idx) => {
    if (idx === activeIndex) return;
    timelineItems[activeIndex]?.classList.remove("is-active");
    timelineItems[idx]?.classList.add("is-active");
    activeIndex = idx;
  };

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      // Pick the most-visible intersecting timeline item
      let best = null;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      }
      if (!best) return;

      const idx = timelineItems.indexOf(best.target);
      if (idx >= 0) setActiveIndex(idx);
    },
    {
      // Focus the "active" region near the middle of the viewport
      rootMargin: "-40% 0px -55% 0px",
      threshold: [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85],
    },
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));

  // Certificate preview behavior (shows image on the page instead of downloading)
  const certButtons = Array.from(document.querySelectorAll(".cert-trigger"));
  const certImage = document.getElementById("certificate-image");
  const certImageWrap = document.getElementById("certificate-image-wrap");
  const certHelper = document.getElementById("certificate-helper");
  const certClose = document.getElementById("certificate-close");

  const closePreview = () => {
    certImage.src = "";
    certImage.alt = "";
    if (certImageWrap) certImageWrap.hidden = true;
    certHelper.textContent =
      "Select a certificate above to preview it here once attached.";
  };

  if (certButtons.length && certImage && certHelper) {
    certButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-cert-src");
        const alt = btn.getAttribute("data-cert-alt") || "";

        if (!src) return;

        certImage.src = src;
        certImage.alt = alt;
        if (certImageWrap) certImageWrap.hidden = false;

        certHelper.textContent = "Certificate preview:";
      });
    });
  }

  if (certClose && certImage && certHelper) {
    certClose.addEventListener("click", closePreview);
  }
})();
