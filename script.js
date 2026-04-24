const header = document.querySelector(".header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
const revealElements = Array.from(document.querySelectorAll(".reveal"));
const pageSections = Array.from(document.querySelectorAll("main section[id]"));
const smartStore = document.querySelector("[data-smart-store]");
const storeLightbox = document.querySelector("[data-store-lightbox]");
const storeLightboxStage = document.querySelector("[data-store-lightbox-stage]");
const storeLightboxClose = document.querySelector("[data-store-lightbox-close]");
const adjustToggle = document.querySelector("[data-store-adjust-toggle]");
const adjustPanel = document.querySelector("[data-store-adjuster]");
const adjustHint = document.querySelector("[data-store-adjust-hint]");
const adjustValues = document.querySelector("[data-store-adjust-values]");
const adjustScale = document.querySelector("[data-store-adjust-scale]");
const adjustScaleValue = document.querySelector("[data-store-adjust-scale-value]");
const adjustReset = document.querySelector("[data-store-adjust-reset]");
const adjustCopy = document.querySelector("[data-store-adjust-copy]");
const adjustFloating = document.querySelector("[data-store-adjust-floating]");

// Edite estes itens para trocar os produtos da demonstração da Loja Inteligente.
const smartStoreProducts = [
  {
    name: "Vestido Aurora",
    price: "R$ 189,90",
    category: "Vestido",
    key: "vestido",
    tag: "Nova coleção",
    proof: "Produto apresentado com modelo IA e CTA direto para compra.",
    variants: [
      { label: "Mostarda", slug: "mostarda", color: "#C08A55" },
      { label: "Pêssego", slug: "pessego", color: "#DDA481" },
      { label: "Azul", slug: "azul", color: "#6E7688" }
    ],
    glow: "rgba(198, 169, 107, 0.2)"
  },
  {
    name: "Bolsa Milano",
    price: "R$ 249,90",
    category: "Bolsa",
    key: "bolsa",
    tag: "Mais desejada",
    proof: "Antes e depois do catálogo com visual premium para gerar desejo.",
    variants: [
      { label: "Azul marinho", slug: "navy", color: "#2E3950" },
      { label: "Caramelo", slug: "caramelo", color: "#9C603C" },
      { label: "Creme", slug: "offwhite", color: "#E6D9C8" }
    ],
    glow: "rgba(224, 196, 140, 0.18)"
  },
  {
    name: "Tênis Urban",
    price: "R$ 299,90",
    category: "Tênis",
    key: "tenis",
    tag: "Pronto para vender",
    proof: "Demonstração com prova social, variações e contato rápido.",
    variants: [
      { label: "Branco", slug: "branco", color: "#F5F4F0" },
      { label: "Azul acinzentado", slug: "azul", color: "#8F97A8" },
      { label: "Preto", slug: "preto", color: "#2F3136" }
    ],
    glow: "rgba(93, 125, 255, 0.18)"
  },
  {
    name: "Cenários IA",
    price: "Galeria / editado / minimal",
    category: "Cenários",
    key: "cenario",
    tag: "Ambiente visual",
    proof: "Troque o clima da campanha para mostrar como o produto pode ganhar novas cenas com IA.",
    variants: [
      { label: "Galeria", slug: "galeria", color: "#D7D8D2", image: "images/cenarios/cenario-1.jpeg" },
      { label: "Concreto escuro", slug: "concreto", color: "#3B403C", image: "images/cenarios/cenario-2.jpeg" },
      { label: "Minimal claro", slug: "minimal", color: "#B9BAB5", image: "images/cenarios/cenario-3.jpeg" }
    ],
    glow: "rgba(152, 162, 179, 0.18)"
  }
];

const getHeaderOffset = () => (header ? header.offsetHeight : 0);

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  if (!navToggle || !navMenu) return;

  navToggle.classList.remove("is-open");
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

const openMenu = () => {
  if (!navToggle || !navMenu) return;

  navToggle.classList.add("is-open");
  navMenu.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
};

const toggleMenu = () => {
  if (!navMenu) return;
  const isOpen = navMenu.classList.contains("is-open");
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
};

const scrollToSection = (hash) => {
  const target = document.querySelector(hash);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12;

  window.scrollTo({
    top,
    behavior: "smooth"
  });
};

const updateActiveNavLink = () => {
  if (!navLinks.length || !pageSections.length) return;

  const checkpoint = window.scrollY + getHeaderOffset() + 60;
  let activeId = pageSections[0].id;

  pageSections.forEach((section) => {
    if (checkpoint >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
  });
};

const initSmartStoreDemo = () => {
  if (!smartStore) return;

  const tabs = smartStore.querySelector("[data-store-tabs]");
  const productCard = smartStore.querySelector(".store-product-card");
  const productImage = smartStore.querySelector("[data-product-image]");
  const productTag = smartStore.querySelector("[data-product-tag]");
  const productName = smartStore.querySelector("[data-product-name]");
  const productPrice = smartStore.querySelector("[data-product-price]");
  const productProof = smartStore.querySelector("[data-product-proof]");
  const swatches = smartStore.querySelector("[data-store-swatches]");
  const controlLabel = smartStore.querySelector(".store-tryon span");

  const storageKey = "studio-ia-smart-store-combination";
  const adjustStorageKey = "studio-ia-smart-store-adjustment";
  const fallbackImage = "images/combinacoes/placeholder.jpg";
  const viewportAdjustDefaults = {
    mobile: {
      x: -13,
      y: 67,
      scale: 1.21
    },
    desktop: {
      x: 0,
      y: -30,
      scale: 1
    }
  };
  let activeProductIndex = 0;
  let isAdjustMode = false;
  let dragState = null;
  let suppressLightboxClick = false;
  let viewportAdjustments = {
    mobile: { ...viewportAdjustDefaults.mobile },
    desktop: { ...viewportAdjustDefaults.desktop }
  };
  let currentSelection = {
    vestido: "mostarda",
    bolsa: "navy",
    tenis: "branco",
    cenario: "concreto"
  };

  const readSavedSelection = () => {
    try {
      return {
        ...currentSelection,
        ...(JSON.parse(localStorage.getItem(storageKey)) || {})
      };
    } catch {
      return currentSelection;
    }
  };

  const saveSelection = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(currentSelection));
    } catch {
      // Mantem a troca funcionando mesmo se o navegador bloquear armazenamento local.
    }
  };

  const readSavedAdjust = () => {
    try {
      return {
        mobile: {
          ...viewportAdjustDefaults.mobile,
          ...((JSON.parse(localStorage.getItem(adjustStorageKey)) || {}).mobile || {})
        },
        desktop: {
          ...viewportAdjustDefaults.desktop,
          ...((JSON.parse(localStorage.getItem(adjustStorageKey)) || {}).desktop || {})
        }
      };
    } catch {
      return {
        mobile: { ...viewportAdjustDefaults.mobile },
        desktop: { ...viewportAdjustDefaults.desktop }
      };
    }
  };

  const saveAdjust = () => {
    try {
      localStorage.setItem(adjustStorageKey, JSON.stringify(viewportAdjustments));
    } catch {
      // Mantem o ajuste manual funcionando mesmo sem armazenamento local.
    }
  };

  const isMobileViewport = () => window.matchMedia("(max-width: 519px)").matches;
  const getViewportKey = () => (isMobileViewport() ? "mobile" : "desktop");
  const getCurrentAdjust = () => viewportAdjustments[getViewportKey()];

  const getAdjustCssText = () => {
    const currentAdjust = getCurrentAdjust();
    return `transform: translate(${currentAdjust.x}px, ${currentAdjust.y}px) scale(${currentAdjust.scale});`;
  };

  const updateAdjustReadout = (message) => {
    const currentAdjust = getCurrentAdjust();
    const viewportLabel = getViewportKey() === "mobile" ? "Mobile" : "Desktop";

    if (adjustValues) {
      adjustValues.textContent = getAdjustCssText();
    }

    if (adjustScaleValue) {
      adjustScaleValue.textContent = `${Math.round(currentAdjust.scale * 100)}%`;
    }

    if (adjustScale) {
      adjustScale.value = String(currentAdjust.scale);
    }

    if (adjustHint) {
      if (message) {
        adjustHint.textContent = message;
      } else if (isAdjustMode) {
        adjustHint.textContent = `${viewportLabel}: arraste a modelo e ajuste o tamanho antes de copiar o valor.`;
      } else {
        adjustHint.textContent = `${viewportLabel}: abra o painel para mover ou redimensionar a modelo neste layout.`;
      }
    }
  };

  const applyCurrentAdjust = () => {
    if (!productCard) return;

    const currentAdjust = getCurrentAdjust();
    const zoomOffset = Math.max(0, currentAdjust.scale - 1) * 220;

    productCard.style.setProperty("--store-adjust-x", `${currentAdjust.x}px`);
    productCard.style.setProperty("--store-adjust-y", `${currentAdjust.y}px`);
    productCard.style.setProperty("--store-adjust-scale", `${currentAdjust.scale}`);
    productCard.style.setProperty("--store-adjust-zoom-offset", `${zoomOffset}px`);
    updateAdjustReadout();
  };

  const getSavedVariantIndex = (productIndex) => {
    const product = smartStoreProducts[productIndex];
    const selectedSlug = currentSelection[product.key];
    const selectedIndex = product.variants.findIndex((variant) => variant.slug === selectedSlug);

    return Math.max(selectedIndex, 0);
  };

  const getSavedVariant = (productIndex) => {
    return smartStoreProducts[productIndex].variants[getSavedVariantIndex(productIndex)];
  };

  const getSelectedScenario = () => {
    const scenarioProduct = smartStoreProducts.find((product) => product.key === "cenario");
    return scenarioProduct?.variants.find((variant) => variant.slug === currentSelection.cenario) || scenarioProduct?.variants[0];
  };

  const getCombinationPath = () => {
    return `images/combinacoes-recortadas/vestido-${currentSelection.vestido}_bolsa-${currentSelection.bolsa}_tenis-${currentSelection.tenis}.png`;
  };

  const applyScenario = () => {
    if (!productCard) return;
    const scenario = getSelectedScenario();

    productCard.dataset.scenario = scenario?.slug || "concreto";
    productCard.dataset.finalScenario = "false";
    productCard.style.setProperty("--scenario-image", `url("${scenario?.image || "images/cenarios/cenario-1.jpeg"}")`);
  };

  const updateProductImage = () => {
    if (!productImage) return;

    const nextImage = getCombinationPath();
    applyScenario();
    productImage.classList.add("is-changing");

    window.setTimeout(() => {
      productImage.dataset.fallbackApplied = "false";
      productImage.src = nextImage;
      productImage.alt = `Look com vestido ${currentSelection.vestido}, bolsa ${currentSelection.bolsa} e tênis ${currentSelection.tenis}`;
    }, 120);
  };

  productImage?.addEventListener("load", () => {
    productImage.classList.remove("is-changing");
  });

  productImage?.addEventListener("error", () => {
    if (productImage.dataset.fallbackApplied === "true") return;

    productImage.dataset.fallbackApplied = "true";
    productImage.src = fallbackImage;
    productImage.alt = "Imagem padrão da Loja Inteligente";
    productImage.classList.remove("is-changing");
  });

  const openStoreLightbox = () => {
    if (!storeLightbox || !storeLightboxStage || !productImage) return;
    if (isAdjustMode || suppressLightboxClick) return;

    const scenario = getSelectedScenario();
    const previewScene = document.createElement("div");
    previewScene.className = `store-lightbox__scene store-lightbox__scene--${scenario?.slug || "concreto"}`;
    previewScene.style.setProperty("--scenario-image", `url("${scenario?.image || "images/cenarios/cenario-1.jpeg"}")`);

    const previewImage = document.createElement("img");
    previewImage.src = productImage.currentSrc || productImage.src;
    previewImage.alt = productImage.alt || "Imagem ampliada da Loja Inteligente";
    previewImage.className = "store-lightbox__image";

    previewScene.append(previewImage);
    storeLightboxStage.replaceChildren(previewScene);
    storeLightbox.classList.add("is-open");
    storeLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };

  productImage?.addEventListener("click", openStoreLightbox);

  const stopDrag = () => {
    if (!dragState) return;

    dragState = null;
    saveAdjust();
    window.setTimeout(() => {
      suppressLightboxClick = false;
    }, 80);
  };

  productImage?.addEventListener("pointerdown", (event) => {
    if (!isAdjustMode) return;

    const currentAdjust = getCurrentAdjust();

    dragState = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: currentAdjust.x,
      baseY: currentAdjust.y
    };

    suppressLightboxClick = false;
    productImage.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  productImage?.addEventListener("pointermove", (event) => {
    if (!dragState) return;

    const deltaX = Math.round(event.clientX - dragState.startX);
    const deltaY = Math.round(event.clientY - dragState.startY);

    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      suppressLightboxClick = true;
    }

    const currentAdjust = getCurrentAdjust();
    currentAdjust.x = dragState.baseX + deltaX;
    currentAdjust.y = dragState.baseY + deltaY;
    applyCurrentAdjust();
    event.preventDefault();
  });

  productImage?.addEventListener("pointerup", stopDrag);
  productImage?.addEventListener("pointercancel", stopDrag);
  productImage?.addEventListener("lostpointercapture", stopDrag);

  currentSelection = readSavedSelection();
  viewportAdjustments = readSavedAdjust();
  applyCurrentAdjust();

  adjustToggle?.addEventListener("click", () => {
    isAdjustMode = !isAdjustMode;
    adjustToggle.classList.toggle("is-active", isAdjustMode);
    adjustToggle.setAttribute("aria-expanded", isAdjustMode ? "true" : "false");
    smartStore.classList.toggle("is-adjust-mode", isAdjustMode);

    if (adjustPanel) {
      adjustPanel.hidden = !isAdjustMode;
    }

    updateAdjustReadout(isAdjustMode ? undefined : "Ajuste pausado. Reabra o painel quando quiser continuar.");
  });

  adjustReset?.addEventListener("click", () => {
    const viewportKey = getViewportKey();
    viewportAdjustments[viewportKey] = {
      ...viewportAdjustDefaults[viewportKey]
    };
    applyCurrentAdjust();
    saveAdjust();
    updateAdjustReadout(`Ajuste resetado para o padrao do ${viewportKey === "mobile" ? "mobile" : "desktop"}.`);
  });

  adjustCopy?.addEventListener("click", async () => {
    const cssText = getAdjustCssText();

    try {
      await navigator.clipboard.writeText(cssText);
      updateAdjustReadout("Ajuste copiado. Pode me mandar esse valor que eu travo no layout final.");
    } catch {
      updateAdjustReadout(`Copie manualmente: ${cssText}`);
    }
  });

  adjustScale?.addEventListener("input", (event) => {
    getCurrentAdjust().scale = Number(event.target.value);
    applyCurrentAdjust();
    saveAdjust();
  });

  window.addEventListener("resize", () => {
    applyCurrentAdjust();
    updateAdjustReadout();
  });

  const renderSwatches = (product, selectedVariantIndex) => {
    swatches.replaceChildren();

    product.variants.forEach((variant, index) => {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = `store-swatch${index === selectedVariantIndex ? " is-active" : ""}`;
      swatch.style.setProperty("--swatch-color", variant.color);
      if (variant.image) {
        swatch.classList.add("store-swatch--image");
        swatch.style.setProperty("--swatch-image", `url("${variant.image}")`);
      }
      swatch.setAttribute("aria-label", `Ver ${variant.label}`);
      swatch.setAttribute("aria-pressed", index === selectedVariantIndex ? "true" : "false");

      swatch.addEventListener("click", () => {
        swatches.querySelectorAll(".store-swatch").forEach((item) => {
          item.classList.remove("is-active");
          item.setAttribute("aria-pressed", "false");
        });
        swatch.classList.add("is-active");
        swatch.setAttribute("aria-pressed", "true");
        productCard.style.setProperty("--product-glow", variant.color);
        productProof.textContent = product.proof;
        currentSelection[product.key] = variant.slug;
        saveSelection();
        applyScenario();
        updateProductImage();
      });

      swatches.append(swatch);
    });
  };

  const renderProduct = (index) => {
    const product = smartStoreProducts[index];
    const selectedVariantIndex = getSavedVariantIndex(index);
    const selectedVariant = product.variants[selectedVariantIndex];

    activeProductIndex = index;

    productTag.textContent = product.tag;
    productName.textContent = product.name;
    productPrice.textContent = product.price;
    productProof.textContent = product.proof;
    if (controlLabel) {
      controlLabel.textContent = product.key === "cenario" ? "Cenário visual" : "Provador virtual";
    }
    productCard.style.setProperty("--product-glow", selectedVariant.color || product.glow);
    applyScenario();
    updateProductImage();

    tabs.querySelectorAll(".store-tab").forEach((tab, tabIndex) => {
      tab.classList.toggle("is-active", tabIndex === index);
      tab.setAttribute("aria-pressed", tabIndex === index ? "true" : "false");
    });

    renderSwatches(product, selectedVariantIndex);
  };

  smartStoreProducts.forEach((product, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `store-tab${index === 0 ? " is-active" : ""}`;
    tab.textContent = product.category;
    tab.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    tab.addEventListener("click", () => renderProduct(index));
    tabs.append(tab);
  });

  renderProduct(0);
  updateAdjustReadout();
};

if (navToggle) {
  navToggle.addEventListener("click", toggleMenu);
}

initSmartStoreDemo();

const closeStoreLightbox = () => {
  if (!storeLightbox || !storeLightboxStage) return;

  storeLightbox.classList.remove("is-open");
  storeLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  storeLightboxStage.replaceChildren();
};

storeLightboxClose?.addEventListener("click", closeStoreLightbox);

storeLightbox?.addEventListener("click", (event) => {
  if (event.target === storeLightbox) {
    closeStoreLightbox();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (href && href.startsWith("#")) {
      event.preventDefault();
      scrollToSection(href);
      closeMenu();
    } else {
      closeMenu();
    }
  });
});

document.addEventListener("click", (event) => {
  if (!navMenu || !navToggle) return;
  if (!navMenu.classList.contains("is-open")) return;

  const clickedInsideMenu = navMenu.contains(event.target);
  const clickedToggle = navToggle.contains(event.target);

  if (!clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  if (!isAdjustMode || !adjustFloating || !adjustToggle || !adjustPanel) return;

  const clickedInsideAdjuster = adjustFloating.contains(event.target);

  if (!clickedInsideAdjuster) {
    isAdjustMode = false;
    adjustToggle.classList.remove("is-active");
    adjustToggle.setAttribute("aria-expanded", "false");
    smartStore?.classList.remove("is-adjust-mode");
    adjustPanel.hidden = true;
    updateAdjustReadout("Ajuste pausado. Reabra o painel quando quiser continuar.");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeStoreLightbox();
  }
});

revealElements.forEach((element, index) => {
  const delay = Math.min(index * 55, 280);
  element.style.setProperty("--reveal-delay", `${delay}ms`);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateActiveNavLink();
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: `-${getHeaderOffset()}px 0px -45% 0px`
    }
  );

  pageSections.forEach((section) => sectionObserver.observe(section));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

window.addEventListener(
  "scroll",
  () => {
    updateHeaderState();
    updateActiveNavLink();
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (window.innerWidth >= 980) {
    closeMenu();
  }
  updateActiveNavLink();
});

window.addEventListener("load", () => {
  updateHeaderState();
  updateActiveNavLink();

  if (window.location.hash) {
    requestAnimationFrame(() => {
      scrollToSection(window.location.hash);
    });
  }
});
