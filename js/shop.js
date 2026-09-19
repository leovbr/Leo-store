/* =========================================================
   LEOOSTORE — SHOP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("shopSearch");

  if (!productList) return;

  // products.js defines PRODUCTS with const, so it is not exposed
  // as window.PRODUCTS. Read the shared catalog directly.
  const products = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)
    ? PRODUCTS
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
      const gameId = product.slug || product.id;

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
