/* =========================================
   FIDELIS TOPUP
   CHECKOUT ENGINE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("checkoutForm");

  if (!form) return;


  /* =======================================
     ELEMENTS
     ======================================= */

  const gameSelect =
    document.getElementById("game");

  const playerInput =
    document.getElementById("playerId");

  const serverInput =
    document.getElementById("server");

  const nominalSelect =
    document.getElementById("nominal");

  const paymentSelect =
    document.getElementById("payment");


  /* =======================================
     GET GAME FROM URL
     ======================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );

  const gameSlug =
    params.get("game");


  /* =======================================
     LOAD GAME
     ======================================= */

  function loadGame() {

    if (!gameSlug) {
      return;
    }

    const product =
      getProduct(gameSlug);

    if (!product) {
      return;
    }


    /*
     * Select game.
     */

    if (gameSelect) {

      gameSelect.value =
        gameSlug;

    }


    /*
     * Update nominal.
     */

    if (nominalSelect) {

      nominalSelect.innerHTML =
        `<option value="">
          Pilih Nominal
        </option>`;

      product.denominations.forEach(
        item => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            item.id;

          option.textContent =
            `${item.amount} — ${formatPrice(item.price)}`;

          nominalSelect.appendChild(
            option
          );

        }
      );

    }


    /*
     * Server visibility.
     */

    if (serverInput) {

      const serverLabel =
        document.querySelector(
          'label[for="server"]'
        );

      if (product.requiresServer) {

        serverInput.required = true;

        serverInput.placeholder =
          "Masukkan Server / Zone";

        if (serverLabel) {
          serverLabel.textContent =
            "Server / Zone";
        }

      } else {

        serverInput.required = false;

        serverInput.placeholder =
          "Tidak diperlukan";

        if (serverLabel) {
          serverLabel.textContent =
            "Server / Zone (Opsional)";
        }

      }

    }

  }


  /* =======================================
     UPDATE PRICE PREVIEW
     ======================================= */

  function updatePrice() {

    const selectedId =
      nominalSelect.value;

    const product =
      getProduct(gameSlug);

    if (!product || !selectedId) {
      return;
    }

    const denomination =
      getDenomination(
        gameSlug,
        selectedId
      );

    if (!denomination) {
      return;
    }


    /*
     * Kalau nanti kita tambahkan
     * price preview element,
     * otomatis akan digunakan.
     */

    const priceElement =
      document.getElementById(
        "pricePreview"
      );

    if (priceElement) {

      priceElement.textContent =
        formatPrice(
          denomination.price
        );

    }

  }


  /* =======================================
     SUBMIT ORDER
     ======================================= */

  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const product =
        getProduct(gameSlug);

      if (!product) {

        alert(
          "Produk tidak ditemukan."
        );

        return;
      }


      const playerId =
        playerInput.value.trim();

      const server =
        serverInput.value.trim();

      const denominationId =
        nominalSelect.value;

      const payment =
        paymentSelect.value;


      /* ===================================
         VALIDATION
         =================================== */

      if (!playerId) {

        alert(
          "Masukkan User ID / Username."
        );

        playerInput.focus();

        return;
      }


      if (
        product.requiresServer &&
        !server
      ) {

        alert(
          "Masukkan Server / Zone."
        );

        serverInput.focus();

        return;
      }


      if (!denominationId) {

        alert(
          "Pilih nominal top up."
        );

        nominalSelect.focus();

        return;
      }


      if (!payment) {

        alert(
          "Pilih metode pembayaran."
        );

        paymentSelect.focus();

        return;
      }


      const denomination =
        getDenomination(
          gameSlug,
          denominationId
        );

      if (!denomination) {

        alert(
          "Nominal tidak valid."
        );

        return;
      }


      /* ===================================
         GENERATE ORDER ID
         =================================== */

      const random =
        Math.floor(
          1000 +
          Math.random() * 9000
        );

      const orderId =
        `FDL-${Date.now()
          .toString()
          .slice(-6)}-${random}`;


      /* ===================================
         CREATE ORDER
         =================================== */

      const order = {

        orderId,

        game: gameSlug,

        gameName:
          product.name,

        playerId,

        server,

        denominationId,

        amount:
          denomination.amount,

        price:
          denomination.price,

        payment,

        status:
          "Menunggu Pembayaran",

        createdAt:
          new Date().toISOString()

      };


      /* ===================================
         SAVE ORDER
         =================================== */

      localStorage.setItem(
        "fidelis_last_order",
        JSON.stringify(order)
      );


      /*
       * Simpan juga ke daftar order.
       */

      const existingOrders =
        JSON.parse(
          localStorage.getItem(
            "fidelis_orders"
          )
        ) || [];

      existingOrders.push(order);

      localStorage.setItem(
        "fidelis_orders",
        JSON.stringify(
          existingOrders
        )
      );


      /* ===================================
         REDIRECT
         =================================== */

      window.location.href =
        `order.html?id=${encodeURIComponent(orderId)}`;

    }
  );


  if (nominalSelect) {

    nominalSelect.addEventListener(
      "change",
      updatePrice
    );

  }


  loadGame();

});
