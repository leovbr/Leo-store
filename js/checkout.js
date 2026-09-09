/* =========================================================
   LEO STORE — CHECKOUT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("game");

  const product = getProduct(gameId);

  const gameNameEl = document.getElementById("gameName");
  const playerIdInput = document.getElementById("playerId");
  const serverInput = document.getElementById("server");
  const paymentSelect = document.getElementById("paymentMethod");
  const denominationContainer =
    document.getElementById("denominationList");

  const submitButton =
    document.getElementById("checkoutButton");

  if (!product) {
    if (denominationContainer) {
      denominationContainer.innerHTML = `
        <div class="checkout-error">
          Game tidak ditemukan.
        </div>
      `;
    }

    return;
  }

  if (gameNameEl) {
    gameNameEl.textContent = product.name;
  }

  let selectedDenomination = null;

  /* =======================================================
     ESCAPE
     ======================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =======================================================
     GROUP DENOMINATIONS
     ======================================================= */

  function groupDenominations(items) {
    return items.reduce((groups, item) => {
      const category =
        item.category || "✨ Pilih Nominal";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);

      return groups;
    }, {});
  }

  /* =======================================================
     RENDER NOMINAL
     ======================================================= */

  function renderDenominations() {
    if (!denominationContainer) return;

    const groups = groupDenominations(
      product.denominations || []
    );

    const categories = Object.keys(groups);

    if (categories.length === 0) {
      denominationContainer.innerHTML = `
        <div class="checkout-error">
          Belum ada nominal tersedia.
        </div>
      `;

      return;
    }

    denominationContainer.innerHTML = categories.map(category => {
      const items = groups[category];

      return `
        <section class="denomination-section">

          <div class="denomination-section-header">
            <h3>${escapeHTML(category)}</h3>
            <span>Select a variant</span>
          </div>

          <div class="denomination-list">

            ${items.map(item => `
              <button
                type="button"
                class="denomination-option"
                data-denomination-id="${escapeHTML(item.id)}"
              >

                <div class="denomination-main">

                  <strong>
                    ${escapeHTML(item.amount)}
                  </strong>

                  <span>
                    ${escapeHTML(product.name)}
                    - ${escapeHTML(item.amount)}
                  </span>

                </div>

                <div class="denomination-price">
                  ${formatRupiah(item.price)}
                </div>

              </button>
            `).join("")}

          </div>
        </section>
      `;
    }).join("");

    document
      .querySelectorAll(".denomination-option")
      .forEach(button => {

        button.addEventListener("click", () => {

          const denominationId =
            button.dataset.denominationId;

          selectedDenomination =
            getDenomination(
              product.id,
              denominationId
            );

          document
            .querySelectorAll(".denomination-option")
            .forEach(item => {
              item.classList.remove("selected");
            });

          button.classList.add("selected");

          updateSummary();
        });
      });
  }

  /* =======================================================
     SUMMARY
     ======================================================= */

  function updateSummary() {
    const summaryName =
      document.getElementById("summaryName");

    const summaryPrice =
      document.getElementById("summaryPrice");

    const summaryBox =
      document.getElementById("checkoutSummary");

    if (!selectedDenomination) {
      if (summaryBox) {
        summaryBox.classList.remove("visible");
      }

      return;
    }

    if (summaryName) {
      summaryName.textContent =
        selectedDenomination.amount;
    }

    if (summaryPrice) {
      summaryPrice.textContent =
        formatRupiah(selectedDenomination.price);
    }

    if (summaryBox) {
      summaryBox.classList.add("visible");
    }
  }

  /* =======================================================
     VALIDATION
     ======================================================= */

  function validateForm() {
    if (!selectedDenomination) {
      alert("Pilih nominal terlebih dahulu.");
      return false;
    }

    if (!playerIdInput || !playerIdInput.value.trim()) {
      alert("Masukkan Player ID.");
      playerIdInput?.focus();
      return false;
    }

    if (
      serverInput &&
      serverInput.required &&
      !serverInput.value.trim()
    ) {
      alert("Masukkan Server ID.");
      serverInput.focus();
      return false;
    }

    if (
      paymentSelect &&
      paymentSelect.required &&
      !paymentSelect.value
    ) {
      alert("Pilih metode pembayaran.");
      paymentSelect.focus();
      return false;
    }

    return true;
  }

  /* =======================================================
     CREATE ORDER
     ======================================================= */

  function createOrder() {
    const orderId =
      "LEO-" +
      Date.now().toString(36).toUpperCase();

    const order = {
      orderId,

      game: product.slug,
      gameName: product.name,

      playerId:
        playerIdInput?.value.trim() || "",

      server:
        serverInput?.value.trim() || "",

      denominationId:
        selectedDenomination.id,

      denomination:
        selectedDenomination.amount,

      amount:
        selectedDenomination.amount,

      price:
        selectedDenomination.price,

      payment:
        paymentSelect?.value || "",

      status: "Menunggu Pembayaran",

      createdAt:
        new Date().toISOString()
    };

    const existingOrders =
      JSON.parse(
        localStorage.getItem("fidelis_orders") || "[]"
      );

    existingOrders.unshift(order);

    localStorage.setItem(
      "fidelis_orders",
      JSON.stringify(existingOrders)
    );

    localStorage.setItem(
      "fidelis_last_order",
      JSON.stringify(order)
    );

    return order;
  }

  /* =======================================================
     SUBMIT
     ======================================================= */

  if (submitButton) {
    submitButton.addEventListener("click", event => {
      event.preventDefault();

      if (!validateForm()) return;

      const order = createOrder();

      window.location.href =
        `payment.html?id=${encodeURIComponent(order.orderId)}`;
    });
  }

  renderDenominations();
});
