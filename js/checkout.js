document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");

  const gameSelect = document.getElementById("game");
  const playerIdInput = document.getElementById("playerId");
  const serverInput = document.getElementById("server");

  const denominationList = document.getElementById("denominationList");
  const nominalInput = document.getElementById("nominal");
  const pricePreview = document.getElementById("pricePreview");

  const paymentSelect = document.getElementById("payment");
  const checkoutButton = document.getElementById("checkoutButton");

  const gameName = document.getElementById("gameName");
  const gameDescription = document.getElementById("gameDescription");
  const gameImage = document.getElementById("gameImage");
  const gameIconFallback = document.getElementById("gameIconFallback");
  const gameHeroBanner = document.getElementById("gameHeroBanner");

  const summaryName = document.getElementById("summaryName");
  const summaryDenomination = document.getElementById("summaryDenomination");
  const summaryPrice = document.getElementById("summaryPrice");

  let selectedProduct = null;
  let selectedDenomination = null;

  const products =
    typeof getProducts === "function"
      ? getProducts()
      : Array.isArray(window.PRODUCTS)
        ? window.PRODUCTS
        : [];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function rupiah(value) {
    if (typeof formatRupiah === "function") {
      return formatRupiah(value);
    }

    return "Rp " + Number(value || 0).toLocaleString("id-ID");
  }

  function findProduct(id) {
    return products.find(product =>
      String(product.id) === String(id) ||
      String(product.slug) === String(id)
    );
  }

  function updateHero(product) {
    if (!product) return;

    if (gameName) {
      gameName.textContent = product.name || "Game";
    }

    if (gameDescription) {
      gameDescription.textContent =
        product.description || "Top Up Game";
    }

    const image = product.image || "";

    if (gameImage) {
      if (image) {
        gameImage.src = image;
        gameImage.alt = product.name || "Game";

        gameImage.style.display = "block";

        gameImage.onerror = () => {
          gameImage.style.display = "none";

          if (gameIconFallback) {
            gameIconFallback.style.display = "flex";
            gameIconFallback.textContent = product.icon || "🎮";
          }
        };
      } else {
        gameImage.style.display = "none";

        if (gameIconFallback) {
          gameIconFallback.style.display = "flex";
          gameIconFallback.textContent = product.icon || "🎮";
        }
      }
    }

    if (gameHeroBanner) {
      const banner = product.banner || product.image || "";

      if (banner) {
        gameHeroBanner.style.backgroundImage =
          `url("${banner}")`;
      } else {
        gameHeroBanner.style.backgroundImage = "none";
      }
    }
  }

  function renderDenominations(product) {
    if (!denominationList) return;

    denominationList.innerHTML = "";

    selectedDenomination = null;

    if (nominalInput) {
      nominalInput.value = "";
    }

    if (pricePreview) {
      pricePreview.textContent = "";
    }

    if (!product ||
        !Array.isArray(product.denominations) ||
        product.denominations.length === 0) {

      denominationList.innerHTML = `
        <div class="checkout-empty">
          <strong>Nominal belum tersedia</strong>
          <span>Silakan pilih game lain.</span>
        </div>
      `;

      return;
    }

    const grouped = {};

    product.denominations.forEach(item => {
      const category = item.category || "Nominal";

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(item);
    });

    Object.entries(grouped).forEach(([category, items]) => {

      const section = document.createElement("div");

      section.className = "denomination-section";

      section.innerHTML = `
        <div class="denomination-section-heading">
          <h3>${escapeHtml(category)}</h3>
          <span>Select a variant</span>
        </div>

        <div class="denomination-list"></div>
      `;

      const list =
        section.querySelector(".denomination-list");

      items.forEach(item => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "denomination-option";

        button.dataset.id = item.id;

        const price = Number(item.price || 0);

        button.innerHTML = `
          <div class="denomination-main">

            <div class="denomination-title">
              ${escapeHtml(item.amount)}
            </div>

            <div class="denomination-price-box">

              <img
                src="assets/ui/diamond.webp"
                alt=""
                class="denomination-price-icon"
              >

              <span>
                ${rupiah(price)}
              </span>

            </div>

          </div>

          <div class="denomination-divider"></div>

          <div class="denomination-delivery">

            <img
              src="assets/ui/lightning.webp"
              alt=""
              class="denomination-delivery-icon"
            >

            <div class="denomination-delivery-text">
              <span>Pengiriman</span>
              <strong>CEPAT</strong>
            </div>

          </div>
        `;

        const diamondIcon =
          button.querySelector(".denomination-price-icon");

        const lightningIcon =
          button.querySelector(".denomination-delivery-icon");

        if (diamondIcon) {
          diamondIcon.onerror = () => {
            diamondIcon.style.display = "none";
          };
        }

        if (lightningIcon) {
          lightningIcon.onerror = () => {
            lightningIcon.style.display = "none";
          };
        }

        button.addEventListener("click", () => {
          selectDenomination(item, button);
        });

        list.appendChild(button);
      });

      denominationList.appendChild(section);
    });
  }

  function selectDenomination(item, button) {

    document
      .querySelectorAll(".denomination-option.selected")
      .forEach(element => {
        element.classList.remove("selected");
      });

    button.classList.add("selected");

    selectedDenomination = item;

    if (nominalInput) {
      nominalInput.value = item.id;
    }

    const price = Number(item.price || 0);

    if (pricePreview) {
      pricePreview.textContent = rupiah(price);
    }

    if (summaryName && selectedProduct) {
      summaryName.textContent =
        selectedProduct.name || "-";
    }

    if (summaryDenomination) {
      summaryDenomination.textContent =
        item.amount || "-";
    }

    if (summaryPrice) {
      summaryPrice.textContent =
        rupiah(price);
    }
  }

  function loadProduct(id) {

    const product = findProduct(id);

    if (!product) {
      selectedProduct = null;

      renderDenominations(null);

      return;
    }

    selectedProduct = product;

    updateHero(product);
    renderDenominations(product);

    if (summaryName) {
      summaryName.textContent =
        product.name || "-";
    }
  }

  /*
   * GAME SELECT
   */

  if (gameSelect) {

    gameSelect.addEventListener("change", () => {
      loadProduct(gameSelect.value);
    });

  }

  /*
   * INITIAL GAME FROM URL
   */

  const params =
    new URLSearchParams(window.location.search);

  const initialGame =
    params.get("game");

  if (initialGame && gameSelect) {

    const matchingOption =
      Array.from(gameSelect.options).find(option =>
        option.value === initialGame
      );

    if (matchingOption) {
      gameSelect.value = initialGame;
    }
  }

  const selectedGame =
    gameSelect?.value || initialGame;

  if (selectedGame) {
    loadProduct(selectedGame);
  }

  /*
   * FORM SUBMIT
   */

  if (form) {

    form.addEventListener("submit", event => {

      event.preventDefault();

      if (!selectedProduct) {
        alert("Silakan pilih game terlebih dahulu.");
        return;
      }

      if (!selectedDenomination) {
        alert("Silakan pilih nominal terlebih dahulu.");
        return;
      }

      const playerId =
        playerIdInput?.value.trim() || "";

      const server =
        serverInput?.value.trim() || "";

      const payment =
        paymentSelect?.value || "";

      if (!playerId) {
        alert("Masukkan User ID / Username.");
        playerIdInput?.focus();
        return;
      }

      if (!payment) {
        alert("Pilih metode pembayaran.");
        paymentSelect?.focus();
        return;
      }

      const orderId =
        "LEO-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random()
          .toString(36)
          .substring(2, 7)
          .toUpperCase();

      const order = {

        orderId,

        game:
          selectedProduct.slug ||
          selectedProduct.id,

        gameName:
          selectedProduct.name,

        playerId,

        server,

        denominationId:
          selectedDenomination.id,

        denomination:
          selectedDenomination.amount,

        amount:
          selectedDenomination.amount,

        price:
          Number(selectedDenomination.price || 0),

        payment,

        status:
          "Menunggu Pembayaran",

        createdAt:
          new Date().toISOString()
      };

      localStorage.setItem(
        "fidelis_last_order",
        JSON.stringify(order)
      );

      let orders = [];

      try {
        orders =
          JSON.parse(
            localStorage.getItem("fidelis_orders")
          ) || [];
      } catch {
        orders = [];
      }

      orders.unshift(order);

      localStorage.setItem(
        "fidelis_orders",
        JSON.stringify(orders)
      );

      if (checkoutButton) {
        checkoutButton.disabled = true;
        checkoutButton.textContent =
          "Membuat Pesanan...";
      }

      window.location.href =
        `payment.html?id=${encodeURIComponent(orderId)}`;
    });

  }
});
