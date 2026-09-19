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
    publisher: "Roblox Corporation",

    denominations: [
      { id: "rbl-login-80", amount: "80 Robux", price: 15587, category: "Paket Special" },
      { id: "rbl-login-160", amount: "160 Robux", price: 31174, category: "Paket Special" },
      { id: "rbl-login-240", amount: "240 Robux", price: 46761, category: "Paket Special" },
      { id: "rbl-login-320", amount: "320 Robux", price: 62348, category: "Paket Special" },
      { id: "rbl-login-500", amount: "500 Robux", price: 77935, category: "Paket Normal" },
      { id: "rbl-login-580", amount: "580 Robux", price: 93522, category: "Paket Normal" },
      { id: "rbl-login-660", amount: "660 Robux", price: 109109, category: "Paket Normal" },
      { id: "rbl-login-740", amount: "740 Robux", price: 124696, category: "Paket Normal" },
      { id: "rbl-login-820", amount: "820 Robux", price: 140283, category: "Paket Normal" },
      { id: "rbl-login-1000", amount: "1000 Robux", price: 155870, category: "Paket Normal" },
      { id: "rbl-login-1500", amount: "1500 Robux", price: 233805, category: "Paket Normal" },
      { id: "rbl-login-2000", amount: "2000 Robux", price: 311740, category: "Paket Normal" },
      { id: "rbl-login-2500", amount: "2500 Robux", price: 389675, category: "Paket Normal" },
      { id: "rbl-login-3500", amount: "3500 Robux", price: 545545, category: "Paket Normal" },
      { id: "rbl-login-3000", amount: "3000 Robux", price: 467610, category: "Paket Juragan" },
      { id: "rbl-login-4000", amount: "4000 Robux", price: 623480, category: "Paket Juragan" },
      { id: "rbl-login-5000", amount: "5000 Robux", price: 779350, category: "Paket Juragan" },
      { id: "rbl-login-8000", amount: "8000 Robux", price: 1246960, category: "Paket Juragan" },
      { id: "rbl-login-10000", amount: "10000 Robux", price: 1558700, category: "Paket Juragan" },
      { id: "rbl-login-15000", amount: "15000 Robux", price: 2338050, category: "Paket Juragan" },
      { id: "rbl-login-22000", amount: "22000 Robux", price: 3429140, category: "Paket Juragan" },
      { id: "rbl-login-44000", amount: "44000 Robux", price: 6858280, category: "Paket Juragan" }
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
    publisher: "Roblox Corporation",

    denominations: [
      { id: "rbl-user-40", amount: "40 Robux (Wajib 18+ & Aktif V2L)", price: 8500, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-80", amount: "80 Robux (Wajib 18+ & Aktif V2L)", price: 16000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-160", amount: "160 Robux (Wajib 18+ & Aktif V2L)", price: 32000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-240", amount: "240 Robux (Wajib 18+ & Aktif V2L)", price: 48000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-320", amount: "320 Robux (Wajib 18+ & Aktif V2L)", price: 64000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-400", amount: "400 Robux (Wajib 18+ & Aktif V2L)", price: 80000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-500", amount: "500 Robux (Wajib 18+ & Aktif V2L)", price: 85000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-1000", amount: "1000 Robux (Wajib 18+ & Aktif V2L)", price: 170000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-1500", amount: "1500 Robux (Wajib 18+ & Aktif V2L)", price: 255000, category: "Robux", logo: "assets/icons/robux.webp" },
      { id: "rbl-user-2000", amount: "2000 Robux (Wajib 18+ & Aktif V2L)", price: 340000, category: "Robux", logo: "assets/icons/robux.webp" }
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
    publisher: "Level Infinite",

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
