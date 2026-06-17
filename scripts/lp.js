/** fv-sp@2x.jpg 上で男性の左肩が左端から占める横位置（0〜1） */
const FV_SHOULDER_X = 0.583;

/** fv-bg@2x.png 上で男性の左肩が左端から占める横位置（0〜1） */
const FV_PC_SHOULDER_X = 0.807;
/** 添付参考画像（909px幅）で肩から右端までの余白 25px に合わせる */
const FV_PC_RIGHT_EDGE_MARGIN = 25 / 909;
const FV_RIGHT_EXTRA_PX = 120;
const FV_PC_MIN_WIDTH = 768;
const FV_COPY_CTA_MARGIN = 60;
const FV_COPY_TOP_CSS_OFFSET = 50;
const FV_SP_BG_OFFSET_Y = 100;
const FV_SP_COPY_OFFSET_Y = 50;
const FV_SP_MAX_WIDTH = 660;
const FV_DEDICATED_BG_MAX_WIDTH = 420;

function shoulderAlignedLeftPercent(bgWidthPercent) {
  return 100 - FV_SHOULDER_X * bgWidthPercent;
}

function clearFvPcBgVars(root) {
  root.style.removeProperty("--fv-pc-bg-width");
  root.style.removeProperty("--fv-pc-bg-height");
  root.style.removeProperty("--fv-pc-bg-left");
  root.style.removeProperty("--fv-pc-bg-top");
}

function applyFvPcBgLayout() {
  const width = window.innerWidth;
  const root = document.documentElement;

  if (width < FV_PC_MIN_WIDTH) {
    clearFvPcBgVars(root);
    return;
  }

  const fv = document.querySelector(".fv");
  const bgImg = document.querySelector(".fv__bg img");
  if (!fv || !bgImg || !bgImg.naturalWidth) {
    return;
  }

  const viewportWidth = fv.clientWidth;
  const viewportHeight = fv.clientHeight;
  const imageWidth = bgImg.naturalWidth;
  const imageHeight = bgImg.naturalHeight;
  const scale = Math.max(viewportWidth / imageWidth, viewportHeight / imageHeight);
  const displayWidth = scale * imageWidth;
  const displayHeight = scale * imageHeight;
  const rightEdgeFraction = FV_PC_SHOULDER_X + FV_PC_RIGHT_EDGE_MARGIN;
  const rightLockWidth = rightEdgeFraction * displayWidth + FV_RIGHT_EXTRA_PX;
  const left = viewportWidth >= rightLockWidth
    ? 0
    : viewportWidth - rightLockWidth;
  const top = viewportHeight - displayHeight;

  root.style.setProperty("--fv-pc-bg-width", `${displayWidth}px`);
  root.style.setProperty("--fv-pc-bg-height", `${displayHeight}px`);
  root.style.setProperty("--fv-pc-bg-left", `${left}px`);
  root.style.setProperty("--fv-pc-bg-top", `${top}px`);
}

const fvCopyBreakpoints = [
  {
    width: 661,
    copyLeft: 58,
    copyTop: 532,
    copyWidth: 390,
    copyHeight: 162,
    shadowLeft: 42,
    shadowTop: 528,
    shadowWidth: 336,
    shadowHeight: 115,
    shadowOpacity: 0.6,
    shadowColor: "#0880c2"
  },
  {
    width: 767,
    copyLeft: 84,
    copyTop: 528,
    copyWidth: 400,
    copyHeight: 166,
    shadowLeft: 66,
    shadowTop: 524,
    shadowWidth: 278.462,
    shadowHeight: 115.017,
    shadowOpacity: 0.6,
    shadowColor: "#0880c2"
  }
];

function applyFvCopyLayout(values, width) {
  const copyValues = width < 661
    ? fvCopyBreakpoints[0]
    : interpolate(fvCopyBreakpoints, width);
  values.copyLeft = copyValues.copyLeft;
  values.copyTop = copyValues.copyTop;
  values.copyWidth = copyValues.copyWidth;
  values.copyHeight = copyValues.copyHeight;
  values.shadowLeft = copyValues.shadowLeft;
  values.shadowTop = copyValues.shadowTop;
  values.shadowWidth = copyValues.shadowWidth;
  values.shadowHeight = copyValues.shadowHeight;
  values.shadowOpacity = copyValues.shadowOpacity;
  values.shadowColor = copyValues.shadowColor;
}

const fvLayout390 = {
  width: 390,
  bgWidthPercent: 500.06,
  bgLeftPercent: -235,
  bgTopPercent: -31.04,
  bgHeightPercent: 131.04,
  copyLeft: 33,
  copyTop: 560,
  copyWidth: 279,
  copyHeight: 112,
  shadowLeft: 30,
  shadowTop: 555,
  shadowWidth: 310,
  shadowHeight: 115,
  shadowOpacity: 0.6,
  shadowColor: "#0070bb",
  padX: 20,
  padTop: 20,
  padBottom: 40,
  gap: 20
};

const fvLayout660 = {
  width: 660,
  bgWidthPercent: 298.3,
  bgLeftPercent: -112,
  bgTopPercent: -31.28,
  bgHeightPercent: 131.28,
  copyLeft: 33,
  copyTop: 553,
  copyWidth: 279,
  copyHeight: 112,
  shadowLeft: 30,
  shadowTop: 548,
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
    bgLeft: -128,
    bgTop: -42.54,
    copyLeft: 58,
    copyTop: 532,
    copyWidth: 390,
    copyHeight: 162,
    shadowLeft: 42,
    shadowTop: 528,
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
    bgLeft: -102,
    bgTop: -42.3,
    copyLeft: 84,
    copyTop: 528,
    copyWidth: 400,
    copyHeight: 166,
    shadowLeft: 66,
    shadowTop: 524,
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
  const clampedWidth = Math.max(fvLayout390.width, Math.min(fvLayout660.width, width));
  const progress = (clampedWidth - fvLayout390.width) / (fvLayout660.width - fvLayout390.width);
  const result = { shadowColor: progress < 0.5 ? fvLayout390.shadowColor : fvLayout660.shadowColor };

  for (const key of Object.keys(fvLayout390)) {
    if (typeof fvLayout390[key] === "number") {
      result[key] = lerp(fvLayout390[key], fvLayout660[key], progress);
    }
  }

  return result;
}

function applyFvCopyCtaMargin(root, values) {
  if (window.innerWidth > 767) {
    return;
  }

  requestAnimationFrame(() => {
    const fv = document.querySelector(".fv");
    const cta = document.querySelector(".fv__cta");
    if (!fv || !cta) {
      return;
    }

    const ctaTop = cta.getBoundingClientRect().top - fv.getBoundingClientRect().top;
    const maxCopyTop = ctaTop - FV_COPY_CTA_MARGIN - values.copyHeight + FV_COPY_TOP_CSS_OFFSET;
    const copyTop = Math.min(values.copyTop, maxCopyTop);

    setPx(root, "--fv-copy-top", copyTop);
    setPx(root, "--fv-copy-shadow-offset-top", values.shadowTop - copyTop);
  });
}

function applyFvLiquidLayout() {
  const width = window.innerWidth;
  const root = document.documentElement;

  if (width > 767) {
    root.style.removeProperty("--fv-sp-bg-width");
    root.style.removeProperty("--fv-sp-bg-left");
    root.style.removeProperty("--fv-sp-bg-right-extra");
    root.style.removeProperty("--fv-sp-bg-offset-y");
    applyFvPcBgLayout();
    return;
  }

  clearFvPcBgVars(root);
  if (width > FV_DEDICATED_BG_MAX_WIDTH) {
    setPx(root, "--fv-sp-bg-right-extra", FV_RIGHT_EXTRA_PX);
  } else {
    root.style.removeProperty("--fv-sp-bg-right-extra");
  }
  if (width <= FV_SP_MAX_WIDTH && width > FV_DEDICATED_BG_MAX_WIDTH) {
    setPx(root, "--fv-sp-bg-offset-y", FV_SP_BG_OFFSET_Y);
  } else {
    root.style.removeProperty("--fv-sp-bg-offset-y");
  }

  const values = width <= 660
    ? layoutBelow660(width)
    : interpolate(fvBreakpointsHigh, width);

  applyFvCopyLayout(values, width);

  if (width <= FV_SP_MAX_WIDTH) {
    values.copyTop += FV_SP_COPY_OFFSET_Y;
  }

  if (width <= 660) {
    if (width > FV_DEDICATED_BG_MAX_WIDTH) {
      values.bgLeftPercent = shoulderAlignedLeftPercent(values.bgWidthPercent);
      setPercent(root, "--fv-sp-bg-width", values.bgWidthPercent);
      setPercent(root, "--fv-sp-bg-left", values.bgLeftPercent);
    } else {
      root.style.removeProperty("--fv-sp-bg-width");
      root.style.removeProperty("--fv-sp-bg-left");
    }
  } else {
    values.bgLeft = shoulderAlignedLeftPercent(values.bgWidth);
    setPercent(root, "--fv-sp-bg-width", values.bgWidth);
    setPercent(root, "--fv-sp-bg-left", values.bgLeft);
    root.style.removeProperty("--fv-sp-bg-height");
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

  applyFvCopyCtaMargin(root, values);
}

applyFvLiquidLayout();
window.addEventListener("resize", applyFvLiquidLayout);

const fvBgImg = document.querySelector(".fv__bg img");
if (fvBgImg) {
  if (fvBgImg.complete) {
    applyFvPcBgLayout();
  } else {
    fvBgImg.addEventListener("load", applyFvPcBgLayout);
  }
}

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
