/* =========================================================
   LEO STORE — PRODUCT CATALOG
   ========================================================= */

const PRODUCTS = [
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    slug: "mobile-legends",
    icon: "⚔️",
    image: "assets/icons/mobile-legends.webp",
    description: "Top Up Diamonds Mobile Legends",

    denominations: [
      /* =========================
         FIRST TOP UP
         ========================= */

      {
        id: "ml-first-100",
        amount: "100 (50+50) Diamonds - First Top Up",
        shortAmount: "100 Diamonds",
        category: "🤩 First Top Up",
        price: 14619
      },
      {
        id: "ml-first-300",
        amount: "300 (150+150) Diamonds - First Top Up",
        shortAmount: "300 Diamonds",
        category: "🤩 First Top Up",
        price: 43742
      },
      {
        id: "ml-first-500",
        amount: "500 (250+250) Diamonds - First Top Up",
        shortAmount: "500 Diamonds",
        category: "🤩 First Top Up",
        price: 72641
      },
      {
        id: "ml-first-1000",
        amount: "1000 (500+500) Diamonds - First Top Up",
        shortAmount: "1000 Diamonds",
        category: "🤩 First Top Up",
        price: 147486
      },

      /* =========================
         SPECIAL ITEMS
         ========================= */

      {
        id: "ml-weekly-elite",
        amount: "Weekly Elite Pack",
        shortAmount: "Weekly Elite Pack",
        category: "🔥 Special Items",
        price: 14619
      },
      {
        id: "ml-weekly-pass",
        amount: "Weekly Diamond Pass",
        shortAmount: "Weekly Diamond Pass",
        category: "🔥 Special Items",
        price: 28002
      },
      {
        id: "ml-2x-weekly-pass",
        amount: "2x Weekly Diamond Pass",
        shortAmount: "2x Weekly Diamond Pass",
        category: "🔥 Special Items",
        price: 64556
      },
      {
        id: "ml-monthly-epic",
        amount: "Monthly Epic Pack",
        shortAmount: "Monthly Epic Pack",
        category: "🔥 Special Items",
        price: 72230
      },
      {
        id: "ml-3x-weekly-pass",
        amount: "3x Weekly Diamond Pass",
        shortAmount: "3x Weekly Diamond Pass",
        category: "🔥 Special Items",
        price: 96833
      },
      {
        id: "ml-4x-weekly-pass",
        amount: "4x Weekly Diamond Pass",
        shortAmount: "4x Weekly Diamond Pass",
        category: "🔥 Special Items",
        price: 129111
      },
      {
        id: "ml-twilight-pass",
        amount: "Twilight Pass",
        shortAmount: "Twilight Pass",
        category: "🔥 Special Items",
        price: 144794
      },
      {
        id: "ml-5x-weekly-pass",
        amount: "5x Weekly Diamond Pass",
        shortAmount: "5x Weekly Diamond Pass",
        category: "🔥 Special Items",
        price: 161389
      },

      /* =========================
         DIAMONDS
         ========================= */

      {
        id: "ml-5",
        amount: "5 (5+0) Diamonds",
        shortAmount: "5 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 1644
      },
      {
        id: "ml-11",
        amount: "11 (10+1) Diamonds",
        shortAmount: "11 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 3284
      },
      {
        id: "ml-10",
        amount: "10 (9+1) Diamonds",
        shortAmount: "10 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 3377
      },
      {
        id: "ml-12",
        amount: "12 (11+1) Diamonds",
        shortAmount: "12 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 3982
      },
      {
        id: "ml-14",
        amount: "14 (13+1) Diamonds",
        shortAmount: "14 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 4397
      },
      {
        id: "ml-15",
        amount: "15 (15+0) Diamonds",
        shortAmount: "15 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 5066
      },
      {
        id: "ml-19",
        amount: "19 (17+2) Diamonds",
        shortAmount: "19 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 6192
      },
      {
        id: "ml-22",
        amount: "22 (20+2) Diamonds",
        shortAmount: "22 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 6568
      },
      {
        id: "ml-20",
        amount: "20 (18+2) Diamonds",
        shortAmount: "20 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 6754
      },
      {
        id: "ml-28",
        amount: "28 (25+3) Diamonds",
        shortAmount: "28 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 9094
      },
      {
        id: "ml-36",
        amount: "36 (33+3) Diamonds",
        shortAmount: "36 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 11500
      },
      {
        id: "ml-44",
        amount: "44 (40+4) Diamonds",
        shortAmount: "44 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 13500
      },
      {
        id: "ml-56",
        amount: "56 (51+5) Diamonds",
        shortAmount: "56 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 16500
      },
      {
        id: "ml-74",
        amount: "74 (67+7) Diamonds",
        shortAmount: "74 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 21000
      },
      {
        id: "ml-86",
        amount: "86 (78+8) Diamonds",
        shortAmount: "86 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 24000
      },
      {
        id: "ml-100",
        amount: "100 (91+9) Diamonds",
        shortAmount: "100 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 28000
      },
      {
        id: "ml-172",
        amount: "172 (156+16) Diamonds",
        shortAmount: "172 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 45000
      },
      {
        id: "ml-257",
        amount: "257 (234+23) Diamonds",
        shortAmount: "257 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 65000
      },
      {
        id: "ml-344",
        amount: "344 (312+32) Diamonds",
        shortAmount: "344 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 85000
      },
      {
        id: "ml-429",
        amount: "429 (390+39) Diamonds",
        shortAmount: "429 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 105000
      },
      {
        id: "ml-514",
        amount: "514 (468+46) Diamonds",
        shortAmount: "514 Diamonds",
        category: "✨ Top Up Diamonds",
        price: 125000
      }
    ]
  },

  /* =========================================================
     FREE FIRE
     ========================================================= */

  {
    id: "free-fire",
    name: "Free Fire",
    slug: "free-fire",
    icon: "🔥",
    image: "assets/icons/free-fire.webp",
    description: "Top Up Diamonds Free Fire",

    denominations: [
      { id: "ff-5", amount: "5 Diamonds", shortAmount: "5 Diamonds", category: "💎 Top Up Diamonds", price: 1000 },
      { id: "ff-12", amount: "12 Diamonds", shortAmount: "12 Diamonds", category: "💎 Top Up Diamonds", price: 2000 },
      { id: "ff-50", amount: "50 Diamonds", shortAmount: "50 Diamonds", category: "💎 Top Up Diamonds", price: 7500 },
      { id: "ff-70", amount: "70 Diamonds", shortAmount: "70 Diamonds", category: "💎 Top Up Diamonds", price: 10000 },
      { id: "ff-100", amount: "100 Diamonds", shortAmount: "100 Diamonds", category: "💎 Top Up Diamonds", price: 14000 },
      { id: "ff-140", amount: "140 Diamonds", shortAmount: "140 Diamonds", category: "💎 Top Up Diamonds", price: 19000 },
      { id: "ff-210", amount: "210 Diamonds", shortAmount: "210 Diamonds", category: "💎 Top Up Diamonds", price: 28000 },
      { id: "ff-355", amount: "355 Diamonds", shortAmount: "355 Diamonds", category: "💎 Top Up Diamonds", price: 45000 },
      { id: "ff-720", amount: "720 Diamonds", shortAmount: "720 Diamonds", category: "💎 Top Up Diamonds", price: 88000 },
      { id: "ff-1450", amount: "1450 Diamonds", shortAmount: "1450 Diamonds", category: "💎 Top Up Diamonds", price: 175000 }
    ]
  },

  /* =========================================================
     ROBLOX
     ========================================================= */

  {
    id: "roblox",
    name: "Roblox",
    slug: "roblox",
    icon: "🧱",
    image: "assets/icons/roblox.webp",
    description: "Robux Roblox",

    denominations: [
      { id: "rbx-80", amount: "80 Robux", shortAmount: "80 Robux", category: "✨ Top Up Robux", price: 15000 },
      { id: "rbx-160", amount: "160 Robux", shortAmount: "160 Robux", category: "✨ Top Up Robux", price: 29000 },
      { id: "rbx-240", amount: "240 Robux", shortAmount: "240 Robux", category: "✨ Top Up Robux", price: 42000 },
      { id: "rbx-400", amount: "400 Robux", shortAmount: "400 Robux", category: "✨ Top Up Robux", price: 68000 },
      { id: "rbx-800", amount: "800 Robux", shortAmount: "800 Robux", category: "✨ Top Up Robux", price: 135000 },
      { id: "rbx-1700", amount: "1700 Robux", shortAmount: "1700 Robux", category: "✨ Top Up Robux", price: 270000 }
    ]
  },

  /* =========================================================
     PUBG MOBILE
     ========================================================= */

  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    icon: "🎯",
    image: "assets/icons/pubg-mobile.webp",
    description: "Top Up UC PUBG Mobile",

    denominations: [
      { id: "pubg-60", amount: "60 UC", shortAmount: "60 UC", category: "🎯 Top Up UC", price: 15000 },
      { id: "pubg-325", amount: "325 UC", shortAmount: "325 UC", category: "🎯 Top Up UC", price: 75000 },
      { id: "pubg-660", amount: "660 UC", shortAmount: "660 UC", category: "🎯 Top Up UC", price: 145000 },
      { id: "pubg-1800", amount: "1800 UC", shortAmount: "1800 UC", category: "🎯 Top Up UC", price: 380000 },
      { id: "pubg-3850", amount: "3850 UC", shortAmount: "3850 UC", category: "🎯 Top Up UC", price: 760000 }
    ]
  }
];

/* =========================================================
   HELPERS
   ========================================================= */

function getProducts() {
  return PRODUCTS;
}

function getProduct(gameId) {
  if (!gameId) return null;

  return PRODUCTS.find(product =>
    product.id === gameId ||
    product.slug === gameId
  ) || null;
}

function getDenomination(gameId, denominationId) {
  const product = getProduct(gameId);

  if (!product || !denominationId) return null;

  return product.denominations.find(item =>
    item.id === denominationId
  ) || null;
}

function formatRupiah(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

function searchProducts(keyword) {
  if (!keyword) return PRODUCTS;

  const query = keyword.toLowerCase().trim();

  return PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.slug.toLowerCase().includes(query)
  );
}

function getCheapestDenomination(gameId) {
  const product = getProduct(gameId);

  if (
    !product ||
    !product.denominations ||
    product.denominations.length === 0
  ) {
    return null;
  }

  return [...product.denominations]
    .sort((a, b) => a.price - b.price)[0];
}

function isValidProduct(gameId) {
  return !!getProduct(gameId);
}

function isValidDenomination(gameId, denominationId) {
  return !!getDenomination(gameId, denominationId);
}

/* =========================================================
   GLOBAL
   ========================================================= */

window.PRODUCTS = PRODUCTS;
window.getProducts = getProducts;
window.getProduct = getProduct;
window.getDenomination = getDenomination;
window.formatRupiah = formatRupiah;
window.searchProducts = searchProducts;
window.getCheapestDenomination = getCheapestDenomination;
window.isValidProduct = isValidProduct;
window.isValidDenomination = isValidDenomination;
