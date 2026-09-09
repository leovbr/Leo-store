/* =========================================================
   LEO STORE — PRODUCTS DATABASE
   ========================================================= */

const PRODUCTS = [

  /* =======================================================
     MOBILE LEGENDS
     ======================================================= */

  {
    id: "mobile-legends",
    name: "Mobile Legends",
    slug: "mobile-legends",
    icon: "⚔️",
    description: "Top Up Diamonds Mobile Legends",

    denominations: [
      {
        id: "ml-5",
        amount: "5 Diamonds",
        price: 1500
      },
      {
        id: "ml-12",
        amount: "12 Diamonds",
        price: 3500
      },
      {
        id: "ml-19",
        amount: "19 Diamonds",
        price: 5500
      },
      {
        id: "ml-28",
        amount: "28 Diamonds",
        price: 7500
      },
      {
        id: "ml-36",
        amount: "36 Diamonds",
        price: 9500
      },
      {
        id: "ml-44",
        amount: "44 Diamonds",
        price: 11500
      },
      {
        id: "ml-56",
        amount: "56 Diamonds",
        price: 14500
      },
      {
        id: "ml-74",
        amount: "74 Diamonds",
        price: 19000
      },
      {
        id: "ml-86",
        amount: "86 Diamonds",
        price: 22000
      },
      {
        id: "ml-100",
        amount: "100 Diamonds",
        price: 25000
      },
      {
        id: "ml-172",
        amount: "172 Diamonds",
        price: 42000
      },
      {
        id: "ml-257",
        amount: "257 Diamonds",
        price: 62000
      },
      {
        id: "ml-344",
        amount: "344 Diamonds",
        price: 82000
      },
      {
        id: "ml-429",
        amount: "429 Diamonds",
        price: 102000
      },
      {
        id: "ml-514",
        amount: "514 Diamonds",
        price: 122000
      }
    ]
  },


  /* =======================================================
     FREE FIRE
     ======================================================= */

  {
    id: "free-fire",
    name: "Free Fire",
    slug: "free-fire",
    icon: "🔥",
    description: "Top Up Diamonds Free Fire",

    denominations: [
      {
        id: "ff-5",
        amount: "5 Diamonds",
        price: 1000
      },
      {
        id: "ff-12",
        amount: "12 Diamonds",
        price: 2000
      },
      {
        id: "ff-50",
        amount: "50 Diamonds",
        price: 7500
      },
      {
        id: "ff-70",
        amount: "70 Diamonds",
        price: 10000
      },
      {
        id: "ff-100",
        amount: "100 Diamonds",
        price: 14000
      },
      {
        id: "ff-140",
        amount: "140 Diamonds",
        price: 19000
      },
      {
        id: "ff-210",
        amount: "210 Diamonds",
        price: 28000
      },
      {
        id: "ff-355",
        amount: "355 Diamonds",
        price: 45000
      },
      {
        id: "ff-720",
        amount: "720 Diamonds",
        price: 88000
      },
      {
        id: "ff-1450",
        amount: "1450 Diamonds",
        price: 175000
      }
    ]
  },


  /* =======================================================
     ROBLOX
     ======================================================= */

  {
    id: "roblox",
    name: "Roblox",
    slug: "roblox",
    icon: "🧱",
    description: "Robux Roblox",

    denominations: [
      {
        id: "rbx-80",
        amount: "80 Robux",
        price: 15000
      },
      {
        id: "rbx-160",
        amount: "160 Robux",
        price: 29000
      },
      {
        id: "rbx-240",
        amount: "240 Robux",
        price: 42000
      },
      {
        id: "rbx-400",
        amount: "400 Robux",
        price: 68000
      },
      {
        id: "rbx-800",
        amount: "800 Robux",
        price: 135000
      },
      {
        id: "rbx-1700",
        amount: "1700 Robux",
        price: 270000
      }
    ]
  },


  /* =======================================================
     PUBG MOBILE
     ======================================================= */

  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    icon: "🎯",
    description: "Top Up UC PUBG Mobile",

    denominations: [
      {
        id: "pubg-60",
        amount: "60 UC",
        price: 15000
      },
      {
        id: "pubg-325",
        amount: "325 UC",
        price: 75000
      },
      {
        id: "pubg-660",
        amount: "660 UC",
        price: 145000
      },
      {
        id: "pubg-1800",
        amount: "1800 UC",
        price: 380000
      },
      {
        id: "pubg-3850",
        amount: "3850 UC",
        price: 760000
      }
    ]
  }

];


/* =========================================================
   PRODUCT HELPERS
   ========================================================= */

/**
 * Ambil semua produk
 */
function getProducts() {
  return PRODUCTS;
}


/**
 * Cari produk berdasarkan ID / slug
 */
function getProduct(gameId) {
  if (!gameId) return null;

  return PRODUCTS.find(product =>
    product.id === gameId ||
    product.slug === gameId
  ) || null;
}


/**
 * Cari denomination berdasarkan ID
 */
function getDenomination(gameId, denominationId) {

  const product = getProduct(gameId);

  if (!product || !denominationId) {
    return null;
  }

  return product.denominations.find(item =>
    item.id === denominationId
  ) || null;
}


/**
 * Format Rupiah
 */
function formatRupiah(value) {

  const number = Number(value) || 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}


/**
 * Cari produk berdasarkan nama
 */
function searchProducts(keyword) {

  if (!keyword) {
    return PRODUCTS;
  }

  const query = keyword
    .toLowerCase()
    .trim();

  return PRODUCTS.filter(product => {

    const name = product.name.toLowerCase();
    const slug = product.slug.toLowerCase();

    return (
      name.includes(query) ||
      slug.includes(query)
    );

  });
}


/**
 * Ambil denomination termurah
 */
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


/**
 * Validasi produk
 */
function isValidProduct(gameId) {

  return !!getProduct(gameId);

}


/**
 * Validasi denomination
 */
function isValidDenomination(gameId, denominationId) {

  return !!getDenomination(
    gameId,
    denominationId
  );

}


/* =========================================================
   GLOBAL ACCESS
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
