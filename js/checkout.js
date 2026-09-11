/* =========================================================
   LEOOSTORE — CHECKOUT ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const checkoutForm = document.getElementById("checkoutForm");
  const gameSelect = document.getElementById("game");
  const playerIdInput = document.getElementById("playerId");
  const serverInput = document.getElementById("server");

  const denominationList =
    document.getElementById("denominationList");

  const nominalInput =
    document.getElementById("nominal");

  const paymentInput =
    document.getElementById("payment");

  const quantityInput =
    document.getElementById("quantity");

  const quantityMinus =
    document.getElementById("quantityMinus");

  const quantityPlus =
    document.getElementById("quantityPlus");

  const summaryName =
    document.getElementById("summaryName");

  const summaryDenomination =
    document.getElementById("summaryDenomination");

  const summaryQuantity =
    document.getElementById("summaryQuantity");

  const summaryPayment =
    document.getElementById("summaryPayment");

  const summaryFee =
    document.getElementById("summaryFee");

  const summaryPrice =
    document.getElementById("summaryPrice");

  const gameName =
    document.getElementById("gameName");

  const gameDescription =
    document.getElementById("gameDescription");

  const gameImage =
    document.getElementById("gameImage");

  const gameHeroBanner =
    document.getElementById("gameHeroBanner");

  const gameIconFallback =
    document.getElementById("gameIconFallback");

  const promoButton =
    document.getElementById("promoButton");

  const promoInput =
    document.getElementById("promoCode");

  const promoMessage =
    document.getElementById("promoMessage");

  const contactEmail =
    document.getElementById("contactEmail");

  const contactWhatsapp =
    document.getElementById("contactWhatsapp");

  const countryCode =
    document.getElementById("countryCode");


  const ORDERS_KEY = "LEOOSTORE_orders";
const LAST_ORDER_KEY = "LEOOSTORE_last_orders";

  const products =
    typeof getProducts === "function"
      ? getProducts()
      : (window.PRODUCTS || []);


  let selectedProduct = null;
  let selectedDenomination = null;
  let selectedPayment = null;
  let promoApplied = false;


  /* =========================================================
     HELPERS
  ========================================================= */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  function rupiah(value) {

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }
    ).format(Number(value || 0));

  }


  function getProduct(gameId) {

    return products.find(product =>
      String(product.slug || product.id) ===
      String(gameId)
    );

  }


  function getQueryGame() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    return params.get("game");

  }


  function getQuantity() {

    const value =
      Number(quantityInput?.value || 1);

    return Math.max(
      1,
      Math.min(99, value)
    );

  }


  function getPaymentFee() {

    if (!selectedDenomination || !selectedPayment) {
      return 0;
    }

    const base =
      Number(selectedDenomination.price || 0) *
      getQuantity();

    const fee =
      Number(selectedPayment.fee || 0);

    if (
      selectedPayment.feeType ===
      "percent"
    ) {

      return Math.round(
        base * fee
      );

    }

    return fee;

  }


  function getBaseTotal() {

    if (!selectedDenomination) {
      return 0;
    }

    return (
      Number(selectedDenomination.price || 0) *
      getQuantity()
    );

  }


  function getTotal() {

    return (
      getBaseTotal() +
      getPaymentFee()
    );

  }


  /* =========================================================
     GAME SELECT
  ========================================================= */

  function populateGames() {

    if (!gameSelect) return;

    gameSelect.innerHTML = `
      <option value="">
        Pilih Game
      </option>
    `;

    products.forEach(product => {

      const option =
        document.createElement("option");

      option.value =
        product.slug || product.id;

      option.textContent =
        product.name;

      gameSelect.appendChild(option);

    });

  }


  function updateHero(product) {

    if (!product) {

      if (gameName) {
        gameName.textContent = "Pilih Game";
      }

      if (gameDescription) {
        gameDescription.textContent =
          "Pilih game yang ingin kamu top up.";
      }

      return;

    }


    if (gameName) {

      gameName.textContent =
        product.name || "Game";

    }


    if (gameDescription) {

      gameDescription.textContent =
        product.description ||
        `Top Up ${product.name || "Game"}`;

    }


    const banner =
      product.banner ||
      product.image ||
      "";


    if (gameHeroBanner) {

      gameHeroBanner.style.backgroundImage =
        banner
          ? `url("${banner}")`
          : "";

    }


    if (gameImage) {

      gameImage.src =
        product.image || "";

      gameImage.alt =
        product.name || "Game";

      gameImage.style.display =
        product.image
          ? "block"
          : "none";

    }


    if (gameIconFallback) {

      gameIconFallback.textContent =
        product.icon || "🎮";

      gameIconFallback.style.display =
        product.image
          ? "none"
          : "flex";

    }

  }


  /* =========================================================
     DENOMINATIONS
  ========================================================= */

  function renderDenominations(product) {

    if (!denominationList) return;

    selectedDenomination = null;

    if (nominalInput) {
      nominalInput.value = "";
    }


    if (
      !product ||
      !Array.isArray(product.denominations) ||
      !product.denominations.length
    ) {

      denominationList.innerHTML = `
        <div class="checkout-loading">
          Nominal belum tersedia.
        </div>
      `;

      updateSummary();
      return;

    }


    const groups = {};


    product.denominations.forEach(item => {

      const category =
        item.category || "✨ Top Up";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);

    });


    denominationList.innerHTML = "";


    Object.entries(groups).forEach(
      ([category, items]) => {

        const group =
          document.createElement("div");

        group.className =
          "denomination-group";

        group.innerHTML = `
          <div class="denomination-category-title">
            ${escapeHTML(category)}
          </div>

          <div class="denomination-group-grid"></div>
        `;


        const grid =
          group.querySelector(
            ".denomination-group-grid"
          );


        items.forEach(item => {

          const button =
            document.createElement("button");

          button.type = "button";

          button.className =
            "denomination-option";


          button.dataset.id =
            item.id;


button.innerHTML = `
  <div class="denomination-main">

    <div class="denomination-title">
      ${escapeHTML(item.amount)}
    </div>

    <div class="denomination-price-box">
      <span>
        ${rupiah(item.price)}
      </span>
    </div>

  </div>

  <div class="denomination-divider"></div>

  <div class="denomination-delivery">

    <div class="denomination-delivery-text">

      <span
        class="delivery-icon"
        aria-hidden="true"
      >⚡</span>

      <div class="delivery-copy">

        <span>
          Pengiriman
        </span>

        <strong>
          CEPAT
        </strong>

      </div>

    </div>

  </div>
`;


          button.addEventListener(
            "click",
            () => {

              document
                .querySelectorAll(
                  ".denomination-option"
                )
                .forEach(option => {

                  option.classList.remove(
                    "selected"
                  );

                });


              button.classList.add(
                "selected"
              );


              selectedDenomination =
                item;


              if (nominalInput) {

                nominalInput.value =
                  item.id;

              }


              updateSummary();

            }
          );


          grid.appendChild(button);

        });


        denominationList.appendChild(group);

      }
    );


    updateSummary();

  }


  /* =========================================================
     QUANTITY
  ========================================================= */

  function updateQuantity(value) {

    const quantity =
      Math.max(
        1,
        Math.min(
          99,
          Number(value) || 1
        )
      );


    if (quantityInput) {

      quantityInput.value =
        quantity;

    }


    updateSummary();

  }


  quantityMinus?.addEventListener(
    "click",
    () => {

      updateQuantity(
        getQuantity() - 1
      );

    }
  );


  quantityPlus?.addEventListener(
    "click",
    () => {

      updateQuantity(
        getQuantity() + 1
      );

    }
  );


  quantityInput?.addEventListener(
    "change",
    () => {

      updateQuantity(
        quantityInput.value
      );

    }
  );


  /* =========================================================
     PAYMENT ACCORDION
  ========================================================= */

  document
    .querySelectorAll(
      ".payment-category-header"
    )
    .forEach(header => {

      header.addEventListener(
        "click",
        () => {

          const category =
            header.closest(
              ".payment-category"
            );

          if (!category) return;


          const isOpen =
            category.classList.contains(
              "open"
            );


          document
            .querySelectorAll(
              ".payment-category"
            )
            .forEach(item => {

              item.classList.remove(
                "open"
              );

            });


          if (!isOpen) {

            category.classList.add(
              "open"
            );

          }

        }
      );

    });


  /* =========================================================
     PAYMENT SELECTION
  ========================================================= */

  document
    .querySelectorAll(
      ".payment-option"
    )
    .forEach(option => {

      option.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".payment-option"
            )
            .forEach(item => {

              item.classList.remove(
                "selected"
              );

            });


          option.classList.add(
            "selected"
          );


          selectedPayment = {

            id:
              option.dataset.paymentId ||
              "",

            name:
              option.dataset.paymentName ||
              option.textContent.trim(),

            fee:
              Number(
                option.dataset.fee || 0
              ),

            feeType:
              option.dataset.feeType ||
              "fixed"

          };


          if (paymentInput) {

            paymentInput.value =
              selectedPayment.id;

          }


          updateSummary();

        }
      );

    });


  /* =========================================================
     SUMMARY
  ========================================================= */

  function updateSummary() {

    if (summaryName) {

      summaryName.textContent =
        selectedProduct?.name || "—";

    }


    if (summaryDenomination) {

      summaryDenomination.textContent =
        selectedDenomination?.amount || "—";

    }


    if (summaryQuantity) {

      summaryQuantity.textContent =
        getQuantity();

    }


    if (summaryPayment) {

      summaryPayment.textContent =
        selectedPayment?.name || "—";

    }


    if (summaryFee) {

      summaryFee.textContent =
        rupiah(getPaymentFee());

    }


    if (summaryPrice) {

      summaryPrice.textContent =
        rupiah(getTotal());

    }

  }


  /* =========================================================
     GAME CHANGE
  ========================================================= */

  gameSelect?.addEventListener(
    "change",
    () => {

      const product =
        getProduct(
          gameSelect.value
        );


      selectedProduct =
        product || null;

      selectedPayment = null;


      if (paymentInput) {
        paymentInput.value = "";
      }


      document
        .querySelectorAll(
          ".payment-option"
        )
        .forEach(option => {

          option.classList.remove(
            "selected"
          );

        });


      updateHero(product);

      renderDenominations(product);

      updateSummary();

    }
  );


  /* =========================================================
     PROMO
  ========================================================= */

  promoButton?.addEventListener(
    "click",
    () => {

      const code =
        promoInput?.value
          .trim()
          .toUpperCase();


      if (!code) {

        promoApplied = false;

        if (promoMessage) {

          promoMessage.textContent =
            "Masukkan kode promo terlebih dahulu.";

          promoMessage.className =
            "promo-message error";

        }

        return;

      }


      if (code === "LEO10") {

        promoApplied = true;

        if (promoMessage) {

          promoMessage.textContent =
            "Promo berhasil digunakan.";

          promoMessage.className =
            "promo-message success";

        }

      } else {

        promoApplied = false;

        if (promoMessage) {

          promoMessage.textContent =
            "Kode promo belum tersedia.";

          promoMessage.className =
            "promo-message error";

        }

      }

    }
  );


  /* =========================================================
     SUBMIT ORDER
  ========================================================= */

  checkoutForm?.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if (!selectedProduct) {

        alert("Silakan pilih game terlebih dahulu.");
        return;

      }


      if (!selectedDenomination) {

        alert("Silakan pilih nominal top up.");
        return;

      }


      if (!selectedPayment) {

        alert("Silakan pilih metode pembayaran.");
        return;

      }


      const playerId =
        playerIdInput?.value.trim() || "";


      if (!playerId) {

        alert("Player ID wajib diisi.");
        playerIdInput?.focus();
        return;

      }


      const email =
        contactEmail?.value.trim() || "";


      const whatsapp =
        contactWhatsapp?.value.trim() || "";


      const server =
        serverInput?.value.trim() || "";


      const quantity =
        getQuantity();


      const baseTotal =
        getBaseTotal();


      const paymentFee =
        getPaymentFee();


      const total =
        getTotal();


      const now =
        new Date();


      const orderId =
        "LEO-" +
        now.getTime().toString().slice(-8) +
        "-" +
        Math.random()
          .toString(36)
          .substring(2, 6)
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

        amount:
          selectedDenomination.amount,

        denominationId:
          selectedDenomination.id,

        quantity,

        payment:
          selectedPayment.id,

        paymentName:
          selectedPayment.name,

        price:
          total,

        basePrice:
          baseTotal,

        paymentFee,

        promoCode:
          promoApplied
            ? "LEO10"
            : "",

        contactEmail:
          email,

        countryCode:
          countryCode?.value ||
          "+62",

        contactWhatsapp:
          whatsapp,

        status:
          "Menunggu Pembayaran",

        createdAt:
          now.toISOString(),

        paidAt:
          null,

        processingAt:
          null,

        completedAt:
          null

      };


      let orders = [];


      try {

        orders =
          JSON.parse(
            localStorage.getItem(
              ORDERS_KEY
            )
          ) || [];

      } catch (error) {

        orders = [];

      }


      if (!Array.isArray(orders)) {
        orders = [];
      }


      orders.push(order);


      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
      );


      localStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify(order)
      );


      window.location.href =
        `payment.html?id=${encodeURIComponent(
          orderId
        )}`;

    }
  );


  /* =========================================================
     INITIALIZE
  ========================================================= */

  populateGames();


  const queryGame =
    getQueryGame();


  if (queryGame) {

    const product =
      getProduct(queryGame);


    if (product && gameSelect) {

      gameSelect.value =
        product.slug ||
        product.id;

      selectedProduct =
        product;

      updateHero(product);

      renderDenominations(product);

    }

  }


  updateQuantity(1);

});
