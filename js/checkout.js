document.addEventListener("DOMContentLoaded", () => {

  const checkoutForm =
    document.getElementById("checkoutForm");

  const gameSelect =
    document.getElementById("game");

  const playerIdInput =
    document.getElementById("playerId");

  const serverInput =
    document.getElementById("server");

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


  const products =
    typeof getProducts === "function"
      ? getProducts()
      : (window.PRODUCTS || []);


  let selectedProduct = null;
  let selectedDenomination = null;
  let selectedPayment = null;


  /*
   * ========================================
   * HELPERS
   * ========================================
   */

  function escapeHtml(value) {

    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

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


  /*
   * ========================================
   * GAME SELECT
   * ========================================
   */

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


  /*
   * ========================================
   * HERO
   * ========================================
   */

  function updateHero(product) {

    if (!product) return;


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

      gameIconFallback.style.display =
        product.image
          ? "none"
          : "flex";

    }

  }


  /*
   * ========================================
   * DENOMINATION
   * ========================================
   */

  function renderDenominations(product) {

    if (!denominationList) return;


    selectedDenomination = null;

    nominalInput.value = "";


    if (!product || !product.denominations?.length) {

      denominationList.innerHTML = `
        <div class="checkout-loading">
          Nominal belum tersedia.
        </div>
      `;

      return;

    }


    const groups = {};


    product.denominations.forEach(item => {

      const category =
        item.category ||
        "✨ Top Up";


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
            ${escapeHtml(category)}
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
                ${escapeHtml(item.amount)}
              </div>

              <div class="denomination-price-box">

                <img
                  src="assets/ui/diamond.webp"
                  alt=""
                  class="denomination-price-icon"
                >

                <span>
                  ${rupiah(item.price)}
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

                <span>
                  Pengiriman
                </span>

                <strong>
                  CEPAT
                </strong>

              </div>

            </div>

          `;


          button
            .querySelectorAll("img")
            .forEach(image => {

              image.addEventListener(
                "error",
                () => {
                  image.style.display = "none";
                }
              );

            });


          button.addEventListener(
            "click",
            () => {

              document
                .querySelectorAll(
                  ".denomination-option"
                )
                .forEach(
                  option =>
                    option.classList.remove(
                      "selected"
                    )
                );


              button.classList.add(
                "selected"
              );


              selectedDenomination =
                item;


              nominalInput.value =
                item.id;


              updateSummary();

            }
          );


          grid.appendChild(button);

        });


        denominationList.appendChild(group);

      }
    );

  }


  /*
   * ========================================
   * QUANTITY
   * ========================================
   */

  function getQuantity() {

    const value =
      Number(quantityInput?.value || 1);

    return Math.max(
      1,
      Math.min(99, value)
    );

  }


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


    if (summaryQuantity) {

      summaryQuantity.textContent =
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


  /*
   * ========================================
   * PAYMENT ACCORDION
   * ========================================
   */

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


  /*
   * ========================================
   * PAYMENT SELECTION
   * ========================================
   */

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


          const fee =
            Number(
              option.dataset.fee || 0
            );


          const feeType =
            option.dataset.feeType ||
            "fixed";


          selectedPayment = {

            id:
              option.dataset.paymentId,

            name:
              option.dataset.paymentName,

            fee,

            feeType

          };


          paymentInput.value =
            selectedPayment.id;


          updateSummary();

        }
      );

    });


  /*
   * ========================================
   * PAYMENT FEE
   * ========================================
   */

  function calculatePaymentTotal() {

    if (!selectedDenomination) {

      return {
        baseTotal: 0,
        fee: 0,
        total: 0
      };

    }


    const quantity =
      getQuantity();


    const baseTotal =
      Number(
        selectedDenomination.price || 0
      ) * quantity;


    if (!selectedPayment) {

      return {
        baseTotal,
        fee: 0,
        total: baseTotal
      };

    }


    let fee = 0;


    if (
      selectedPayment.feeType ===
      "percent"
    ) {

      fee =
        Math.round(
          baseTotal *
          selectedPayment.fee
        );

    } else {

      fee =
        Number(
          selectedPayment.fee || 0
        );

    }


    return {

      baseTotal,
      fee,
      total:
        baseTotal + fee

    };

  }


  /*
   * ========================================
   * SUMMARY
   * ========================================
   */

  function updateSummary() {

    if (!selectedDenomination) {

      if (summaryName) {
        summaryName.textContent =
          selectedProduct?.name || "—";
      }

      if (summaryDenomination) {
        summaryDenomination.textContent =
          "—";
      }

      if (summaryPrice) {
        summaryPrice.textContent =
          rupiah(0);
      }

      return;

    }


    const payment =
      calculatePaymentTotal();


    if (summaryName) {

      summaryName.textContent =
        selectedProduct?.name || "—";

    }


    if (summaryDenomination) {

      summaryDenomination.textContent =
        selectedDenomination.amount || "—";

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
        rupiah(payment.fee);

    }


    if (summaryPrice) {

      summaryPrice.textContent =
        rupiah(payment.total);

    }

  }


  /*
   * ========================================
   * GAME CHANGE
   * ========================================
   */

  gameSelect?.addEventListener(
    "change",
    () => {

      const product =
        getProduct(
          gameSelect.value
        );


      selectedProduct =
        product || null;


      updateHero(product);

      renderDenominations(product);

      updateSummary();

    }
  );


  /*
   * ========================================
   * PROMO
   * ========================================
   */

  const promoButton =
    document.getElementById(
      "promoButton"
    );

  const promoInput =
    document.getElementById(
      "promoCode"
    );

  const promoMessage =
    document.getElementById(
      "promoMessage"
    );


  promoButton?.addEventListener(
    "click",
    () => {

      const code =
        promoInput.value
          .trim()
          .toUpperCase();


      if (!code) {

        promoMessage.textContent =
          "Masukkan kode promo terlebih dahulu.";

        promoMessage.className =
          "promo-message error";

        return;

      }


      /*
       * Temporary frontend promo.
       * Nanti diganti API/backend.
       */

      if (code === "LEO10") {

        promoMessage.textContent =
          "Promo berhasil digunakan.";

        promoMessage.className =
          "promo-message success";

      } else {

        promoMessage.textContent =
          "Kode promo belum tersedia.";

        promoMessage.className =
          "promo-message error";

      }

    }
  );


  /*
   * ========================================
   * CONTACT
   * ========================================
   */

  const contactEmail =
    document.getElementById(
      "contactEmail"
    );

  const contactWhatsapp =
    document.getElementById(
      "contactWhatsapp"
    );


  /*
   * ========================================
   * FORM SUBMIT
   * ========================================
   */

  checkoutForm?.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      if (!selectedProduct) {

        alert(
          "Silakan pilih game terlebih dahulu."
        );

        return;

      }


      if (!playerIdInput.value.trim()) {

        alert(
          "Masukkan User ID / Username."
        );

        playerIdInput.focus();

        return;

      }


      if (!selectedDenomination) {

        alert(
          "Pilih nominal terlebih dahulu."
        );

        return;

      }


      if (!selectedPayment) {

        alert(
          "Pilih metode pembayaran terlebih dahulu."
        );

        return;

      }


      const payment =
        calculatePaymentTotal();


      const orderId =
        "LEO-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.floor(
          100 + Math.random() * 900
        );


      const order = {

        orderId,

        game:
          selectedProduct.slug ||
          selectedProduct.id,

        gameName:
          selectedProduct.name,

        playerId:
          playerIdInput.value.trim(),

        server:
          serverInput.value.trim(),

        denominationId:
          selectedDenomination.id,

        denomination:
          selectedDenomination.amount,

        amount:
          selectedDenomination.amount,

        quantity:
          getQuantity(),

        basePrice:
          payment.baseTotal,

        paymentFee:
          payment.fee,

        price:
          payment.total,

        payment:
          selectedPayment.id,

        paymentName:
          selectedPayment.name,

        contactEmail:
          contactEmail?.value.trim() || "",

        contactWhatsapp:
          contactWhatsapp?.value.trim() || "",

        promoCode:
          promoInput?.value.trim().toUpperCase() || "",

        status:
          "Menunggu Pembayaran",

        createdAt:
          new Date().toISOString()

      };


      /*
       * PRESERVE EXISTING STORAGE KEYS
       */

      localStorage.setItem(
        "fidelis_last_order",
        JSON.stringify(order)
      );


      const existingOrders =
        JSON.parse(
          localStorage.getItem(
            "fidelis_orders"
          ) || "[]"
        );


      existingOrders.unshift(order);


      localStorage.setItem(
        "fidelis_orders",
        JSON.stringify(
          existingOrders
        )
      );


      /*
       * PAYMENT PAGE
       */

      window.location.href =
        `payment.html?id=${encodeURIComponent(
          orderId
        )}`;

    }
  );


  /*
   * ========================================
   * INITIALIZE
   * ========================================
   */

  populateGames();


  const queryGame =
    getQueryGame();


  if (queryGame) {

    gameSelect.value =
      queryGame;

  }


  const initialGame =
    gameSelect.value
      ? getProduct(gameSelect.value)
      : products[0];


  if (initialGame) {

    selectedProduct =
      initialGame;


    gameSelect.value =
      initialGame.slug ||
      initialGame.id;


    updateHero(
      initialGame
    );


    renderDenominations(
      initialGame
    );

  }


  updateQuantity(1);

  updateSummary();

});
