/* LEOOSTORE homepage catalog integration.
 * Public-only reads. The admin remains the only place that writes catalog data.
 */
(function () {
  const SUPABASE_URL = "https://tvdbrqskvuukxvqaqjom.supabase.co";
  const SUPABASE_KEY = "sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF";
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
  const safeImage = (value) => {
    try { const u = new URL(String(value || ""), window.location.href); return /^https?:$/.test(u.protocol) ? u.href : ""; }
    catch (_) { return ""; }
  };
  function gameCard(game) {
    const icon = safeImage(game.icon_url);
    const name = esc(game.name || game.slug);
    const publisher = esc(game.publisher || "");
    const image = icon
      ? '<img src="' + esc(icon) + '" alt="' + name + '" loading="lazy">'
      : '<span class="home-game-fallback" aria-hidden="true">🎮</span>';
    return '<a href="checkout.html?game=' + encodeURIComponent(game.slug) + '" class="home-game-card">' +
      '<div class="home-game-image">' + image + '</div><div class="home-game-info"><strong>' +
      name + '</strong><span>' + publisher + '</span></div></a>';
  }
  async function renderCatalog() {
    if (!window.supabase?.createClient) return;
    const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const [gameResult, productResult] = await Promise.all([
      db.from("store_games").select("slug,name,publisher,icon_url,is_active,sort_order").eq("is_active", true).order("sort_order"),
      db.from("store_products").select("game_slug").eq("is_active", true)
    ]);
    if (gameResult.error || productResult.error) {
      console.warn("[LEOOSTORE] Katalog beranda tidak diperbarui; mempertahankan tampilan bawaan.", gameResult.error || productResult.error);
      return;
    }
    const purchasable = new Set((productResult.data || []).map((p) => p.game_slug));
    const games = (gameResult.data || []).filter((g) => g.slug && purchasable.has(g.slug));
    if (!games.length) return;
    const all = document.getElementById("homeAllGames");
    const trending = document.getElementById("homeTrendingGames");
    if (all) all.innerHTML = games.map(gameCard).join("");
    if (trending) trending.innerHTML = games.slice(0, 2).map(gameCard).join("");
  }
  document.addEventListener("DOMContentLoaded", function () {
    renderCatalog().catch((error) => console.warn("[LEOOSTORE] Gagal memuat katalog beranda.", error));
  });
})();
