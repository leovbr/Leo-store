/* =========================================================
   LEO STORE — SHOP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("shopSearch");

  if (!productList) return;

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderProducts(products) {
    if (!products || products.length === 0) {
      productList.innerHTML = `
        <div class="empty-state">
          <strong>Game tidak ditemukan</strong>
          <span>Coba cari nama game yang berbeda.</span>
        </div>
      `;

      return;
    }

    productList.innerHTML = products.map(product => {
      const cheapest = getCheapestDenomination(product.id);

      const denominations = Array.isArray(product.denominations)
        ? product.denominations
        : [];

      const preview = denominations.slice(0, 5);

      const nominalHTML = preview.length
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

      const imageHTML = product.image
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
            ${imageHTML}
          </div>

          <div class="product-info">

            <h3>${escapeHTML(product.name)}</h3>

            <p>
              ${escapeHTML(
                product.description ||
                `Top Up ${product.name}`
              )}
            </p>

            ${nominalHTML}

            ${
              cheapest
                ? `
                  <div class="product-price">
                    Mulai dari ${formatRupiah(cheapest.price)}
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
              href="checkout.html?game=${encodeURIComponent(product.slug)}"
            >
              Top Up
            </a>

          </div>
        </article>
      `;
    }).join("");
  }

  function loadProducts(keyword = "") {
    const products = keyword
      ? searchProducts(keyword)
      : getProducts();

    renderProducts(products);
  }

  loadProducts();

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadProducts(searchInput.value);
    });
  }
});
