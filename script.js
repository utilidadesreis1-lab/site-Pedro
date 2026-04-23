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
  const fallbackImage = "images/combinacoes/placeholder.jpg";
  let activeProductIndex = 0;
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

  currentSelection = readSavedSelection();

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
