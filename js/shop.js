/* =========================================================
   LEOOSTORE — SHOP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("shopSearch");

  if (!productList) return;

  const products = Array.isArray(window.PRODUCTS)
    ? window.PRODUCTS
    : [];

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function getCheapest(product) {
    if (
      !Array.isArray(product.denominations) ||
      !product.denominations.length
    ) {
      return null;
    }

    return product.denominations.reduce((lowest, item) => {
      if (!lowest) return item;

      return Number(item.price || 0) <
        Number(lowest.price || 0)
        ? item
        : lowest;
    }, null);
  }

  function renderProducts(list) {
    if (!list.length) {
      productList.innerHTML = `
        <div class="empty-state">
          <strong>Game tidak ditemukan</strong>
          <span>Coba cari nama game yang berbeda.</span>
        </div>
      `;
      return;
    }

    productList.innerHTML = list.map(product => {
      const denominations = Array.isArray(product.denominations)
        ? product.denominations
        : [];

      const cheapest = getCheapest(product);
      const preview = denominations.slice(0, 5);

      const gameId = product.slug || product.id;

      const chips = preview.length
        ? `
          <div class="product-denominations">
            ${preview.map(item => `
              <span class="denomination-chip">
                ${escapeHTML(item.shortAmount || item.amount)}
              </span>
            `).join("")}

            ${
              denominations.length > 5
                ? `<span class="denomination-more">
                    +${denominations.length - 5}
                  </span>`
                : ""
            }
          </div>
        `
        : "";

      const image = product.image
        ? `
          <img
            class="product-game-image"
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            onerror="
              this.style.display='none';
              this.nextElementSibling.style.display='flex';
            "
          >

          <div
            class="product-icon product-icon-fallback"
            style="display:none;"
          >
            ${escapeHTML(product.icon || "🎮")}
          </div>
        `
        : `
          <div class="product-icon">
            ${escapeHTML(product.icon || "🎮")}
          </div>
        `;

      return `
        <article class="product-card">

          <div class="product-image-wrap">
            ${image}
          </div>

          <div class="product-info">

            <h3>${escapeHTML(product.name)}</h3>

            <p class="product-publisher">
              ${escapeHTML(product.publisher || "Publisher")}
            </p>

            ${chips}

            ${
              cheapest
                ? `
                  <div class="product-price">
                    Mulai dari ${rupiah(cheapest.price)}
                  </div>

                  <div class="product-minimum">
                    ${escapeHTML(
                      cheapest.shortAmount ||
                      cheapest.amount
                    )}
                  </div>
                `
                : ""
            }

            <a
              class="product-btn"
              href="checkout.html?game=${encodeURIComponent(gameId)}"
              aria-label="Top Up ${escapeHTML(product.name)}"
            >
              <span class="product-btn-icon" aria-hidden="true">⚡</span>
              <span class="product-btn-text">Top Up Sekarang</span>
              <span class="product-btn-arrow" aria-hidden="true">→</span>
            </a>

          </div>

        </article>
      `;
    }).join("");
  }

  function filterProducts(keyword) {
    const query = String(keyword || "")
      .trim()
      .toLowerCase();

    if (!query) {
      renderProducts(products);
      return;
    }

    const filtered = products.filter(product => {
      return [
        product.name,
        product.id,
        product.slug,
        product.publisher
      ].some(value =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });

    renderProducts(filtered);
  }

  renderProducts(products);

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterProducts(searchInput.value);
    });
  }
});
