/* =========================================
   LEO STORE
   CHECKOUT ENGINE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("checkoutForm");

  if (!form) return;


  /* =========================================
     ELEMENT
     ========================================= */

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


  /* =========================================
     URL PARAMETER
     ========================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );

  let gameSlug =
    params.get("game");


  /* =========================================
     LOAD GAME
     ========================================= */

  function loadGame() {

    if (!gameSlug) {
      return;
    }


    const product =
      getProduct(gameSlug);


    if (!product) {

      alert(
        "Game tidak ditemukan."
      );

      return;

    }


    /* pilih game */

    if (gameSelect) {

      gameSelect.value =
        gameSlug;

    }


    /* =====================================
       NOMINAL
       ===================================== */

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


    /* =====================================
       SERVER / ZONE
       ===================================== */

    updateServerField(
      product
    );

  }


  /* =========================================
     SERVER FIELD
     ========================================= */

  function updateServerField(
    product
  ) {

    if (!serverInput) {
      return;
    }


    const serverLabel =
      document.querySelector(
        'label[for="server"]'
      );


    if (product.requiresServer) {

      serverInput.required =
        true;


      serverInput.placeholder =
        "Masukkan Server / Zone";


      if (serverLabel) {

        serverLabel.textContent =
          "Server / Zone";

      }

    } else {

      serverInput.required =
        false;


      serverInput.placeholder =
        "Tidak diperlukan";


      if (serverLabel) {

        serverLabel.textContent =
          "Server / Zone (Opsional)";

      }

    }

  }


  /* =========================================
     GAME SELECT CHANGE
     ========================================= */

  if (gameSelect) {

    gameSelect.addEventListener(
      "change",
      () => {

        gameSlug =
          gameSelect.value;


        const product =
          getProduct(gameSlug);


        if (!product) {
          return;
        }


        updateServerField(
          product
        );


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


        const pricePreview =
          document.getElementById(
            "pricePreview"
          );


        if (pricePreview) {

          pricePreview.textContent =
            "";

        }

      }
    );

  }


  /* =========================================
     PRICE PREVIEW
     ========================================= */

  function updatePrice() {

    const selectedId =
      nominalSelect.value;


    const product =
      getProduct(gameSlug);


    if (!product || !selectedId) {

      const pricePreview =
        document.getElementById(
          "pricePreview"
        );


      if (pricePreview) {
        pricePreview.textContent =
          "";
      }


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


  if (nominalSelect) {

    nominalSelect.addEventListener(
      "change",
      updatePrice
    );

  }


  /* =========================================
     SUBMIT
     ========================================= */

  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      /* =====================================
         VALIDATE GAME
         ===================================== */

      const product =
        getProduct(gameSlug);


      if (!product) {

        alert(
          "Silakan pilih game."
        );

        return;

      }


      /* =====================================
         GET DATA
         ===================================== */

      const playerId =
        playerInput.value.trim();


      const server =
        serverInput.value.trim();


      const denominationId =
        nominalSelect.value;


      const payment =
        paymentSelect.value;


      /* =====================================
         VALIDATION
         ===================================== */

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


      /* =====================================
         GET DENOMINATION
         ===================================== */

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


      /* =====================================
         GENERATE ORDER ID
         ===================================== */

      const random =
        Math.floor(
          1000 +
          Math.random() * 9000
        );


      const orderId =
        `LEO-${Date.now()
          .toString()
          .slice(-6)}-${random}`;


      /* =====================================
         CREATE ORDER
         ===================================== */

      const order = {

        orderId,

        game:
          gameSlug,

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


      /* =====================================
         SAVE LAST ORDER
         ===================================== */

      localStorage.setItem(
        "fidelis_last_order",
        JSON.stringify(order)
      );


      /* =====================================
         SAVE ORDER HISTORY
         ===================================== */

      const existingOrders =
        JSON.parse(
          localStorage.getItem(
            "fidelis_orders"
          )
        ) || [];


      existingOrders.push(
        order
      );


      localStorage.setItem(
        "fidelis_orders",
        JSON.stringify(
          existingOrders
        )
      );


      /* =====================================
         GO TO PAYMENT
         ===================================== */

      window.location.href =
        `payment.html?id=${encodeURIComponent(
          orderId
        )}`;

    }
  );


  /* =========================================
     INITIALIZE
     ========================================= */

  loadGame();

});
