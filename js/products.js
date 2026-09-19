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
      { id: "ff-membership-weekly", amount: "Member Mingguan", price: 30067, category: "Membership" },
      { id: "ff-bp-card", amount: "BP Card", price: 45071, category: "Membership" },
      { id: "ff-membership-monthly", amount: "Member Bulanan", price: 90130, category: "Membership" },
      { id: "ff-5", amount: "5 Diamonds", price: 976, category: "✨ Top Up Instant" },
      { id: "ff-12", amount: "12 Diamonds", price: 1951, category: "✨ Top Up Instant" },
      { id: "ff-15", amount: "15 Diamonds", price: 2928, category: "✨ Top Up Instant" },
      { id: "ff-20", amount: "20 Diamonds", price: 3904, category: "✨ Top Up Instant" },
      { id: "ff-25", amount: "25 Diamonds", price: 4880, category: "✨ Top Up Instant" },
      { id: "ff-30", amount: "30 Diamonds", price: 5856, category: "✨ Top Up Instant" },
      { id: "ff-50", amount: "50 Diamonds", price: 7802, category: "✨ Top Up Instant" },
      { id: "ff-55", amount: "55 Diamonds", price: 8778, category: "✨ Top Up Instant" },
      { id: "ff-70", amount: "70 Diamonds", price: 9752, category: "✨ Top Up Instant" },
      { id: "ff-75", amount: "75 Diamonds", price: 10728, category: "✨ Top Up Instant" },
      { id: "ff-80", amount: "80 Diamonds", price: 11704, category: "✨ Top Up Instant" },
      { id: "ff-90", amount: "90 Diamonds", price: 13656, category: "✨ Top Up Instant" },
      { id: "ff-95", amount: "95 Diamonds", price: 14632, category: "✨ Top Up Instant" },
      { id: "ff-100", amount: "100 Diamonds", price: 15608, category: "✨ Top Up Instant" },
      { id: "ff-120", amount: "120 Diamonds", price: 17554, category: "✨ Top Up Instant" },
      { id: "ff-140", amount: "140 Diamonds", price: 19503, category: "✨ Top Up Instant" },
      { id: "ff-145", amount: "145 Diamonds", price: 20479, category: "✨ Top Up Instant" },
      { id: "ff-160", amount: "160 Diamonds", price: 23407, category: "✨ Top Up Instant" },
      { id: "ff-170", amount: "170 Diamonds", price: 25358, category: "✨ Top Up Instant" },
      { id: "ff-190", amount: "190 Diamonds", price: 27306, category: "✨ Top Up Instant" },
      { id: "ff-180", amount: "180 Diamonds", price: 27310, category: "✨ Top Up Instant" },
      { id: "ff-210", amount: "210 Diamonds", price: 29255, category: "✨ Top Up Instant" },
      { id: "ff-260", amount: "260 Diamonds", price: 37057, category: "✨ Top Up Instant" },
      { id: "ff-250", amount: "250 Diamonds", price: 37062, category: "✨ Top Up Instant" },
      { id: "ff-280", amount: "280 Diamonds", price: 39006, category: "✨ Top Up Instant" },
      { id: "ff-300", amount: "300 Diamonds", price: 42910, category: "✨ Top Up Instant" },
      { id: "ff-355", amount: "355 Diamonds", price: 48757, category: "✨ Top Up Instant" },
      { id: "ff-360", amount: "360 Diamonds", price: 49733, category: "✨ Top Up Instant" },
      { id: "ff-375", amount: "375 Diamonds", price: 52661, category: "✨ Top Up Instant" },
      { id: "ff-405", amount: "405 Diamonds", price: 56555, category: "✨ Top Up Instant" },
      { id: "ff-425", amount: "425 Diamonds", price: 58509, category: "✨ Top Up Instant" },
      { id: "ff-475", amount: "475 Diamonds", price: 66311, category: "✨ Top Up Instant" },
      { id: "ff-495", amount: "495 Diamonds", price: 68260, category: "✨ Top Up Instant" },
      { id: "ff-500", amount: "500 Diamonds", price: 69236, category: "✨ Top Up Instant" },
      { id: "ff-512", amount: "512 Diamonds", price: 71187, category: "✨ Top Up Instant" },
      { id: "ff-520", amount: "520 Diamonds", price: 73139, category: "✨ Top Up Instant" },
      { id: "ff-545", amount: "545 Diamonds", price: 76061, category: "✨ Top Up Instant" },
      { id: "ff-565", amount: "565 Diamonds", price: 78012, category: "✨ Top Up Instant" },
      { id: "ff-600", amount: "600 Diamonds", price: 84843, category: "✨ Top Up Instant" },
      { id: "ff-635", amount: "635 Diamonds", price: 87763, category: "✨ Top Up Instant" },
      { id: "ff-645", amount: "645 Diamonds", price: 89715, category: "✨ Top Up Instant" },
      { id: "ff-655", amount: "655 Diamonds", price: 91666, category: "✨ Top Up Instant" },
      { id: "ff-720", amount: "720 Diamonds", price: 97514, category: "✨ Top Up Instant" },
      { id: "ff-725", amount: "725 Diamonds", price: 98490, category: "✨ Top Up Instant" },
      { id: "ff-740", amount: "740 Diamonds", price: 101417, category: "✨ Top Up Instant" },
      { id: "ff-770", amount: "770 Diamonds", price: 105315, category: "✨ Top Up Instant" },
      { id: "ff-790", amount: "790 Diamonds", price: 107266, category: "✨ Top Up Instant" },
      { id: "ff-800", amount: "800 Diamonds", price: 109218, category: "✨ Top Up Instant" },
      { id: "ff-860", amount: "860 Diamonds", price: 117017, category: "✨ Top Up Instant" },
      { id: "ff-930", amount: "930 Diamonds", price: 126769, category: "✨ Top Up Instant" },
      { id: "ff-1000", amount: "1000 Diamonds", price: 136520, category: "✨ Top Up Instant" },
      { id: "ff-1050", amount: "1050 Diamonds", price: 144321, category: "✨ Top Up Instant" },
      { id: "ff-1075", amount: "1075 Diamonds", price: 146271, category: "✨ Top Up Instant" },
      { id: "ff-1080", amount: "1080 Diamonds", price: 147246, category: "✨ Top Up Instant" },
      { id: "ff-1200", amount: "1200 Diamonds", price: 164800, category: "✨ Top Up Instant" },
      { id: "ff-1215", amount: "1215 Diamonds", price: 165773, category: "✨ Top Up Instant" },
      { id: "ff-1300", amount: "1300 Diamonds", price: 178453, category: "✨ Top Up Instant" },
      { id: "ff-1450", amount: "1450 Diamonds", price: 195026, category: "✨ Top Up Instant" },
      { id: "ff-1440", amount: "1440 Diamonds", price: 195027, category: "✨ Top Up Instant" },
      { id: "ff-1490", amount: "1490 Diamonds", price: 202833, category: "✨ Top Up Instant" },
      { id: "ff-1510", amount: "1510 Diamonds", price: 204779, category: "✨ Top Up Instant" },
      { id: "ff-1580", amount: "1580 Diamonds", price: 214531, category: "✨ Top Up Instant" },
      { id: "ff-1800", amount: "1800 Diamonds", price: 245737, category: "✨ Top Up Instant" },
      { id: "ff-1875", amount: "1875 Diamonds", price: 253535, category: "✨ Top Up Instant" },
      { id: "ff-1975", amount: "1975 Diamonds", price: 269141, category: "✨ Top Up Instant" },
      { id: "ff-2005", amount: "2005 Diamonds", price: 273039, category: "✨ Top Up Instant" },
      { id: "ff-2020", amount: "2020 Diamonds", price: 275966, category: "✨ Top Up Instant" },
      { id: "ff-2100", amount: "2100 Diamonds", price: 285716, category: "✨ Top Up Instant" },
      { id: "ff-2180", amount: "2180 Diamonds", price: 292540, category: "✨ Top Up Instant" },
      { id: "ff-2160", amount: "2160 Diamonds", price: 292540, category: "✨ Top Up Instant" },
      { id: "ff-2200", amount: "2200 Diamonds", price: 296443, category: "✨ Top Up Instant" },
      { id: "ff-2210", amount: "2210 Diamonds", price: 298395, category: "✨ Top Up Instant" },
      { id: "ff-2225", amount: "2225 Diamonds", price: 301322, category: "✨ Top Up Instant" },
      { id: "ff-2280", amount: "2280 Diamonds", price: 308147, category: "✨ Top Up Instant" },
      { id: "ff-2350", amount: "2350 Diamonds", price: 317897, category: "✨ Top Up Instant" },
      { id: "ff-2355", amount: "2355 Diamonds", price: 318873, category: "✨ Top Up Instant" },
      { id: "ff-2400", amount: "2400 Diamonds", price: 323746, category: "✨ Top Up Instant" },
      { id: "ff-2575", amount: "2575 Diamonds", price: 349103, category: "✨ Top Up Instant" },
      { id: "ff-2720", amount: "2720 Diamonds", price: 369582, category: "✨ Top Up Instant" },
      { id: "ff-2750", amount: "2750 Diamonds", price: 371527, category: "✨ Top Up Instant" },
      { id: "ff-3000", amount: "3000 Diamonds", price: 405660, category: "✨ Top Up Instant" },
      { id: "ff-3310", amount: "3310 Diamonds", price: 447587, category: "✨ Top Up Instant" },
      { id: "ff-3640", amount: "3640 Diamonds", price: 487565, category: "✨ Top Up Instant" },
      { id: "ff-3675", amount: "3675 Diamonds", price: 494396, category: "✨ Top Up Instant" },
      { id: "ff-3800", amount: "3800 Diamonds", price: 510972, category: "✨ Top Up Instant" },
      { id: "ff-4000", amount: "4000 Diamonds", price: 537298, category: "✨ Top Up Instant" },
      { id: "ff-4050", amount: "4050 Diamonds", price: 545099, category: "✨ Top Up Instant" },
      { id: "ff-4340", amount: "4340 Diamonds", price: 586057, category: "✨ Top Up Instant" },
      { id: "ff-4450", amount: "4450 Diamonds", price: 598734, category: "✨ Top Up Instant" },
      { id: "ff-4720", amount: "4720 Diamonds", price: 634811, category: "✨ Top Up Instant" },
      { id: "ff-4800", amount: "4800 Diamonds", price: 648468, category: "✨ Top Up Instant" },
      { id: "ff-4850", amount: "4850 Diamonds", price: 656269, category: "✨ Top Up Instant" },
      { id: "ff-5500", amount: "5500 Diamonds", price: 740125, category: "✨ Top Up Instant" },
      { id: "ff-5600", amount: "5600 Diamonds", price: 753778, category: "✨ Top Up Instant" },
      { id: "ff-6000", amount: "6000 Diamonds", price: 807409, category: "✨ Top Up Instant" },
      { id: "ff-6480", amount: "6480 Diamonds", price: 872748, category: "✨ Top Up Instant" },
      { id: "ff-6550", amount: "6550 Diamonds", price: 879569, category: "✨ Top Up Instant" },
      { id: "ff-6900", amount: "6900 Diamonds", price: 927350, category: "✨ Top Up Instant" },
      { id: "ff-7290", amount: "7290 Diamonds", price: 975129, category: "✨ Top Up Instant" },
      { id: "ff-7295", amount: "7295 Diamonds", price: 976105, category: "✨ Top Up Instant" },
      { id: "ff-7310", amount: "7310 Diamonds", price: 979032, category: "✨ Top Up Instant" },
      { id: "ff-7340", amount: "7340 Diamonds", price: 982930, category: "✨ Top Up Instant" },
      { id: "ff-7360", amount: "7360 Diamonds", price: 984881, category: "✨ Top Up Instant" },
      { id: "ff-7430", amount: "7430 Diamonds", price: 994632, category: "✨ Top Up Instant" },
      { id: "ff-7645", amount: "7645 Diamonds", price: 1023886, category: "✨ Top Up Instant" },
      { id: "ff-7650", amount: "7650 Diamonds", price: 1024861, category: "✨ Top Up Instant" },
      { id: "ff-8010", amount: "8010 Diamonds", price: 1072642, category: "✨ Top Up Instant" },
      { id: "ff-9290", amount: "9290 Diamonds", price: 1249144, category: "✨ Top Up Instant" },
      { id: "ff-9800", amount: "9800 Diamonds", price: 1314475, category: "✨ Top Up Instant" },
      { id: "ff-14580", amount: "14580 Diamonds", price: 1950257, category: "✨ Top Up Instant" },
      { id: "ff-36500", amount: "36500 Diamonds", price: 4875643, category: "✨ Top Up Instant" },
      { id: "ff-37050", amount: "37050 Diamonds", price: 4952680, category: "✨ Top Up Instant" },
      { id: "ff-73100", amount: "73100 Diamonds", price: 9751285, category: "✨ Top Up Instant" }
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
