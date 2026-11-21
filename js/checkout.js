/* =========================================================
   LEOOSTORE — CHECKOUT ENGINE
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const $ = (id) => document.getElementById(id);

  // Branded storefront notice replaces native browser alert dialogs.
  const checkoutNotice = $("checkoutNotice");
  const checkoutNoticeTitle = $("checkoutNoticeTitle");
  const checkoutNoticeMessage = $("checkoutNoticeMessage");
  const checkoutNoticeClose = $("checkoutNoticeClose");
  let checkoutNoticePreviousFocus = null;

  function showCheckoutNotice(message, title = "Periksa Pesanan") {
    if (!checkoutNotice || !checkoutNoticeMessage) {
      console.warn("[LEOOSTORE]", message);
      return;
    }
    checkoutNoticePreviousFocus = document.activeElement;
    checkoutNoticeTitle.textContent = title;
    checkoutNoticeMessage.textContent = String(message || "Terjadi kendala. Silakan coba lagi.");
    checkoutNotice.hidden = false;
    document.body.classList.add("checkout-notice-open");
    checkoutNoticeClose?.focus();
  }

  function closeCheckoutNotice() {
    if (!checkoutNotice || checkoutNotice.hidden) return;
    checkoutNotice.hidden = true;
    document.body.classList.remove("checkout-notice-open");
    checkoutNoticePreviousFocus?.focus?.();
  }

  checkoutNoticeClose?.addEventListener("click", closeCheckoutNotice);
  checkoutNotice?.querySelector(".checkout-notice-backdrop")?.addEventListener("click", closeCheckoutNotice);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && checkoutNotice && !checkoutNotice.hidden) closeCheckoutNotice();
  });

  const legacyProducts = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) ? PRODUCTS : (Array.isArray(window.PRODUCTS) ? window.PRODUCTS : []);
  const products = window.LEOOSTORE_CATALOG ? await window.LEOOSTORE_CATALOG.getCatalog(legacyProducts) : legacyProducts;

  const gameSelect = $("game");
  const playerIdInput = $("playerId");
  const serverInput = $("server");
  const serverField = $("serverField");
  const denominationList = $("denominationList");
  const nominalInput = $("nominal");
  const paymentInput = $("payment");
  const quantityInput = $("quantity");
  const quantityMinus = $("quantityMinus");
  const quantityPlus = $("quantityPlus");
  const gameName = $("gameName");
  const gameDescription = $("gameDescription");
  const gameImage = $("gameImage");
  const gameHeroBanner = $("gameHeroBanner");
  const gameIconFallback = $("gameIconFallback");
  const summaryImage = $("summaryProductImage");
  const summaryName = $("summaryProductName");
  const summaryDenomination = $("summaryProductDenomination");
  const summaryQuantity = $("summaryQuantity");
  const summaryFee = $("summaryAdminFee");
  const summaryFeeRow = $("summaryFeeRow");
  const summaryDiscount = $("summaryDiscount");
  const summaryDiscountRow = $("summaryDiscountRow");
  const summaryPrice = $("summaryProductPrice");
  const summaryTotal = $("summaryTotal");
  const qrisTotalBox = $("qrisTotalBox");
  const qrisTotalLabel = $("qrisTotalLabel");
  const qrisTotalAmount = $("qrisTotalAmount");
  const qrisTotalNote = $("qrisTotalNote");
  const promoButton = $("promoButton");
  const promoInput = $("promoCode");
  const promoMessage = $("promoMessage");
  const contactEmail = $("contactEmail");
  const contactWhatsapp = $("contactWhatsapp");
  const countryCode = $("countryCode");
  const checkoutButton = $("checkoutButton");
  const checkoutSummary = $("checkoutSummary");
  const summaryToggle = $("summaryToggle");
  const summaryEmpty = $("summaryEmpty");
  const summaryEmptyButton = $("summaryEmptyButton");
  const summaryContent = $("summaryContent");
  const summaryPayment = $("summaryPayment");
  const summarySpacer = document.querySelector(".checkout-scroll-spacer");
  const accountTitle = $("accountTitle");
  const accountDescription = $("accountDescription");
  const standardAccountFields = $("standardAccountFields");
  const robloxLoginFields = $("robloxLoginFields");
  const robloxUsername = $("robloxUsername");
  const robloxPassword = $("robloxPassword");
  const robloxInfoButton = $("robloxInfoButton");
  const robloxInfoPanel = $("robloxInfoPanel");
  const robloxInfoOk = $("robloxInfoOk");
  const robloxPreorderModal = $("robloxPreorderModal");
  const robloxPreorderBody = $("robloxPreorderBody");
  const robloxPreorderOk = $("robloxPreorderOk");

  const ORDERS_KEY = "LEOOSTORE_orders";
  const LAST_ORDER_KEY = "LEOOSTORE_last_order";

  let selectedProduct = null;
  let selectedDenomination = null;
  let selectedPayment = null;
  let promoApplied = false;
  let appliedPromo = null;

  // Keep the document's bottom clearance equal to the live sticky summary height.
  const syncSummarySpacer = () => {
    if (!checkoutSummary || !summarySpacer) return;
    const height = Math.ceil(checkoutSummary.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--checkout-summary-space", `${height}px`);
  };
  if (checkoutSummary && summarySpacer) {
    if ("ResizeObserver" in window) {
      const summaryResizeObserver = new ResizeObserver(syncSummarySpacer);
      summaryResizeObserver.observe(checkoutSummary);
    }
    window.addEventListener("resize", syncSummarySpacer, { passive: true });
    syncSummarySpacer();
  }


  const rupiah = (value) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const getProduct = (id) => products.find((p) =>
    String(p.id) === String(id) || String(p.slug) === String(id)
  ) || null;

  const getQuantity = () => {
    let value = Number(quantityInput?.value || 1);
    if (!Number.isFinite(value)) value = 1;
    value = Math.max(1, Math.min(99, Math.floor(value)));
    if (quantityInput) quantityInput.value = value;
    return value;
  };

  function populateGames() {
    if (!gameSelect) return;
    gameSelect.innerHTML = '<option value="">Pilih Game</option>';
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.slug || product.id;
      option.textContent = product.name || product.id;
      gameSelect.appendChild(option);
    });
  }

  function updateHero(product) {
    if (!product) {
      if (gameName) gameName.textContent = "Pilih Game";
      if (gameDescription) gameDescription.textContent = "Pilih publisher";
      if (gameImage) {
        gameImage.removeAttribute("src");
        gameImage.style.display = "none";
      }
      if (gameHeroBanner) {
        gameHeroBanner.style.backgroundImage = "";
        gameHeroBanner.style.setProperty("--hero-banner-image", "none");
      }
      if (gameIconFallback) {
        gameIconFallback.textContent = "🎮";
        gameIconFallback.style.display = "flex";
      }
      return;
    }

    const image = product.image || "";
    if (gameName) gameName.textContent = product.name || "Game";
    if (gameDescription) gameDescription.textContent = product.publisher || "Publisher";
    if (gameImage) {
      gameImage.src = image;
      gameImage.alt = product.name || "Game";
      gameImage.style.display = image ? "block" : "none";
    }
    if (gameHeroBanner) {
      gameHeroBanner.style.backgroundImage = "";
      const configuredBanner = String(product.banner || "").trim();
      if (configuredBanner) {
        const probe = new Image();
        probe.onload = () => gameHeroBanner.style.setProperty("--hero-banner-image", `url("${configuredBanner.replace(/["\\\\]/g, "")}")`);
        probe.onerror = () => {
          console.warn("[LEOOSTORE] Banner checkout dari admin gagal dimuat:", configuredBanner);
          gameHeroBanner.style.setProperty("--hero-banner-image", "none");
        };
        probe.src = configuredBanner;
      } else {
        const bannerCandidates = ["banner.webp", "assets/banner.webp"];
        const tryBanner = (index) => {
          if (index >= bannerCandidates.length) {
            gameHeroBanner.style.setProperty("--hero-banner-image", "none");
            return;
          }
          const bannerUrl = new URL(bannerCandidates[index], document.baseURI).href;
          const probe = new Image();
          probe.onload = () => gameHeroBanner.style.setProperty("--hero-banner-image", `url("${bannerUrl}")`);
          probe.onerror = () => tryBanner(index + 1);
          probe.src = bannerUrl + (bannerUrl.includes("?") ? "&" : "?") + "v=20261018";
        };
        tryBanner(0);
      }
    }
    if (gameIconFallback) {
      gameIconFallback.textContent = product.icon || "🎮";
      gameIconFallback.style.display = image ? "none" : "flex";
    }
  }

  function updateAccountFields(product) {
    const id = String(product?.id || "");
    const isRoblox = id === "roblox-via-login" || id === "roblox-via-username";
    const isRobloxLogin = id === "roblox-via-login";
    const isRobloxUsername = id === "roblox-via-username";
    const isPubg = id === "pubg-mobile";
    const isFreeFire = id === "free-fire" || id === "freefire";
    const isValorant = id === "valorant";

    const useId = product?.useId !== false;
    const useServer = product?.useServer !== false && !(isRoblox || isPubg || isFreeFire || isValorant);
    const playerField = playerIdInput?.closest(".form-group");
    if (playerField) playerField.style.display = (isRoblox || useId) ? "" : "none";
    if (serverField) serverField.style.display = useServer ? "" : "none";
    if (serverInput && !useServer) serverInput.value = "";
    if (playerIdInput && !useId && !isRoblox) playerIdInput.value = "";
    if (accountTitle) accountTitle.textContent = "Data Akun";
    if (accountDescription) accountDescription.textContent = (isRobloxLogin || isRobloxUsername)
      ? "Masukkan username dan password."
      : "Masukkan data akun untuk proses top up.";
    if (standardAccountFields) standardAccountFields.hidden = isRobloxLogin || isRobloxUsername;
    if (robloxLoginFields) robloxLoginFields.hidden = !(isRobloxLogin || isRobloxUsername);
    if (robloxInfoButton) robloxInfoButton.hidden = !(isRobloxLogin || isRobloxUsername);
    if (!isRoblox) {
      if (robloxUsername) robloxUsername.value = "";
      if (robloxPassword) robloxPassword.value = "";
      if (robloxInfoPanel) robloxInfoPanel.hidden = true;
    }
    if (playerIdInput) {
      playerIdInput.placeholder = id === "roblox-via-login" || id === "roblox-via-username"
        ? "Masukkan Username Roblox"
        : isValorant
          ? "Masukkan Riot ID"
          : "Masukkan Player ID";
    }
  }

  function renderDenominations(product) {
    if (!denominationList) return;
    selectedDenomination = null;
    if (nominalInput) nominalInput.value = "";

    if (!product?.denominations?.length) {
      denominationList.innerHTML = '<div class="checkout-loading">Pilih game terlebih dahulu.</div>';
      updateSummary();
      return;
    }

    const groups = {};
    product.denominations.forEach((item) => {
      const category = item.category || "Top Up";
      (groups[category] ||= []).push(item);
    });

    denominationList.innerHTML = "";
    Object.entries(groups).forEach(([category, items]) => {
      const group = document.createElement("div");
      group.className = "denomination-group";
      group.innerHTML = `<div class="denomination-category-title">${escapeHTML(category)}</div>`;

      const grid = document.createElement("div");
      grid.className = "denomination-group-grid";

      items.forEach((item) => {
        const option = document.createElement("div");
        option.className = "denomination-option";
        option.dataset.id = item.id;
        option.setAttribute("role", "button");
        option.setAttribute("tabindex", "0");
        option.innerHTML = `
          <div class="denomination-main">
            <div class="denomination-title">${escapeHTML(item.amount)}</div>
            <div class="denomination-price-row">
              ${item.image ? '<img src="' + escapeHTML(item.image) + '" alt="" class="denomination-product-icon" loading="lazy">' : ""}
              <div class="denomination-price-box"><span>${item.logo ? `<img src="${escapeHTML(item.logo)}" alt="" class="denomination-logo">` : ""}${rupiah(item.price)}</span></div>
            </div>
          </div>
          <div class="denomination-divider"></div>
          <div class="denomination-delivery">
            <div class="denomination-delivery-text">
              <span class="delivery-icon" aria-hidden="true">⚡</span>
              <span>Proses Cepat</span>
            </div>
          </div>`;

        const choose = () => {
          selectedDenomination = item;
          document.querySelectorAll(".denomination-option").forEach((el) => el.classList.remove("selected"));
          option.classList.add("selected");
          if (nominalInput) nominalInput.value = item.id;
          updateSummary();

          // Setelah nominal dipilih, arahkan pelanggan ke metode pembayaran.
          const paymentSection = document.getElementById("paymentMethodsSection");
          if (paymentSection) {
            paymentSection.style.scrollMarginTop = "96px";
            requestAnimationFrame(() => {
              const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
              paymentSection.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
              });
            });
          }
        };
        option.addEventListener("click", choose);
        option.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            choose();
          }
        });
        grid.appendChild(option);
      });

      group.appendChild(grid);
      denominationList.appendChild(group);
    });

    const fitDenominationTitles = () => {
      denominationList.querySelectorAll(".denomination-title").forEach((title) => {
        const baseSize = window.matchMedia("(max-width: 600px)").matches ? 13 : 14;
        // The stylesheet declares font-size with !important, so the fit size
        // must use the same priority or the browser will keep the fixed size.
        title.style.setProperty("font-size", baseSize + "px", "important");
        let size = baseSize;
        while (title.scrollWidth > title.clientWidth + 1 && size > 8) {
          size = Math.max(8, size - 0.5);
          title.style.setProperty("font-size", size + "px", "important");
        }
      });
    };

    fitDenominationTitles();
    if (!denominationList.dataset.titleFitObserver && "ResizeObserver" in window) {
      const titleFitObserver = new ResizeObserver(() => fitDenominationTitles());
      titleFitObserver.observe(denominationList);
      denominationList.dataset.titleFitObserver = "true";
    }
  }

  function selectPayment(element) {
    document.querySelectorAll(".payment-option").forEach((item) => item.classList.remove("selected"));
    element.classList.add("selected");
    selectedPayment = {
      id: element.dataset.paymentId,
      name: element.dataset.paymentName,
      fee: Number(element.dataset.fee || 0),
      feeFixed: Number(element.dataset.feeFixed || 0),
      feeType: element.dataset.feeType || "fixed"
    };
    if (paymentInput) paymentInput.value = selectedPayment.id;
    updateSummary();
  }

  function getBaseTotal() {
    return selectedDenomination ? Number(selectedDenomination.price || 0) * getQuantity() : 0;
  }

  function getPaymentFee() {
    if (!selectedDenomination || !selectedPayment) return 0;
    const base = getBaseTotal();
    const percent = Number(selectedPayment.fee || 0);
    const fixed = Number(selectedPayment.feeFixed || 0);
    if (selectedPayment.feeType === "percent") return Math.round(base * percent / 100);
    if (selectedPayment.feeType === "mixed") return Math.round(base * percent / 100) + fixed;
    return fixed || percent;
  }

  function getPromoDiscount() {
    if (!promoApplied || !appliedPromo) return 0;
    const base = getBaseTotal();
    return appliedPromo.discount_type === "percent"
      ? Math.round(base * Number(appliedPromo.discount_value || 0) / 100)
      : Math.min(base, Number(appliedPromo.discount_value || 0));
  }

  function getTotal() {
    return Math.max(0, getBaseTotal() - getPromoDiscount() + getPaymentFee());
  }

  // Animate displayed summary numbers only; all transaction calculations remain unchanged.
  const summaryNumberFrames = new WeakMap();
  const animateSummaryNumber = (element, targetValue, formatter) => {
    if (!element) return;
    const target = Number(targetValue || 0);
    const displayedText = element.textContent || "";
    const parsedCurrent = Number(displayedText.replace(/[^0-9-]/g, ""));
    const start = Number.isFinite(parsedCurrent) ? parsedCurrent : target;
    const previousFrame = summaryNumberFrames.get(element);
    if (previousFrame) cancelAnimationFrame(previousFrame);

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion || start === target) {
      element.textContent = formatter(target);
      summaryNumberFrames.delete(element);
      return;
    }

    const duration = 360;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      element.textContent = formatter(value);
      if (progress < 1) {
        summaryNumberFrames.set(element, requestAnimationFrame(tick));
      } else {
        element.textContent = formatter(target);
        summaryNumberFrames.delete(element);
      }
    };
    summaryNumberFrames.set(element, requestAnimationFrame(tick));
  };

  function updateSummary() {
    const quantity = getQuantity();
    animateSummaryNumber(summaryQuantity, quantity, (value) => String(Math.max(0, value)));
    if (summaryName) summaryName.textContent = selectedProduct?.name || "Pilih Game";
    if (summaryDenomination) summaryDenomination.textContent = selectedDenomination?.amount || "Pilih nominal";
    const paymentFee = getPaymentFee();
    const promoDiscount = getPromoDiscount();
    animateSummaryNumber(summaryFee, paymentFee, rupiah);
    animateSummaryNumber(summaryPrice, getBaseTotal(), rupiah);
    animateSummaryNumber(summaryTotal, getTotal(), rupiah);
    if (summaryFeeRow) summaryFeeRow.hidden = !selectedPayment || paymentFee <= 0;
    animateSummaryNumber(summaryDiscount, -promoDiscount, (value) => "-" + rupiah(Math.abs(value)));
    if (summaryDiscountRow) summaryDiscountRow.hidden = !promoApplied || promoDiscount <= 0;
    if (summaryPayment) summaryPayment.textContent = selectedPayment
      ? (selectedPayment.id === "qris" ? "QRIS (All Payment)" : selectedPayment.name)
      : "-";
    const hasProduct = Boolean(selectedProduct && selectedDenomination);
    if (qrisTotalBox) qrisTotalBox.hidden = false;
    if (qrisTotalLabel) qrisTotalLabel.textContent = hasProduct ? "Total Pembayaran" : "Minimal Pembayaran QRIS";
    if (qrisTotalAmount) animateSummaryNumber(qrisTotalAmount, hasProduct ? getTotal() : 100, rupiah);
    if (qrisTotalNote) {
      qrisTotalNote.textContent = "Termasuk biaya layanan QRIS";
      qrisTotalNote.hidden = !hasProduct;
    }
    if (checkoutSummary) checkoutSummary.classList.toggle("has-product", hasProduct);
    if (summaryEmpty) summaryEmpty.hidden = hasProduct;
    if (summaryContent) summaryContent.hidden = !hasProduct;
    if (summaryToggle) {
      summaryToggle.hidden = !hasProduct;
      summaryToggle.setAttribute("aria-expanded", String(checkoutSummary?.classList.contains("expanded") || false));
      summaryToggle.setAttribute("aria-label", checkoutSummary?.classList.contains("expanded") ? "Tutup ringkasan" : "Buka ringkasan");
    }
    if (checkoutButton) checkoutButton.disabled = !hasProduct;
    syncSummarySpacer();

    updateEwalletCards();

    if (summaryImage) {
      if (selectedProduct?.image) {
        summaryImage.src = selectedProduct.image;
        summaryImage.alt = selectedProduct.name || "Produk";
      } else {
        summaryImage.removeAttribute("src");
      }
    }
  }

  function getFeeForPaymentOption(option) {
    const fee = Number(option.dataset.fee || 0);
    const fixed = Number(option.dataset.feeFixed || 0);
    const type = option.dataset.feeType || "fixed";
    const base = getBaseTotal();
    if (type === "percent") return Math.round(base * fee / 100);
    if (type === "mixed") return Math.round(base * fee / 100) + fixed;
    return fixed || fee;
  }

  function updateEwalletCards() {
    document.querySelectorAll(".payment-option-ewallet").forEach((option) => {
      const fee = getFeeForPaymentOption(option);
      const total = Math.max(0, getBaseTotal() - getPromoDiscount() + fee);
      const price = option.querySelector(".ewallet-price");
      const service = option.querySelector(".ewallet-service-fee");
      if (price) price.textContent = selectedDenomination ? rupiah(total) : "Pilih nominal";
      if (service) service.textContent = "Biaya layanan " + rupiah(fee);
    });
  }

  function showRobloxPreorderInfo(product) {
    if (!robloxPreorderModal || !product) return;
    const id = String(product.id || "");
    const isRobloxUsername = id === "roblox-via-username";
    const isRobloxLogin = id === "roblox-via-login";
    if (!isRobloxUsername && !isRobloxLogin) return;

    const formatText = 'Halo min, saya sudah order (nominal robux) dengan username LeoXXXX (tidak perlu mirip)';
    if (robloxPreorderBody) {
      robloxPreorderBody.innerHTML = isRobloxUsername
        ? '<ul><li>Pastikan akun Roblox berusia <strong>18+</strong>.</li><li>Pastikan <strong>V2L aktif</strong>.</li><li>Masukkan username Roblox dengan benar.</li><li>Pesanan yang sudah diproses tidak dapat dibatalkan karena kesalahan data.</li><li>Setelah melakukan pembayaran, hubungi WhatsApp admin <strong>LEOOSTORE 085823538473</strong> dan kirim format:</li></ul><div class="roblox-format">"' + escapeHTML(formatText) + '"</div>'
        : '<ul><li>Metode ini membutuhkan <strong>Username &amp; Password Roblox</strong>.</li><li>Data digunakan hanya untuk proses top up.</li><li>Jangan memberikan password akun selain melalui halaman checkout resmi.</li><li>Setelah melakukan pembayaran, hubungi WhatsApp admin <strong>LEOOSTORE 085823538473</strong> dan kirim format:</li></ul><div class="roblox-format">"' + escapeHTML(formatText) + '"</div>';
    }

    robloxPreorderModal.hidden = false;
    robloxPreorderModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("roblox-preorder-open");
    setTimeout(() => robloxPreorderOk?.focus(), 0);
  }

  function closeRobloxPreorderInfo() {
    if (!robloxPreorderModal) return;
    robloxPreorderModal.hidden = true;
    robloxPreorderModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("roblox-preorder-open");
  }

  function selectGame(gameId) {
    selectedProduct = getProduct(gameId);
    selectedDenomination = null;
    selectedPayment = null;
    if (paymentInput) paymentInput.value = "";
    document.querySelectorAll(".payment-option").forEach((option) => option.classList.remove("selected"));
    updateHero(selectedProduct);
    updateAccountFields(selectedProduct);
    renderDenominations(selectedProduct);
    updateSummary();
    showRobloxPreorderInfo(selectedProduct);
  }

  function setupPayments() {
    document.querySelectorAll(".payment-option").forEach((option) => {
      option.addEventListener("click", () => selectPayment(option));
      option.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPayment(option);
        }
      });
    });
    document.querySelectorAll(".payment-category-header").forEach((header) => {
      header.addEventListener("click", () => {
        header.closest(".payment-category")?.classList.toggle("open");
      });
    });
  }

  async function loadQrisPaymentImage() {
    try {
      if (!window.supabase?.createClient) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const db = window.supabase.createClient(
        "https://tvdbrqskvuukxvqaqjom.supabase.co",
        "sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF"
      );
      const { data, error } = await db
        .from("store_payment_methods")
        .select("id,logo_url,fee_type,fee_value,fee_fixed")
        .in("id", ["qris", "dana", "ovo", "gopay", "shopeepay"]);
      if (error) throw error;

      (data || []).forEach((method) => {
        const option = document.querySelector('.payment-option[data-payment-id="' + method.id + '"]');
        if (!option) return;
        const image = option.querySelector("img");
        if (method.logo_url && image) image.src = method.logo_url;
        option.dataset.fee = String(Number(method.fee_value || 0));
        option.dataset.feeFixed = String(Number(method.fee_fixed || 0));
        option.dataset.feeType = String(method.fee_type || "fixed");
        if (method.id === "qris") return;

        option.classList.add("payment-option-ewallet");
        option.setAttribute("aria-label", "Pilih pembayaran " + (option.dataset.paymentName || method.id));
        option.innerHTML = `
          <span class="ewallet-logo-wrap"><img src="${image?.src || ""}" alt="" loading="lazy"></span>
          <strong class="ewallet-price">Pilih nominal</strong>
          <span class="ewallet-divider" aria-hidden="true"></span>
          <span class="ewallet-service-fee">Biaya layanan Rp0</span>
        `;
      });

      const qris = (data || []).find((method) => method.id === "qris");
      const qrisImage = $("paymentQrisImage");
      const qrisOption = document.querySelector('.payment-option[data-payment-id="qris"]');
      if (qris?.logo_url && qrisImage) qrisImage.src = qris.logo_url;
      if (qrisOption && qris) {
        qrisOption.dataset.fee = String(Number(qris.fee_value || 0));
        qrisOption.dataset.feeFixed = String(Number(qris.fee_fixed || 0));
        qrisOption.dataset.feeType = String(qris.fee_type || "fixed");
        if (selectedPayment?.id === "qris") {
          selectedPayment.fee = Number(qrisOption.dataset.fee || 0);
          selectedPayment.feeFixed = Number(qrisOption.dataset.feeFixed || 0);
          selectedPayment.feeType = qrisOption.dataset.feeType;
        }
      }
      updateSummary();
    } catch (error) {
      console.warn("Payment logos/settings from admin could not be loaded; using checkout fallback values.", error);
    }
  }

  async function applyPromo() {
    const code = String(promoInput?.value || "").trim().toUpperCase();
    promoApplied = false; appliedPromo = null;
    if (!code) { if (promoMessage) promoMessage.textContent = "Masukkan kode promo."; updateSummary(); return; }
    try {
      if (!window.supabase?.createClient) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
          script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
        });
      }
      const db = window.supabase.createClient("https://tvdbrqskvuukxvqaqjom.supabase.co", "sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF");
      const {data: promoRows, error} = await db.from("store_promos").select("id,code,discount_type,discount_value,is_active,starts_at,ends_at,usage_limit,usage_count,per_user_limit,min_purchase").eq("is_active", true);
      if (error) throw error;
      const data = (promoRows || []).find((row) => String(row.code || "").trim().toUpperCase() === code);
      if (!data) throw new Error("Kode promo tidak ditemukan atau nonaktif. Pastikan kode tersimpan dan statusnya Aktif.");
      const now = Date.now();
      if (data.starts_at && new Date(data.starts_at).getTime() > now) throw new Error("Kode promo belum berlaku.");
      if (data.ends_at && new Date(data.ends_at).getTime() < now) throw new Error("Masa berlaku promo sudah habis.");
      if (data.usage_limit != null && Number(data.usage_count || 0) >= Number(data.usage_limit)) throw new Error("Kuota promo sudah habis.");
      if (getBaseTotal() < Number(data.min_purchase || 0)) throw new Error("Minimum transaksi Rp" + Number(data.min_purchase).toLocaleString("id-ID") + ".");
      if (!["fixed","percent"].includes(data.discount_type) || Number(data.discount_value) <= 0 || (data.discount_type === "percent" && Number(data.discount_value) > 100)) throw new Error("Pengaturan diskon tidak valid.");
      appliedPromo = data; promoApplied = true;
      if (promoMessage) promoMessage.textContent = "Kode " + code + " berhasil digunakan.";
    } catch (err) {
      if (promoMessage) promoMessage.textContent = err.message || "Gagal memeriksa kode promo.";
    }
    updateSummary();
  }

  async function createOrder() {
    if (!selectedProduct) return showCheckoutNotice("Silakan pilih game terlebih dahulu.", "Game Belum Dipilih");
    if (!selectedDenomination) return showCheckoutNotice("Silakan pilih nominal terlebih dahulu.", "Nominal Belum Dipilih");

    const isRoblox = selectedProduct.id === "roblox-via-login" || selectedProduct.id === "roblox-via-username";
    if (isRoblox) {
      if (!robloxUsername?.value.trim()) {
        showCheckoutNotice("Silakan masukkan Username Roblox.", "Data Akun Belum Lengkap");
        robloxUsername?.focus();
        return;
      }
      if (!robloxPassword?.value) {
        showCheckoutNotice("Silakan masukkan Password Roblox.", "Data Akun Belum Lengkap");
        robloxPassword?.focus();
        return;
      }
    } else if (selectedProduct.useId !== false && !playerIdInput?.value.trim()) {
      showCheckoutNotice("Silakan masukkan Player ID.", "Data Akun Belum Lengkap");
      playerIdInput?.focus();
      return;
    }
    if (!isRoblox && selectedProduct.useServer !== false && selectedProduct.id !== "pubg-mobile" && selectedProduct.id !== "free-fire" && selectedProduct.id !== "freefire" && selectedProduct.id !== "valorant" && !serverInput?.value.trim()) {
      showCheckoutNotice("Silakan masukkan Server.", "Data Akun Belum Lengkap");
      serverInput?.focus();
      return;
    }
    if (!selectedPayment) return showCheckoutNotice("Silakan pilih metode pembayaran.", "Metode Pembayaran Belum Dipilih");
    const orderId = "LEO-" + Date.now().toString(36).toUpperCase();
    const order = {
      id: orderId,
      orderId,
      gameId: selectedProduct.id,
      game: selectedProduct.name,
      gameName: selectedProduct.name,
      playerId: isRoblox ? robloxUsername.value.trim() : playerIdInput.value.trim(),
      username: isRoblox ? robloxUsername.value.trim() : "",
      server: serverInput?.value.trim() || "",
      denominationId: selectedDenomination.id,
      denomination: selectedDenomination.amount,
      amount: selectedDenomination.amount,
      quantity: getQuantity(),
      paymentId: selectedPayment.id,
      payment: selectedPayment.name,
      paymentName: selectedPayment.name,
      email: contactEmail.value.trim(),
      whatsapp: (countryCode?.value || "+62") + contactWhatsapp.value.trim(),
      subtotal: getBaseTotal(),
      price: getTotal(),
      fee: getPaymentFee(),
      total: getTotal(),
      promo: promoApplied && appliedPromo ? appliedPromo.code : "",
      status: "Menunggu Pembayaran",
      createdAt: new Date().toISOString()
    };

    if (checkoutButton) {
      checkoutButton.disabled = true;
      checkoutButton.textContent = "Membuat Pembayaran...";
    }

    try {
      const paymentPayload = JSON.stringify({
        orderId,
        productId: selectedProduct.id,
        denominationId: selectedDenomination.id,
        quantity: getQuantity(),
        paymentId: selectedPayment.id,
        email: order.email,
        whatsapp: order.whatsapp,
        playerId: order.playerId,
        server: order.server,
        promo: order.promo
      });

      let response;
      try {
        response = await fetch("https://spring-surf-a6a7.leovbriansyh791.workers.dev/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: paymentPayload,
          cache: "no-store"
        });
      } catch (networkError) {
        console.error("Payment API network error:", networkError);
        throw new Error("Payment server tidak dapat dihubungi. Coba refresh halaman dan ulangi.");
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        if (result.stage === "supabase-catalog") {
          const gamesCode = Number.isFinite(Number(result.gamesStatus)) ? result.gamesStatus : "tidak diketahui";
          const productsCode = Number.isFinite(Number(result.productsStatus)) ? result.productsStatus : "tidak diketahui";
          console.error("Checkout catalog verification failed:", {
            httpStatus: response.status,
            gamesStatus: result.gamesStatus,
            productsStatus: result.productsStatus,
            diagnostic: result.diagnostic
          });
          throw new Error(
            "Katalog belum dapat diverifikasi (HTTP " + response.status +
            "; store_games: " + gamesCode +
            "; store_products: " + productsCode +
            "). Kirim kode ini ke admin agar bisa diperbaiki."
          );
        }
        throw new Error(result.error || "Gagal membuat pembayaran.");
      }

      order.midtransToken = result.token || "";
      order.paymentUrl = result.redirectUrl || "";
      order.backendStatus = result.status || "Menunggu Pembayaran";

      let orders = [];
      try {
        orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
        if (!Array.isArray(orders)) orders = [];
      } catch (_) {
        orders = [];
      }
      orders.unshift(order);

      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      localStorage.setItem("fidelis_orders", JSON.stringify(orders));
      localStorage.setItem("fidelis_last_order", JSON.stringify(order));

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        window.location.href = "payment.html?id=" + encodeURIComponent(orderId);
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
      if (checkoutButton) {
        checkoutButton.disabled = false;
        checkoutButton.textContent = "Bayar Sekarang";
      }
      showCheckoutNotice(error.message || "Gagal membuat pembayaran. Silakan coba lagi.", "Pembayaran Belum Berhasil");
    }
  }

  gameSelect?.addEventListener("change", () => selectGame(gameSelect.value));
  quantityMinus?.addEventListener("click", () => {
    quantityInput.value = Math.max(1, getQuantity() - 1);
    updateSummary();
  });
  quantityPlus?.addEventListener("click", () => {
    quantityInput.value = Math.min(99, getQuantity() + 1);
    updateSummary();
  });
  quantityInput?.addEventListener("input", updateSummary);
  promoButton?.addEventListener("click", applyPromo);
  summaryToggle?.addEventListener("click", () => {
    if (!selectedProduct || !selectedDenomination || !checkoutSummary) return;
    checkoutSummary.classList.toggle("expanded");
    updateSummary();
  });
  summaryEmptyButton?.addEventListener("click", () => gameSelect?.focus());

  checkoutButton?.addEventListener("click", createOrder);
  robloxInfoButton?.addEventListener("click", () => {
    if (robloxInfoPanel) robloxInfoPanel.hidden = false;
  });
  robloxPreorderOk?.addEventListener("click", closeRobloxPreorderInfo);
  robloxPreorderModal?.querySelector(".roblox-preorder-backdrop")?.addEventListener("click", closeRobloxPreorderInfo);

  robloxInfoOk?.addEventListener("click", () => {
    if (robloxInfoPanel) robloxInfoPanel.hidden = true;
  });

  populateGames();
  setupPayments();
  loadQrisPaymentImage();

  const queryGame = new URLSearchParams(window.location.search).get("game");
  if (queryGame && getProduct(queryGame)) {
    gameSelect.value = getProduct(queryGame).slug || getProduct(queryGame).id;
    selectGame(gameSelect.value);
  } else {
    updateHero(null);
    updateAccountFields(null);
    renderDenominations(null);
    updateSummary();
  }
});
