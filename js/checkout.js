/* =========================================================
   LEOOSTORE — CLEAN CHECKOUT ENGINE
   ========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", function () {


  /* =======================================================
     ELEMENTS
  ======================================================= */

  const gameSelect =
    document.getElementById("game");

  const playerIdInput =
    document.getElementById("playerId");

  const serverInput =
    document.getElementById("server");

  const serverField =
    document.getElementById("serverField");

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

  const gameName =
    document.getElementById("gameName");

  const gameDescription =
    document.getElementById("gameDescription");

  const gameImage =
    document.getElementById("gameImage");

  const summaryImage =
    document.getElementById("summaryImage");

  const gameHeroBanner =
    document.getElementById("gameHeroBanner");

  const gameIconFallback =
    document.getElementById("gameIconFallback");

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

  const checkoutButton =
    document.getElementById("checkoutButton");

  const robloxLoginNotice =
    document.getElementById("robloxLoginNotice");


  /* =======================================================
     PRODUCTS
  ======================================================= */

  const products =
    Array.isArray(window.PRODUCTS)
      ? window.PRODUCTS
      : [];


  let selectedProduct = null;
  let selectedDenomination = null;
  let selectedPayment = null;

  let promoApplied = false;


  /* =======================================================
     STORAGE
  ======================================================= */

  const ORDERS_KEY =
    "LEOOSTORE_orders";

  const LAST_ORDER_KEY =
    "LEOOSTORE_last_order";


  /* =======================================================
     HELPERS
  ======================================================= */

  function rupiah(value) {

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }
    ).format(
      Number(value || 0)
    );

  }


  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  function getProduct(id) {

    return products.find(function (product) {

      return (
        String(product.id) === String(id) ||
        String(product.slug) === String(id)
      );

    }) || null;

  }


  function getQueryGame() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    return params.get("game");

  }


  function getQuantity() {

    let value =
      Number(
        quantityInput?.value || 1
      );

    if (!Number.isFinite(value)) {
      value = 1;
    }

    value =
      Math.max(
        1,
        Math.min(99, Math.floor(value))
      );

    if (quantityInput) {
      quantityInput.value = value;
    }

    return value;

  }


  /* =======================================================
     GAME LIST
  ======================================================= */

  function populateGames() {

    if (!gameSelect) {
      return;
    }


    gameSelect.innerHTML = "";


    const placeholder =
      document.createElement("option");

    placeholder.value = "";

    placeholder.textContent =
      "Pilih Game";


    gameSelect.appendChild(
      placeholder
    );


    products.forEach(function (product) {

      const option =
        document.createElement("option");

      option.value =
        product.slug || product.id;

      option.textContent =
        product.name || product.id;

      gameSelect.appendChild(
        option
      );

    });

  }


  /* =======================================================
     HERO
  ======================================================= */

  function updateHero(product) {

    if (!product) {

      if (gameName) {
        gameName.textContent =
          "Pilih Game";
      }

      if (gameDescription) {
        gameDescription.textContent =
          "Pilih publisher";
      }

      if (gameImage) {
        gameImage.removeAttribute("src");
        gameImage.style.display =
          "none";
      }

      if (summaryImage) {
        summaryImage.removeAttribute("src");
      }

      if (gameHeroBanner) {
        gameHeroBanner.style.backgroundImage =
          "";
      }

      if (gameIconFallback) {
        gameIconFallback.textContent =
          "🎮";

        gameIconFallback.style.display =
          "flex";
      }

      return;
    }


    if (gameName) {

      gameName.textContent =
        product.name || "Game";

    }


    if (gameDescription) {

      gameDescription.textContent =
        product.publisher ||
        "Publisher";

    }


    const image =
      product.image || "";


    if (gameImage) {

      if (image) {

        gameImage.src = image;

        gameImage.alt =
          product.name || "Game";

        gameImage.style.display =
          "block";

      } else {

        gameImage.removeAttribute("src");

        gameImage.style.display =
          "none";

      }

    }


    if (summaryImage) {

      if (image) {

        summaryImage.src =
          image;

        summaryImage.alt =
          product.name || "Game";

      } else {

        summaryImage.removeAttribute(
          "src"
        );

      }

    }


    if (gameHeroBanner) {

      gameHeroBanner.style.backgroundImage =
        image
          ? `url("${image}")`
          : "";

    }


    if (gameIconFallback) {

      gameIconFallback.textContent =
        product.icon || "🎮";

      gameIconFallback.style.display =
        image
          ? "none"
          : "flex";

    }

  }


  /* =======================================================
     ACCOUNT FIELDS
  ======================================================= */

  function updateAccountFields(product) {

    if (!product) {

      if (serverField) {
        serverField.style.display =
          "";
      }

      if (robloxLoginNotice) {
        robloxLoginNotice.style.display =
          "none";
      }

      return;
    }


    const id =
      String(product.id || "");


    /*
      Mobile Legends / PUBG / Free Fire
      tetap memakai server.

      Roblox:
      - Via Username tidak perlu server.
      - Via Login juga tidak perlu server.
    */

    const isRoblox =
      id === "roblox-via-login" ||
      id === "roblox-via-username";


    if (serverField) {

      serverField.style.display =
        isRoblox
          ? "none"
          : "";

    }


    if (serverInput) {

      if (isRoblox) {
        serverInput.value = "";
      }

    }


    if (robloxLoginNotice) {

      robloxLoginNotice.style.display =
        id === "roblox-via-login"
          ? "block"
          : "none";

    }


    if (playerIdInput) {

      if (id === "roblox-via-username") {

        playerIdInput.placeholder =
          "Masukkan Username Roblox";

      } else if (
        id === "roblox-via-login"
      ) {

        playerIdInput.placeholder =
          "Masukkan Username Roblox";

      } else {

        playerIdInput.placeholder =
          "Masukkan Player ID";

      }

    }

  }


  /* =======================================================
     DENOMINATIONS
  ======================================================= */

  function renderDenominations(product) {

    if (!denominationList) {
      return;
    }


    selectedDenomination =
      null;


    if (nominalInput) {
      nominalInput.value = "";
    }


    if (
      !product ||
      !Array.isArray(
        product.denominations
      ) ||
      product.denominations.length === 0
    ) {

      denominationList.innerHTML = `
        <div class="checkout-loading">
          Pilih game terlebih dahulu.
        </div>
      `;

      updateSummary();

      return;

    }


    const groups = {};


    product.denominations.forEach(
      function (item) {

        const category =
          item.category ||
          "Top Up";


        if (!groups[category]) {
          groups[category] = [];
        }


        groups[category].push(
          item
        );

      }
    );


    denominationList.innerHTML =
      "";


    Object.entries(groups).forEach(
      function ([category, items]) {


        const group =
          document.createElement(
            "div"
          );


        group.className =
          "denomination-group";


        const title =
          document.createElement(
            "div"
          );


        title.className =
          "denomination-category-title";


        title.textContent =
          category;


        group.appendChild(title);


        const grid =
          document.createElement(
            "div"
          );


        grid.className =
          "denomination-group-grid";


        group.appendChild(grid);


        items.forEach(
          function (item) {


            const option =
              document.createElement(
                "div"
              );


            option.className =
              "denomination-option";


            option.dataset.id =
              item.id;


            option.setAttribute(
              "role",
              "button"
            );


            option.setAttribute(
              "tabindex",
              "0"
            );


            option.innerHTML = `

              <div class="denomination-main">

                <div class="denomination-title">
                  ${escapeHTML(
                    item.amount
                  )}
                </div>

                <div class="denomination-price-box">

                  <span>
                    ${rupiah(
                      item.price
                    )}
                  </span>

                </div>

              </div>

              <div class="denomination-divider"></div>

              <div class="denomination-delivery">

                <div class="denomination-delivery-text">

                  <span
                    class="delivery-icon"
                    aria-hidden="true"
                  >
                    ⚡
                  </span>

                  <span>
                    Proses Cepat
                  </span>

                </div>

              </div>

            `;


            function selectThis() {

              selectDenomination(
                item,
                option
              );

            }


            option.addEventListener(
              "click",
              selectThis
            );


            option.addEventListener(
              "keydown",
              function (event) {

                if (
                  event.key ===
                    "Enter" ||
                  event.key ===
                    " "
                ) {

                  event.preventDefault();

                  selectThis();

                }

              }
            );


            grid.appendChild(
              option
            );

          }
        );


        denominationList.appendChild(
          group
        );

      }
    );

  }


  function selectDenomination(
    denomination,
    element
  ) {

    selectedDenomination =
      denomination;


    document
      .querySelectorAll(
        ".denomination-option"
      )
      .forEach(
        function (item) {

          item.classList.remove(
            "selected"
          );

        }
      );


    if (element) {

      element.classList.add(
        "selected"
      );

    }


    if (nominalInput) {

      nominalInput.value =
        denomination.id;

    }


    updateSummary();

  }


  /* =======================================================
     PAYMENT
  ======================================================= */

  function selectPayment(
    element
  ) {

    document
      .querySelectorAll(
        ".payment-option"
      )
      .forEach(
        function (item) {

          item.classList.remove(
            "selected"
          );

        }
      );


    element.classList.add(
      "selected"
    );


    selectedPayment = {

      id:
        element.dataset.paymentId,

      name:
        element.dataset.paymentName,

      fee:
        Number(
          element.dataset.fee || 0
        ),

      feeType:
        element.dataset.feeType ||
        "fixed"

    };


    if (paymentInput) {

      paymentInput.value =
        selectedPayment.id;

    }


    updateSummary();

  }


  function setupPayments() {

    document
      .querySelectorAll(
        ".payment-option"
      )
      .forEach(
        function (option) {

          option.addEventListener(
            "click",
            function () {

              selectPayment(
                option
              );

            }
          );

        }
      );

  }


  /* =======================================================
     PAYMENT CATEGORIES
  ======================================================= */

  function setupPaymentCategories() {

    document
      .querySelectorAll(
        ".payment-category-header"
      )
      .forEach(
        function (header) {

          header.addEventListener(
            "click",
            function () {

              const category =
                header.closest(
                  ".payment-category"
                );


              if (!category) {
                return;
              }


              category.classList.toggle(
                "open"
              );

            }
          );

        }
      );

  }


  /* =======================================================
     TOTAL
  ======================================================= */

  function getBaseTotal() {

    if (!selectedDenomination) {
      return 0;
    }


    return (
      Number(
        selectedDenomination.price ||
        0
      ) *
      getQuantity()
    );

  }


  function getPaymentFee() {

    if (
      !selectedDenomination ||
      !selectedPayment
    ) {

      return 0;

    }


    const base =
      getBaseTotal();


    const fee =
      Number(
        selectedPayment.fee || 0
      );


    if (
      selectedPayment.feeType ===
      "percent"
    ) {

      return Math.round(
        base * fee / 100
      );

    }


    return fee;

  }


  function getTotal() {

    let total =
      getBaseTotal() +
      getPaymentFee();


    if (promoApplied) {

      total =
        Math.max(
          0,
          total - 1000
        );

    }


    return total;

  }


  /* =======================================================
     SUMMARY
  ======================================================= */

  function updateSummary() {

    const quantity =
      getQuantity();


    if (summaryQuantity) {

      summaryQuantity.textContent =
        quantity;

    }


    if (!selectedProduct) {

      if (summaryName) {
        summaryName.textContent =
          "Pilih Game";
      }

      if (summaryDenomination) {
        summaryDenomination.textContent =
          "Belum memilih nominal";
      }

      if (summaryPayment) {
        summaryPayment.textContent =
          "Belum dipilih";
      }

      if (summaryFee) {
        summaryFee.textContent =
          "Rp0";
      }

      if (summaryPrice) {
        summaryPrice.textContent =
          "Rp0";
      }

      return;

    }


    if (summaryName) {

      summaryName.textContent =
        selectedProduct.name ||
        "Game";

    }


    if (summaryDenomination) {

      summaryDenomination.textContent =
        selectedDenomination
          ? selectedDenomination.amount
          : "Belum memilih nominal";

    }


    if (summaryPayment) {

      summaryPayment.textContent =
        selectedPayment
          ? selectedPayment.name
          : "Belum dipilih";

    }


    if (summaryFee) {

      summaryFee.textContent =
        rupiah(
          getPaymentFee()
        );

    }


    if (summaryPrice) {

      summaryPrice.textContent =
        rupiah(
          getTotal()
        );

    }

  }


  /* =======================================================
     GAME CHANGE
  ======================================================= */

  function selectGame(gameId) {

    const product =
      getProduct(gameId);


    selectedProduct =
      product;


    selectedDenomination =
      null;


    if (paymentInput) {
      paymentInput.value = "";
    }


    selectedPayment =
      null;


    document
      .querySelectorAll(
        ".payment-option"
      )
      .forEach(
        function (option) {

          option.classList.remove(
            "selected"
          );

        }
      );


    updateHero(product);

    updateAccountFields(product);

    renderDenominations(product);

    updateSummary();

  }


  if (gameSelect) {

    gameSelect.addEventListener(
      "change",
      function () {

        selectGame(
          gameSelect.value
        );

      }
    );

  }


  /* =======================================================
     QUANTITY
  ======================================================= */

  if (quantityMinus) {

    quantityMinus.addEventListener(
      "click",
      function () {

        const current =
          getQuantity();

        if (quantityInput) {

          quantityInput.value =
            Math.max(
              1,
              current - 1
            );

        }

        updateSummary();

      }
    );

  }


  if (quantityPlus) {

    quantityPlus.addEventListener(
      "click",
      function () {

        const current =
          getQuantity();

        if (quantityInput) {

          quantityInput.value =
            Math.min(
              99,
              current + 1
            );

        }

        updateSummary();

      }
    );

  }


  if (quantityInput) {

    quantityInput.addEventListener(
      "input",
      function () {

        getQuantity();

        updateSummary();

      }
    );

  }


  /* =======================================================
     PROMO
  ======================================================= */

  if (promoButton) {

    promoButton.addEventListener(
      "click",
      function () {

        const code =
          String(
            promoInput?.value || ""
          )
            .trim()
            .toUpperCase();


        if (!code) {

          if (promoMessage) {

            promoMessage.textContent =
              "Masukkan kode promo.";

          }

          return;

        }


        if (code === "LEO1000") {

          promoApplied = true;


      
