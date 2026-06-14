const fvLayout660 = {
  width: 660,
  bgWidthPercent: 298.3,
  bgLeftPercent: -96.55,
  bgTopPercent: -30,
  copyLeft: 45,
  copyTop: 490,
  copyWidth: 320,
  copyHeight: 134,
  shadowLeft: 34,
  shadowTop: 522,
  shadowWidth: 336,
  shadowHeight: 115,
  shadowOpacity: 0.8,
  shadowColor: "#005085",
  padX: 20,
  padTop: 20,
  padBottom: 40,
  gap: 20
};

const fvBreakpointsHigh = [
  {
    width: 661,
    bgWidth: 323.88,
    bgLeft: -113.71,
    bgTop: -42.54,
    copyLeft: 58,
    copyTop: 456,
    copyWidth: 390,
    copyHeight: 162,
    shadowLeft: 42,
    shadowTop: 452,
    shadowWidth: 336,
    shadowHeight: 115,
    shadowOpacity: 0.6,
    shadowColor: "#0880c2",
    padX: 40,
    padTop: 40,
    padBottom: 40,
    gap: 40
  },
  {
    width: 767,
    bgWidth: 278.23,
    bgLeft: -89.12,
    bgTop: -42.3,
    copyLeft: 84,
    copyTop: 452,
    copyWidth: 400,
    copyHeight: 166,
    shadowLeft: 66,
    shadowTop: 448,
    shadowWidth: 278.462,
    shadowHeight: 115.017,
    shadowOpacity: 0.6,
    shadowColor: "#0880c2",
    padX: 60,
    padTop: 40,
    padBottom: 40,
    gap: 40
  }
];

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function interpolate(points, width) {
  if (width <= points[0].width) return points[0];
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    if (width <= next.width) {
      const progress = (width - current.width) / (next.width - current.width);
      const result = { shadowColor: progress < 0.5 ? current.shadowColor : next.shadowColor };
      for (const key of Object.keys(current)) {
        if (typeof current[key] === "number") {
          result[key] = lerp(current[key], next[key], progress);
        }
      }
      return result;
    }
  }
  return points[points.length - 1];
}

function setPx(root, name, value) {
  root.style.setProperty(name, `${value.toFixed(3)}px`);
}

function setPercent(root, name, value) {
  root.style.setProperty(name, `${value.toFixed(3)}%`);
}

function layoutBelow660(width) {
  const imageWidth = fvLayout660.width * (fvLayout660.bgWidthPercent / 100);
  const imageLeftBase = width - (fvLayout660.width - (fvLayout660.width * (fvLayout660.bgLeftPercent / 100)));
  const imageRightCorrection = Math.min(52, Math.max(0, (fvLayout660.width - width) * 0.65));
  const imageLeft = imageLeftBase + imageRightCorrection;

  return {
    ...fvLayout660,
    bgWidthPx: imageWidth,
    bgLeftPx: imageLeft
  };
}

function applyFvLiquidLayout() {
  const width = window.innerWidth;
  const root = document.documentElement;

  if (width > 767) {
    return;
  }

  const values = width <= 660
    ? layoutBelow660(width)
    : interpolate(fvBreakpointsHigh, width);

  if (width <= 660) {
    setPx(root, "--fv-sp-bg-width", values.bgWidthPx);
    setPx(root, "--fv-sp-bg-left", values.bgLeftPx);
    setPercent(root, "--fv-sp-bg-top", values.bgTopPercent);
  } else {
    setPercent(root, "--fv-sp-bg-width", values.bgWidth);
    setPercent(root, "--fv-sp-bg-left", values.bgLeft);
    setPercent(root, "--fv-sp-bg-top", values.bgTop);
  }

  setPx(root, "--fv-copy-left", values.copyLeft);
  setPx(root, "--fv-copy-top", values.copyTop);
  setPx(root, "--fv-copy-width", values.copyWidth);
  setPx(root, "--fv-copy-height", values.copyHeight);

  setPx(root, "--fv-copy-shadow-offset-left", values.shadowLeft - values.copyLeft);
  setPx(root, "--fv-copy-shadow-offset-top", values.shadowTop - values.copyTop);
  setPx(root, "--fv-copy-shadow-width", values.shadowWidth);
  setPx(root, "--fv-copy-shadow-height", values.shadowHeight);
  root.style.setProperty("--fv-copy-shadow-opacity", values.shadowOpacity.toFixed(3));
  root.style.setProperty("--fv-copy-shadow-color", values.shadowColor);

  setPx(root, "--fv-sp-pad-x", values.padX);
  setPx(root, "--fv-sp-pad-top", values.padTop);
  setPx(root, "--fv-sp-pad-bottom", values.padBottom);
  setPx(root, "--fv-sp-gap", values.gap);
}

applyFvLiquidLayout();
window.addEventListener("resize", applyFvLiquidLayout);

function initFaqAccordion() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-item__question");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      item.classList.toggle("is-closed", isOpen);
    });
  });
}

initFaqAccordion();

function initFadeUp() {
  const elements = document.querySelectorAll(".fade-up");
  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const syncGroups = new Map();

  elements.forEach((element) => {
    const groupName = element.dataset.fadeSync;
    if (!groupName) return;
    if (!syncGroups.has(groupName)) syncGroups.set(groupName, []);
    syncGroups.get(groupName).push(element);
  });

  const revealedSyncGroups = new Set();
  const revealedElements = new Set();

  function revealElement(element) {
    if (revealedElements.has(element)) return;
    revealedElements.add(element);
    element.classList.add("is-visible");
    observer.unobserve(element);
  }

  function revealSyncGroup(groupName) {
    if (revealedSyncGroups.has(groupName)) return;
    revealedSyncGroups.add(groupName);
    (syncGroups.get(groupName) || []).forEach(revealElement);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const groupName = entry.target.dataset.fadeSync;
        if (groupName) {
          revealSyncGroup(groupName);
          return;
        }

        revealElement(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((element) => observer.observe(element));
}

initFadeUp();

function initCampaignCoinFloat() {
  const campaign = document.querySelector(".campaign");
  if (!campaign) return;

  const coins = [
    { selector: ".campaign__deco--coin1", parallax: 0.06, amp: 14, rot: 4, speed: 0.0011, phase: 0, drift: 6 },
    { selector: ".campaign__deco--coin2", parallax: 0.1, amp: 10, rot: 5, speed: 0.0014, phase: 1.2, drift: 4 },
    { selector: ".campaign__deco--coin3", parallax: 0.08, amp: 12, rot: 3, speed: 0.001, phase: 2.4, drift: 5 },
    { selector: ".campaign__deco--coin4", parallax: 0.12, amp: 16, rot: 2.5, speed: 0.0009, phase: 0.8, drift: 7 }
  ]
    .map(({ selector, ...config }) => ({ el: document.querySelector(selector), ...config }))
    .filter((coin) => coin.el);

  if (!coins.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let inView = false;
  let rafId = null;

  function animate(time) {
    if (!inView) return;

    const scrollY = window.scrollY;
    const campaignTop = campaign.getBoundingClientRect().top + scrollY;
    const relativeScroll = scrollY - campaignTop;

    coins.forEach(({ el, parallax, amp, rot, speed, phase, drift }) => {
      const parallaxY = relativeScroll * parallax;
      const floatY = Math.sin(time * speed + phase) * amp;
      const floatX = Math.cos(time * speed * 0.85 + phase) * drift;
      const rotate = Math.sin(time * speed * 0.7 + phase) * rot;
      el.style.transform = `translate3d(${floatX.toFixed(2)}px, ${(parallaxY + floatY).toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        if (!rafId) rafId = requestAnimationFrame(animate);
        return;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    { rootMargin: "120px 0px" }
  );

  observer.observe(campaign);
}

initCampaignCoinFloat();
