/* =========================================
   FIDELIS TOPUP
   PRODUCT DATABASE
   ========================================= */

const products = {

  "mobile-legends": {
    name: "Mobile Legends",
    type: "Diamond",
    requiresServer: true,

    denominations: [
      { id: "ml-86", amount: "86 Diamonds", price: 22000 },
      { id: "ml-172", amount: "172 Diamonds", price: 42000 },
      { id: "ml-257", amount: "257 Diamonds", price: 62000 },
      { id: "ml-344", amount: "344 Diamonds", price: 82000 },
      { id: "ml-429", amount: "429 Diamonds", price: 102000 }
    ]
  },

  "free-fire": {
    name: "Free Fire",
    type: "Diamond",
    requiresServer: false,

    denominations: [
      { id: "ff-70", amount: "70 Diamonds", price: 10000 },
      { id: "ff-140", amount: "140 Diamonds", price: 19000 },
      { id: "ff-355", amount: "355 Diamonds", price: 47000 },
      { id: "ff-720", amount: "720 Diamonds", price: 93000 },
      { id: "ff-1450", amount: "1450 Diamonds", price: 185000 }
    ]
  },

  "roblox": {
    name: "Roblox",
    type: "Robux",
    requiresServer: false,

    denominations: [
      { id: "rbx-80", amount: "80 Robux", price: 15000 },
      { id: "rbx-400", amount: "400 Robux", price: 65000 },
      { id: "rbx-800", amount: "800 Robux", price: 120000 },
      { id: "rbx-1700", amount: "1.700 Robux", price: 245000 },
      { id: "rbx-4500", amount: "4.500 Robux", price: 620000 }
    ]
  },

  "pubg-mobile": {
    name: "PUBG Mobile",
    type: "UC",
    requiresServer: false,

    denominations: [
      { id: "pubg-60", amount: "60 UC", price: 16000 },
      { id: "pubg-325", amount: "325 UC", price: 74000 },
      { id: "pubg-660", amount: "660 UC", price: 145000 },
      { id: "pubg-1800", amount: "1.800 UC", price: 370000 },
      { id: "pubg-3850", amount: "3.850 UC", price: 740000 }
    ]
  }

};


/* =========================================
   PRODUCT HELPERS
   ========================================= */

function getProduct(gameSlug) {
  return products[gameSlug] || null;
}


function getAllProducts() {
  return Object.values(products);
}


function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(price);
}


function getDenomination(gameSlug, denominationId) {

  const game = getProduct(gameSlug);

  if (!game) {
    return null;
  }

  return game.denominations.find(
    item => item.id === denominationId
  ) || null;
}
