/* =========================================================
   LEOOSTORE — PRODUCTS
   ========================================================= */

const PRODUCTS = [
  /* =======================================================
     MOBILE LEGENDS
     ======================================================= */
  {
    id: "mobile-legends",
    slug: "mobile-legends",
    name: "Mobile Legends",
    image: "assets/icons/mobile-legends.webp",
    icon: "🎮",
    publisher: "Moonton",
    description: "Top Up Diamond Mobile Legends dengan proses cepat.",

    denominations: [
      { id: "ml-5", amount: "5 Diamonds", price: 1500, category: "Diamond" },
      { id: "ml-12", amount: "12 Diamonds", price: 3500, category: "Diamond" },
      { id: "ml-19", amount: "19 Diamonds", price: 5500, category: "Diamond" },
      { id: "ml-28", amount: "28 Diamonds", price: 7500, category: "Diamond" },
      { id: "ml-36", amount: "36 Diamonds", price: 10000, category: "Diamond" },
      { id: "ml-44", amount: "44 Diamonds", price: 12000, category: "Diamond" },
      { id: "ml-56", amount: "56 Diamonds", price: 15000, category: "Diamond" },
      { id: "ml-86", amount: "86 Diamonds", price: 22000, category: "Diamond" },
      { id: "ml-172", amount: "172 Diamonds", price: 43000, category: "Diamond" },
      { id: "ml-257", amount: "257 Diamonds", price: 63000, category: "Diamond" },
      { id: "ml-344", amount: "344 Diamonds", price: 84000, category: "Diamond" },
      { id: "ml-429", amount: "429 Diamonds", price: 105000, category: "Diamond" },
      { id: "ml-514", amount: "514 Diamonds", price: 125000, category: "Diamond" },
      { id: "ml-706", amount: "706 Diamonds", price: 168000, category: "Diamond" },
      { id: "ml-878", amount: "878 Diamonds", price: 210000, category: "Diamond" },
      { id: "ml-1050", amount: "1050 Diamonds", price: 250000, category: "Diamond" }
    ]
  },

  /* =======================================================
     FREE FIRE
     ======================================================= */
  {
    id: "free-fire",
    slug: "free-fire",
    name: "Free Fire",
    image: "assets/icons/free-fire.webp",
    icon: "🔥",
    publisher: "Garena",
    description: "Top Up Diamond Free Fire dengan proses cepat.",

    denominations: [
      { id: "ff-5", amount: "5 Diamonds", price: 1000, category: "Diamond" },
      { id: "ff-12", amount: "12 Diamonds", price: 2000, category: "Diamond" },
      { id: "ff-50", amount: "50 Diamonds", price: 7000, category: "Diamond" },
      { id: "ff-70", amount: "70 Diamonds", price: 9000, category: "Diamond" },
      { id: "ff-100", amount: "100 Diamonds", price: 13000, category: "Diamond" },
      { id: "ff-140", amount: "140 Diamonds", price: 18000, category: "Diamond" },
      { id: "ff-210", amount: "210 Diamonds", price: 26000, category: "Diamond" },
      { id: "ff-355", amount: "355 Diamonds", price: 43000, category: "Diamond" },
      { id: "ff-425", amount: "425 Diamonds", price: 51000, category: "Diamond" },
      { id: "ff-720", amount: "720 Diamonds", price: 85000, category: "Diamond" },
      { id: "ff-1450", amount: "1450 Diamonds", price: 168000, category: "Diamond" },
      { id: "ff-2180", amount: "2180 Diamonds", price: 250000, category: "Diamond" }
    ]
  },

  /* =======================================================
     ROBLOX VIA LOGIN
     ======================================================= */
  {
    id: "roblox-via-login",
    slug: "roblox-via-login",
    name: "Roblox Via Login",
    image: "assets/icons/roblox.webp",
    icon: "🎮",
    publisher: "Roblox",
    description: "Top Up Robux melalui metode login Roblox.",

    denominations: [
      { id: "rbl-login-80", amount: "80 Robux", price: 15000, category: "Robux" },
      { id: "rbl-login-160", amount: "160 Robux", price: 29000, category: "Robux" },
      { id: "rbl-login-240", amount: "240 Robux", price: 42000, category: "Robux" },
      { id: "rbl-login-400", amount: "400 Robux", price: 68000, category: "Robux" },
      { id: "rbl-login-800", amount: "800 Robux", price: 130000, category: "Robux" },
      { id: "rbl-login-1700", amount: "1700 Robux", price: 265000, category: "Robux" },
      { id: "rbl-login-4500", amount: "4500 Robux", price: 680000, category: "Robux" },
      { id: "rbl-login-10000", amount: "10000 Robux", price: 1450000, category: "Robux" }
    ]
  },

  /* =======================================================
     ROBLOX VIA USERNAME
     ======================================================= */
  {
    id: "roblox-via-username",
    slug: "roblox-via-username",
    name: "Roblox Via Username",
    image: "assets/icons/roblox.webp",
    icon: "🎮",
    publisher: "Roblox",
    description: "Top Up Robux menggunakan username Roblox.",

    denominations: [
      { id: "rbl-user-80", amount: "80 Robux", price: 17000, category: "Robux" },
      { id: "rbl-user-160", amount: "160 Robux", price: 32000, category: "Robux" },
      { id: "rbl-user-240", amount: "240 Robux", price: 46000, category: "Robux" },
      { id: "rbl-user-400", amount: "400 Robux", price: 73000, category: "Robux" },
      { id: "rbl-user-800", amount: "800 Robux", price: 140000, category: "Robux" },
      { id: "rbl-user-1700", amount: "1700 Robux", price: 280000, category: "Robux" },
      { id: "rbl-user-4500", amount: "4500 Robux", price: 700000, category: "Robux" },
      { id: "rbl-user-10000", amount: "10000 Robux", price: 1500000, category: "Robux" }
    ]
  },

  /* =======================================================
     PUBG MOBILE
     ======================================================= */
  {
    id: "pubg-mobile",
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    image: "assets/icons/pubg-mobile.webp",
    icon: "🎯",
    publisher: "Tencent",
    description: "Top Up UC PUBG Mobile dengan proses cepat.",

    denominations: [
      { id: "pubg-60", amount: "60 UC", price: 15000, category: "UC" },
      { id: "pubg-325", amount: "325 UC", price: 75000, category: "UC" },
      { id: "pubg-660", amount: "660 UC", price: 145000, category: "UC" },
      { id: "pubg-1800", amount: "1800 UC", price: 365000, category: "UC" },
      { id: "pubg-3850", amount: "3850 UC", price: 720000, category: "UC" },
      { id: "pubg-8100", amount: "8100 UC", price: 1450000, category: "UC" }
    ]
  }
];


/* =========================================================
   GLOBAL
   ========================================================= */

window.PRODUCTS = PRODUCTS;


/* =========================================================
   GET PRODUCTS
   ========================================================= */

function getProducts() {
  return PRODUCTS;
}


/* =========================================================
   GET PRODUCT
   ========================================================= */

function getProductById(id) {
  return PRODUCTS.find(product =>
    String(product.id) === String(id) ||
    String(product.slug) === String(id)
  );
}


/* =========================================================
   GET DENOMINATION
   ========================================================= */

function getDenomination(productId, denominationId) {
  const product = getProductById(productId);

  if (!product) {
    return null;
  }

  return product.denominations.find(item =>
    String(item.id) === String(denominationId) ||
    String(item.amount) === String(denominationId)
  ) || null;
}


/* =========================================================
   CHEAPEST DENOMINATION
   ========================================================= */

function getCheapestDenomination(productId) {
  const product = getProductById(productId);

  if (
    !product ||
    !Array.isArray(product.denominations) ||
    product.denominations.length === 0
  ) {
    return null;
  }

  return product.denominations.reduce(
    (cheapest, current) => {
      if (!cheapest) return current;

      return Number(current.price || 0) <
        Number(cheapest.price || 0)
        ? current
        : cheapest;
    },
    null
  );
}


/* =========================================================
   FORMAT RUPIAH
   ========================================================= */

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}


/* =========================================================
   SEARCH PRODUCTS
   ========================================================= */

function searchProducts(keyword = "") {
  const query = String(keyword)
    .trim()
    .toLowerCase();

  if (!query) {
    return PRODUCTS;
  }

  return PRODUCTS.filter(product => {
    const name = String(product.name || "").toLowerCase();
    const id = String(product.id || "").toLowerCase();
    const slug = String(product.slug || "").toLowerCase();
    const publisher = String(product.publisher || "").toLowerCase();

    return (
      name.includes(query) ||
      id.includes(query) ||
      slug.includes(query) ||
      publisher.includes(query)
    );
  });
}


/* =========================================================
   GLOBAL HELPERS
   ========================================================= */

window.getProducts = getProducts;
window.getProductById = getProductById;
window.getDenomination = getDenomination;
window.getCheapestDenomination = getCheapestDenomination;
window.formatRupiah = formatRupiah;
window.searchProducts = searchProducts;
