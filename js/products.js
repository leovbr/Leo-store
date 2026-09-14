/* =========================================================
   LEO STORE — PRODUCTS
   ========================================================= */

const PRODUCTS = [
  /* =======================================================
     MOBILE LEGENDS
     ======================================================= */
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    image: "assets/icons/mobile-legends.webp",
    description: "Top Up Diamond Mobile Legends dengan proses cepat.",
    denominations: [
      {
        amount: "5 Diamonds",
        price: 1500,
        category: "Diamond"
      },
      {
        amount: "12 Diamonds",
        price: 3500,
        category: "Diamond"
      },
      {
        amount: "19 Diamonds",
        price: 5500,
        category: "Diamond"
      },
      {
        amount: "28 Diamonds",
        price: 7500,
        category: "Diamond"
      },
      {
        amount: "36 Diamonds",
        price: 10000,
        category: "Diamond"
      },
      {
        amount: "44 Diamonds",
        price: 12000,
        category: "Diamond"
      },
      {
        amount: "56 Diamonds",
        price: 15000,
        category: "Diamond"
      },
      {
        amount: "86 Diamonds",
        price: 22000,
        category: "Diamond"
      },
      {
        amount: "172 Diamonds",
        price: 43000,
        category: "Diamond"
      },
      {
        amount: "257 Diamonds",
        price: 63000,
        category: "Diamond"
      },
      {
        amount: "344 Diamonds",
        price: 84000,
        category: "Diamond"
      },
      {
        amount: "429 Diamonds",
        price: 105000,
        category: "Diamond"
      },
      {
        amount: "514 Diamonds",
        price: 125000,
        category: "Diamond"
      },
      {
        amount: "706 Diamonds",
        price: 168000,
        category: "Diamond"
      },
      {
        amount: "878 Diamonds",
        price: 210000,
        category: "Diamond"
      },
      {
        amount: "1050 Diamonds",
        price: 250000,
        category: "Diamond"
      }
    ]
  },

  /* =======================================================
     FREE FIRE
     ======================================================= */
  {
    id: "free-fire",
    name: "Free Fire",
    image: "assets/icons/free-fire.webp",
    description: "Top Up Diamond Free Fire dengan proses cepat.",
    denominations: [
      {
        amount: "5 Diamonds",
        price: 1000,
        category: "Diamond"
      },
      {
        amount: "12 Diamonds",
        price: 2000,
        category: "Diamond"
      },
      {
        amount: "50 Diamonds",
        price: 7000,
        category: "Diamond"
      },
      {
        amount: "70 Diamonds",
        price: 9000,
        category: "Diamond"
      },
      {
        amount: "100 Diamonds",
        price: 13000,
        category: "Diamond"
      },
      {
        amount: "140 Diamonds",
        price: 18000,
        category: "Diamond"
      },
      {
        amount: "210 Diamonds",
        price: 26000,
        category: "Diamond"
      },
      {
        amount: "355 Diamonds",
        price: 43000,
        category: "Diamond"
      },
      {
        amount: "425 Diamonds",
        price: 51000,
        category: "Diamond"
      },
      {
        amount: "720 Diamonds",
        price: 85000,
        category: "Diamond"
      },
      {
        amount: "1450 Diamonds",
        price: 168000,
        category: "Diamond"
      },
      {
        amount: "2180 Diamonds",
        price: 250000,
        category: "Diamond"
      }
    ]
  },

  /* =======================================================
     ROBLOX VIA LOGIN
     ======================================================= */
  {
    id: "roblox-via-login",
    name: "Roblox Via Login",
    image: "assets/icons/roblox.webp",
    description: "Top Up Robux melalui metode login Roblox.",
    denominations: [
      {
        amount: "80 Robux",
        price: 15000,
        category: "Robux"
      },
      {
        amount: "160 Robux",
        price: 29000,
        category: "Robux"
      },
      {
        amount: "240 Robux",
        price: 42000,
        category: "Robux"
      },
      {
        amount: "400 Robux",
        price: 68000,
        category: "Robux"
      },
      {
        amount: "800 Robux",
        price: 130000,
        category: "Robux"
      },
      {
        amount: "1700 Robux",
        price: 265000,
        category: "Robux"
      },
      {
        amount: "4500 Robux",
        price: 680000,
        category: "Robux"
      },
      {
        amount: "10000 Robux",
        price: 1450000,
        category: "Robux"
      }
    ]
  },

  /* =======================================================
     ROBLOX VIA USERNAME
     ======================================================= */
  {
    id: "roblox-via-username",
    name: "Roblox Via Username",
    image: "assets/icons/roblox.webp",
    description: "Top Up Robux menggunakan username Roblox.",
    denominations: [
      {
        amount: "80 Robux",
        price: 17000,
        category: "Robux"
      },
      {
        amount: "160 Robux",
        price: 32000,
        category: "Robux"
      },
      {
        amount: "240 Robux",
        price: 46000,
        category: "Robux"
      },
      {
        amount: "400 Robux",
        price: 73000,
        category: "Robux"
      },
      {
        amount: "800 Robux",
        price: 140000,
        category: "Robux"
      },
      {
        amount: "1700 Robux",
        price: 280000,
        category: "Robux"
      },
      {
        amount: "4500 Robux",
        price: 700000,
        category: "Robux"
      },
      {
        amount: "10000 Robux",
        price: 1500000,
        category: "Robux"
      }
    ]
  },

  /* =======================================================
     PUBG MOBILE
     ======================================================= */
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    image: "assets/icons/pubg-mobile.webp",
    description: "Top Up UC PUBG Mobile dengan proses cepat.",
    denominations: [
      {
        amount: "60 UC",
        price: 15000,
        category: "UC"
      },
      {
        amount: "325 UC",
        price: 75000,
        category: "UC"
      },
      {
        amount: "660 UC",
        price: 145000,
        category: "UC"
      },
      {
        amount: "1800 UC",
        price: 365000,
        category: "UC"
      },
      {
        amount: "3850 UC",
        price: 720000,
        category: "UC"
      },
      {
        amount: "8100 UC",
        price: 1450000,
        category: "UC"
      }
    ]
  }
];


/* =========================================================
   GLOBAL EXPORT
   ========================================================= */

window.PRODUCTS = PRODUCTS;


/* =========================================================
   HELPERS
   ========================================================= */

function getProducts() {
  return PRODUCTS;
}

function getProductById(id) {
  return PRODUCTS.find(product => product.id === id);
}

function getDenomination(productId, amount) {
  const product = getProductById(productId);

  if (!product) {
    return null;
  }

  return product.denominations.find(item => item.amount === amount) || null;
}


/* =========================================================
   GLOBAL HELPERS
   ========================================================= */

window.getProducts = getProducts;
window.getProductById = getProductById;
window.getDenomination = getDenomination;
