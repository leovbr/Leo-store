/* =========================================================
   LEO STORE — SHOP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initShop();
});


/* =========================================================
   INIT
   ========================================================= */

function initShop() {

  const productList = document.getElementById("productList");

  if (!productList) {
    console.warn("Leo Store: #productList tidak ditemukan.");
    return;
  }

  renderProducts();

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

  const productList = document.getElementById("productList");

  if (!productList) return;

  const products = getProducts();

  if (!products || products.length === 0) {

    productList.innerHTML = `
      <div class="shop-empty">
        <div class="shop-empty-icon">📦</div>
        <h3>Produk belum tersedia</h3>
        <p>Belum ada produk yang bisa ditampilkan.</p>
      </div>
    `;

    return;
  }


  productList.innerHTML = products.map(product => {

    const cheapest = getCheapestDenomination(product.id);

    const price = cheapest
      ? formatRupiah(cheapest.price)
      : "Harga belum tersedia";

    const amount = cheapest
      ? cheapest.amount
      : "—";


    return `
      <article
        class="product-card"
        data-game="${escapeHTML(product.slug)}"
      >

        <div class="product-icon">
          ${product.icon || "🎮"}
        </div>

        <div class="product-info">

          <h3>
            ${escapeHTML(product.name)}
          </h3>

          <p>
            ${escapeHTML(
              product.description ||
              "Top up cepat dan mudah."
            )}
          </p>

          <div class="product-price">
            Mulai ${price}
          </div>

          <div class="product-minimum">
            ${escapeHTML(amount)}
          </div>

        </div>

        <a
          href="checkout.html?game=${encodeURIComponent(product.slug)}"
          class="product-btn"
        >
          Top Up
        </a>

      </article>
    `;

  }).join("");

}


/* =========================================================
   SEARCH
   ========================================================= */

function initSearch() {

  const searchInput =
    document.getElementById("shopSearch");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {

    const keyword =
      searchInput.value.trim();

    renderSearchResults(keyword);

  });

}


function renderSearchResults(keyword) {

  const productList =
    document.getElementById("productList");

  if (!productList) return;


  const products =
    searchProducts(keyword);


  if (!products.length) {

    productList.innerHTML = `
      <div class="shop-empty">

        <div class="shop-empty-icon">
          🔎
        </div>

        <h3>Produk tidak ditemukan</h3>

        <p>
          Coba cari dengan nama game lain.
        </p>

      </div>
    `;

    return;
  }


  productList.innerHTML =
    products.map(product => {

      const cheapest =
        getCheapestDenomination(product.id);

      const price =
        cheapest
          ? formatRupiah(cheapest.price)
          : "Harga belum tersedia";

      const amount =
        cheapest
          ? cheapest.amount
          : "—";


      return `
        <article
          class="product-card"
          data-game="${escapeHTML(product.slug)}"
        >

          <div class="product-icon">
            ${product.icon || "🎮"}
          </div>

          <div class="product-info">

            <h3>
              ${escapeHTML(product.name)}
            </h3>

            <p>
              ${escapeHTML(
                product.description ||
                "Top up cepat dan mudah."
              )}
            </p>

            <div class="product-price">
              Mulai ${price}
            </div>

            <div class="product-minimum">
              ${escapeHTML(amount)}
            </div>

          </div>

          <a
            href="checkout.html?game=${encodeURIComponent(product.slug)}"
            class="product-btn"
          >
            Top Up
          </a>

        </article>
      `;

    }).join("");

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   START SEARCH
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initSearch();

});
