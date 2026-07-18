const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll("[data-reveal]");
const gallerySourceItems = document.querySelectorAll(".gallery-track .gallery-item");
const galleryPreviewItems = document.querySelectorAll(".portfolio-feature");
const galleryOpenButton = document.querySelector("[data-open-gallery]");
const galleryModal = document.querySelector(".gallery-modal");
const galleryModalGrid = document.querySelector(".gallery-modal-grid");
const galleryModalClose = document.querySelector(".gallery-modal-close");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const lightboxClose = document.querySelector(".lightbox-close");
const copyButtons = document.querySelectorAll(".copy-button");
const toast = document.querySelector(".toast");
const socialButtons = document.querySelectorAll(".contact-row");
const contactPopover = document.querySelector(".contact-popover");
const contactPanelTitle = document.querySelector(".contact-popover h3");
const contactPanelValue = document.querySelector(".contact-popover-value");
const contactPanelExtra = document.querySelector(".contact-popover-extra");
const contactPanelImage = document.querySelector(".contact-popover img");
const contactPanelClose = document.querySelector(".contact-popover-close");
const contactPanelCopy = document.querySelector(".contact-copy");
const portfolioItems = document.querySelectorAll(".portfolio-index-item");
const portfolioFeature = document.querySelector(".portfolio-feature");
const portfolioLoader = document.querySelector(".portfolio-loader");
const portfolioFeatureImage = portfolioFeature?.querySelector(".portfolio-feature-image.is-current");
const portfolioFeatureNextImage = portfolioFeature?.querySelector(".portfolio-feature-image.is-next");
const portfolioCurrentIndex = document.querySelector("[data-current-index]");
const portfolioCurrentTitle = document.querySelector("[data-current-title]");
const aiToolOptions = document.querySelectorAll(".ai-tool-option");
const aiToolFocus = document.querySelector(".ai-tool-focus");
const aiToolFocusIndex = document.querySelector("[data-tool-index]");
const aiToolFocusMark = document.querySelector("[data-tool-mark]");
const aiToolFocusTitle = document.querySelector("[data-tool-title]");
const aiToolFocusDescription = document.querySelector("[data-tool-description]");
const aiToolFocusLink = document.querySelector("[data-tool-link]");

let toastTimer;
let activeContactValue = "";
let portfolioPreviewTimer;
let portfolioPreviewToken = 0;
let portfolioLoaderTimer;

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
  revealObserver.observe(item);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

const bindGalleryItem = (item) => {
  item.addEventListener("click", () => {
    const image = item.dataset.image;
    const alt = item.querySelector("img")?.alt || "作品预览";
    if (!image || !lightbox || !lightboxImage) return;

    const openLightbox = () => {
      lightboxImage.src = image;
      lightboxImage.alt = alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
    };

    if (!item.classList.contains("portfolio-feature") || !portfolioLoader) {
      openLightbox();
      return;
    }

    window.clearTimeout(portfolioLoaderTimer);
    portfolioLoader.classList.add("is-open");
    portfolioLoader.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
    portfolioLoaderTimer = window.setTimeout(() => {
      openLightbox();
      portfolioLoader.classList.remove("is-open");
      portfolioLoader.setAttribute("aria-hidden", "true");
    }, 760);
  });
};

gallerySourceItems.forEach(bindGalleryItem);
galleryPreviewItems.forEach(bindGalleryItem);

portfolioItems.forEach((item) => {
  const preload = new Image();
  preload.src = item.dataset.image || "";
});

const updatePortfolioPreview = (item) => {
  if (!portfolioFeature || !portfolioFeatureImage || !portfolioFeatureNextImage) return;

  const image = item.dataset.image;
  const index = item.dataset.index || "01";
  const title = item.dataset.title || "PPT 作品页面";
  if (!image) return;

  portfolioItems.forEach((entry) => {
    const isActive = entry === item;
    entry.classList.toggle("is-active", isActive);
    entry.setAttribute("aria-pressed", String(isActive));
  });

  const token = ++portfolioPreviewToken;
  window.clearTimeout(portfolioPreviewTimer);

  const commitPreview = () => {
    if (token !== portfolioPreviewToken) return;
    portfolioFeature.classList.add("is-changing");
    portfolioPreviewTimer = window.setTimeout(() => {
      portfolioFeatureImage.src = image;
      portfolioFeatureImage.alt = title;
      portfolioFeature.dataset.image = image;
      if (portfolioCurrentIndex) portfolioCurrentIndex.textContent = index;
      if (portfolioCurrentTitle) portfolioCurrentTitle.textContent = title;
      portfolioFeature.classList.remove("is-changing");
    }, 220);
  };

  portfolioFeatureNextImage.onload = commitPreview;
  portfolioFeatureNextImage.src = image;
  if (portfolioFeatureNextImage.complete && portfolioFeatureNextImage.naturalWidth > 0) {
    commitPreview();
  }
};

portfolioItems.forEach((item) => {
  item.addEventListener("mouseenter", () => updatePortfolioPreview(item));
  item.addEventListener("focus", () => updatePortfolioPreview(item));
  item.addEventListener("click", () => updatePortfolioPreview(item));
});

if (portfolioItems[0]) {
  portfolioItems[0].classList.add("is-active");
  portfolioItems[0].setAttribute("aria-pressed", "true");
}

let aiToolTimer;
const updateAiTool = (option) => {
  if (!aiToolFocus || !aiToolFocusIndex || !aiToolFocusMark || !aiToolFocusTitle || !aiToolFocusDescription || !aiToolFocusLink) return;

  aiToolOptions.forEach((entry) => {
    const isActive = entry === option;
    entry.classList.toggle("is-active", isActive);
    entry.setAttribute("aria-pressed", String(isActive));
  });

  const index = option.dataset.toolIndex || "01";
  const name = option.dataset.toolName || "AI 工具";
  const mark = option.dataset.toolMark || "AI";
  const description = option.dataset.toolDescription || "用于日常创作与信息整理。";
  const link = option.dataset.toolLink || "#";

  aiToolFocus.classList.add("is-switching");
  window.clearTimeout(aiToolTimer);
  aiToolTimer = window.setTimeout(() => {
    aiToolFocusIndex.textContent = index;
    aiToolFocusMark.textContent = mark;
    aiToolFocusTitle.textContent = name;
    aiToolFocusDescription.textContent = description;
    aiToolFocusLink.href = link;
    aiToolFocus.classList.remove("is-switching");
  }, 160);
};

aiToolOptions.forEach((option) => {
  option.addEventListener("mouseenter", () => updateAiTool(option));
  option.addEventListener("focus", () => updateAiTool(option));
  option.addEventListener("click", () => updateAiTool(option));
});

if (galleryModalGrid) {
  gallerySourceItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.classList.remove("is-hidden");
    bindGalleryItem(clone);
    galleryModalGrid.appendChild(clone);
  });
}

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
  lightboxImage.src = "";
};

const openGalleryModal = () => {
  if (!galleryModal) return;
  galleryModal.classList.add("is-open");
  galleryModal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeGalleryModal = () => {
  if (!galleryModal) return;
  galleryModal.classList.remove("is-open");
  galleryModal.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
};

const openContactPopover = (button) => {
  if (
    !contactPopover ||
    !contactPanelTitle ||
    !contactPanelValue ||
    !contactPanelExtra ||
    !contactPanelImage
  ) {
    return;
  }

  const name = button.dataset.contactName || "联系方式";
  const value = button.dataset.contactValue || "";
  const extra = button.dataset.contactExtra || "";
  const image = button.dataset.contactImage || "";

  activeContactValue = value;
  contactPanelTitle.textContent = name;
  contactPanelValue.textContent = value;
  contactPanelExtra.textContent = extra;
  contactPanelImage.src = image;
  contactPanelImage.alt = `${name}二维码`;
  contactPopover.classList.add("is-open");
  contactPopover.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeContactPopover = () => {
  if (!contactPopover || !contactPanelImage) return;
  contactPopover.classList.remove("is-open");
  contactPopover.setAttribute("aria-hidden", "true");
  contactPanelImage.src = "";
  body.style.overflow = "";
};

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
galleryOpenButton?.addEventListener("click", openGalleryModal);
galleryModalClose?.addEventListener("click", closeGalleryModal);
galleryModal?.addEventListener("click", (event) => {
  if (event.target === galleryModal) closeGalleryModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeGalleryModal();
    closeContactPopover();
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
};

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy;
    if (button.classList.contains("contact-copy")) return;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showToast("已复制");
    } catch {
      showToast(text);
    }
  });
});

socialButtons.forEach((button) => {
  button.addEventListener("click", () => openContactPopover(button));
});

contactPanelClose?.addEventListener("click", closeContactPopover);
contactPopover?.addEventListener("click", (event) => {
  if (event.target === contactPopover) closeContactPopover();
});

contactPanelCopy?.addEventListener("click", async () => {
  if (!activeContactValue) return;
  try {
    await navigator.clipboard.writeText(activeContactValue);
    showToast("已复制");
  } catch {
    showToast(activeContactValue);
  }
});

const initTasteMotion = () => {
  if (!window.gsap || !window.ScrollTrigger) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    ".hero-copy",
    { opacity: 0, y: 42 },
    { opacity: 1, y: 0, duration: 1.05, ease: "power3.out", delay: 0.12 }
  );

  gsap.fromTo(
    ".identity-panel",
    { opacity: 0, y: 56, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 1.15, ease: "power3.out", delay: 0.22 }
  );

  gsap.utils.toArray(".about-method-item, .project-card, .honor-table tbody tr, .tool-card, .tool-resource-panel, .contact-card").forEach((item, index) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 46 },
      {
        opacity: 1,
        y: 0,
        duration: 0.78,
        delay: (index % 4) * 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          once: true
        }
      }
    );
  });

  if (window.innerWidth > 920) {
    gsap.to(".about .section-heading", {
      scrollTrigger: {
        trigger: ".about",
        start: "top top+=92",
        end: "bottom bottom-=100",
        pin: true,
        pinSpacing: false,
        scrub: 0.6
      }
    });
  }

  gsap.utils.toArray(".project-image img, .portfolio-feature-image.is-current").forEach((image) => {
    gsap.fromTo(
      image,
      { scale: 0.86, opacity: 0.55 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top 92%",
          end: "bottom 24%",
          scrub: 0.8
        }
      }
    );
  });

  ScrollTrigger.refresh();
};

window.addEventListener("load", initTasteMotion, { once: true });
