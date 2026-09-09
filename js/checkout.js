/* =========================================================
   LEO STORE — CHECKOUT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const checkoutForm =
    document.getElementById("checkoutForm");

  const gameSelect =
    document.getElementById("game");

  const playerIdInput =
    document.getElementById("playerId");

  const serverInput =
    document.getElementById("server");

  const nominalInput =
    document.getElementById("nominal");

  const denominationList =
    document.getElementById("denominationList");

  const pricePreview =
    document.getElementById("pricePreview");

  const paymentSelect =
    document.getElementById("payment");

  const checkoutButton =
    document.getElementById("checkoutButton");

  const summaryName =
    document.getElementById("summaryName");

  const summaryDenomination =
    document.getElementById("summaryDenomination");

  const summaryPrice =
    document.getElementById("summaryPrice");

  const gameHeroBanner =
    document.getElementById("gameHeroBanner");

  const gameImage =
    document.getElementById("gameImage");

  const gameIconFallback =
    document.getElementById("gameIconFallback");

  const gameName =
    document.getElementById("gameName");

  const gameDescription =
    document.getElementById("gameDescription");


  let selectedProduct = null;
  let selectedDenomination = null;


  /* =======================================================
     HELPERS
     ======================================================= */

  function escapeHTML(value) {

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

    return new Intl.NumberFormat("id-ID", {

      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0

    }).format(value);

  }


  function getAllProducts() {

    if (typeof getProducts === "function") {

      return getProducts();

    }

    if (typeof PRODUCTS !== "undefined") {

      return PRODUCTS;

    }

    return [];

  }


  function findProduct(gameId) {

    const products = getAllProducts();

    return products.find(product =>
      product.id === gameId ||
      product.slug === gameId
    ) || null;

  }


  function getGameFromURL() {

    const params =
      new URLSearchParams(window.location.search);

    return params.get("game");

  }


  /* =======================================================
     RESET
     ======================================================= */

  function resetSelection() {

    selectedDenomination = null;


    if (nominalInput) {
      nominalInput.value = "";
    }


    if (pricePreview) {
      pricePreview.innerHTML = "";
    }


    if (summaryDenomination) {
      summaryDenomination.textContent = "-";
    }


    if (summaryPrice) {
      summaryPrice.textContent = "Rp 0";
    }

  }


  /* =======================================================
     GAME HERO
     ======================================================= */

  function updateGameHero(product) {

    if (!product) {

      if (gameName) {
        gameName.textContent = "Pilih Game";
      }

      if (gameDescription) {
        gameDescription.textContent =
          "Pilih game untuk melihat produk.";
      }

      if (gameHeroBanner) {
        gameHeroBanner.style.backgroundImage = "none";
      }

      if (gameImage) {
        gameImage.style.display = "none";
      }

      if (gameIconFallback) {
        gameIconFallback.style.display = "flex";
        gameIconFallback.textContent = "🎮";
      }

      return;
    }


    /* GAME NAME */

    if (gameName) {

      gameName.textContent =
        product.name || "Game";

    }


    /* DESCRIPTION */

    if (gameDescription) {

      gameDescription.textContent =
        product.description ||
        `Top up ${product.name || "game"} di Leo Store.`;

    }


    /* =====================================================
       LOGO
       ===================================================== */

    if (product.image && gameImage) {

      gameImage.src = product.image;
      gameImage.alt =
        product.name || "Game";

      gameImage.style.display = "block";


      if (gameIconFallback) {
        gameIconFallback.style.display = "none";
      }

    } else {

      if (gameImage) {
        gameImage.style.display = "none";
      }

      if (gameIconFallback) {

        gameIconFallback.style.display = "flex";

        gameIconFallback.textContent =
          product.icon || "🎮";

      }

    }


    /* =====================================================
       BANNER
       ===================================================== */

    if (gameHeroBanner) {

      const banner =
        product.banner ||
        product.image ||
        "";

      if (banner) {

        gameHeroBanner.style.backgroundImage =
          `url("${banner}")`;

      } else {

        gameHeroBanner.style.backgroundImage =
          "none";

      }

    }

  }


  /* =======================================================
     EMPTY STATE
     ======================================================= */

  function showEmptyState(title, description) {

    if (!denominationList) return;

    denominationList.innerHTML = `

      <div class="checkout-empty">

        <div class="checkout-empty-icon">
          🎮
        </div>

        <h3>
          ${escapeHTML(title)}
        </h3>

        <p>
          ${escapeHTML(description)}
        </p>

      </div>

    `;

  }


  /* =======================================================
     RENDER DENOMINATIONS
     ======================================================= */

  function renderDenominations(product) {

    if (!denominationList) return;

    resetSelection();


    if (!product) {

      showEmptyState(
        "Pilih game terlebih dahulu",
        "Daftar nominal akan muncul di sini."
      );

      return;

    }


    const denominations =
      Array.isArray(product.denominations)
        ? product.denominations
        : [];


    if (!denominations.length) {

      showEmptyState(
        "Nominal belum tersedia",
        "Belum ada nominal untuk game ini."
      );

      return;

    }


    /* =====================================================
       GROUP BY CATEGORY
       ===================================================== */

    const grouped = {};


    denominations.forEach(item => {

      const category =
        item.category ||
        "Pilihan Nominal";


      if (!grouped[category]) {
        grouped[category] = [];
      }


      grouped[category].push(item);

    });


    /* =====================================================
       BUILD
       ===================================================== */

    let html = "";


    Object.entries(grouped)
      .forEach(([category, items]) => {

        html += `

          <section class="denomination-section">

            <div class="denomination-section-header">

              <div>

                <h3>
                  ${escapeHTML(category)}
                </h3>

                <span>
                  Select a variant
                </span>

              </div>

            </div>


            <div class="denomination-list">

              ${items.map(item => {

                const itemId =
                  item.id || "";

                const amount =
                  item.amount || "";

                const price =
                  Number(item.price || 0);


                return `

                  <button
                    type="button"
                    class="denomination-option"
                    data-denomination-id="${escapeHTML(itemId)}"
                  >

                    <div class="denomination-main">

                      <strong>
                        ${escapeHTML(amount)}
                      </strong>

                      <span>
                        ${escapeHTML(product.name)}
                        -
                        ${escapeHTML(amount)}
                      </span>

                    </div>


                    <div class="denomination-price">

                      ${escapeHTML(rupiah(price))}

                    </div>

                  </button>

                `;

              }).join("")}

            </div>

          </section>

        `;

      });


    denominationList.innerHTML = html;


    /* =====================================================
       CLICK NOMINAL
       ===================================================== */

    const options =
      denominationList.querySelectorAll(
        ".denomination-option"
      );


    options.forEach(option => {

      option.addEventListener("click", () => {

        const denominationId =
          option.dataset.denominationId;


        const denomination =
          denominations.find(item =>
            String(item.id) ===
            String(denominationId)
          );


        if (!denomination) return;


        options.forEach(item => {

          item.classList.remove("selected");

        });


        option.classList.add("selected");


        selectedDenomination =
          denomination;


        /* Hidden input */

        if (nominalInput) {

          nominalInput.value =
            denomination.id;

        }


        /* Price */

        if (pricePreview) {

          pricePreview.innerHTML = `

            <span>
              Total pembayaran
            </span>

            <strong>
              ${escapeHTML(
                rupiah(denomination.price)
              )}
            </strong>

          `;

        }


        /* Summary */

        if (summaryName) {

          summaryName.textContent =
            product.name;

        }


        if (summaryDenomination) {

          summaryDenomination.textContent =
            denomination.amount;

        }


        if (summaryPrice) {

          summaryPrice.textContent =
            rupiah(denomination.price);

        }

      });

    });

  }


  /* =======================================================
     LOAD GAME
     ======================================================= */

  function loadGame(gameId) {

    selectedProduct =
      findProduct(gameId);


    if (!selectedProduct) {

      updateGameHero(null);

      renderDenominations(null);


      if (summaryName) {
        summaryName.textContent = "-";
      }


      return;

    }


    gameSelect.value =
      selectedProduct.slug ||
      selectedProduct.id;


    updateGameHero(selectedProduct);


    if (summaryName) {

      summaryName.textContent =
        selectedProduct.name;

    }


    renderDenominations(
      selectedProduct
    );

  }


  /* =======================================================
     GAME CHANGE
     ======================================================= */

  if (gameSelect) {

    gameSelect.addEventListener(
      "change",
      () => {

        loadGame(
          gameSelect.value
        );

      }
    );

  }


  /* =======================================================
     FORM SUBMIT
     ======================================================= */

  if (checkoutForm) {

    checkoutForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        /* GAME */

        const gameId =
          gameSelect?.value?.trim() || "";


        if (!gameId) {

          alert(
            "Silakan pilih game terlebih dahulu."
          );

          gameSelect?.focus();

          return;

        }


        selectedProduct =
          findProduct(gameId);


        if (!selectedProduct) {

          alert(
            "Produk game tidak ditemukan."
          );

          return;

        }


        /* NOMINAL */

        if (!selectedDenomination) {

          alert(
            "Silakan pilih nominal terlebih dahulu."
          );


          denominationList?.scrollIntoView({

            behavior: "smooth",
            block: "center"

          });


          return;

        }


        /* PLAYER ID */

        const playerId =
          playerIdInput?.value?.trim() || "";


        if (!playerId) {

          alert(
            "Silakan masukkan User ID / Username."
          );

          playerIdInput?.focus();

          return;

        }


        /* SERVER */

        const server =
          serverInput?.value?.trim() || "";


        /* PAYMENT */

        const payment =
          paymentSelect?.value?.trim() || "";


        if (!payment) {

          alert(
            "Silakan pilih metode pembayaran."
          );

          paymentSelect?.focus();

          return;

        }


        /* ORDER ID */

        const timestamp =
          Date.now()
            .toString()
            .slice(-8);


        const random =
          Math.floor(
            100 +
            Math.random() * 900
          );


        const orderId =
          `LS-${timestamp}-${random}`;


        /* ORDER */

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
            Number(
              selectedDenomination.price || 0
            ),

          payment,

          status:
            "Menunggu Pembayaran",

          createdAt:
            new Date().toISOString()

        };


        /* SAVE LAST ORDER */

        localStorage.setItem(
          "fidelis_last_order",
          JSON.stringify(order)
        );


        /* ORDER HISTORY */

        let orders = [];


        try {

          orders =
            JSON.parse(
              localStorage.getItem(
                "fidelis_orders"
              )
            ) || [];


          if (!Array.isArray(orders)) {

            orders = [];

          }

        } catch (error) {

          orders = [];

        }


        orders.push(order);


        localStorage.setItem(
          "fidelis_orders",
          JSON.stringify(orders)
        );


        /* BUTTON */

        if (checkoutButton) {

          checkoutButton.disabled =
            true;

          checkoutButton.textContent =
            "Membuat Pesanan...";

        }


        /* REDIRECT */

        setTimeout(() => {

          window.location.href =
            `payment.html?id=${
              encodeURIComponent(orderId)
            }`;

        }, 300);

      }
    );

  }


  /* =======================================================
     INITIAL
     ======================================================= */

  const initialGame =
    getGameFromURL();


  if (initialGame) {

    loadGame(initialGame);

  } else {

    updateGameHero(null);

    renderDenominations(null);

  }

});
