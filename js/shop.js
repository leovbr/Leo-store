/* =========================================
   FIDELIS TOPUP
   SHOP ENGINE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const gameCards = document.querySelectorAll(
    "[data-game]"
  );

  /*
   * Kalau shop.html masih menggunakan
   * struktur HTML lama, kita tetap biarkan.
   */

  gameCards.forEach(card => {

    const gameSlug =
      card.dataset.game;

    const product =
      getProduct(gameSlug);

    if (!product) return;

    const title =
      card.querySelector("[data-product-name]");

    const type =
      card.querySelector("[data-product-type]");

    if (title) {
      title.textContent =
        product.name;
    }

    if (type) {
      type.textContent =
        product.type;
    }

  });


  /*
   * Tombol pilih game.
   */

  const buttons =
    document.querySelectorAll(
      "[data-select-game]"
    );

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const game =
          button.dataset.selectGame;

        if (!getProduct(game)) {
          console.error(
            "Produk tidak ditemukan:",
            game
          );

          return;
        }

        window.location.href =
          `checkout.html?game=${encodeURIComponent(game)}`;

      }
    );

  });

});
