/* =========================================
   LEO STORE
   TRANSACTION ENGINE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const orderId =
    params.get("id");

  if (!orderId) return;


  /* =========================================
     START TRANSACTION
     ========================================= */

  startTransaction(orderId);

});


/* =========================================
   START TRANSACTION
   ========================================= */

function startTransaction(orderId) {

  let orders = getOrders();

  const index =
    orders.findIndex(
      order =>
        order.orderId === orderId
    );

  if (index === -1) {
    return;
  }


  const order =
    orders[index];


  /* =========================================
     ONLY AFTER PAYMENT
     ========================================= */

  if (
    order.status !==
    "Pembayaran Berhasil"
  ) {

    return;

  }


  /* =========================================
     PROCESSING
     ========================================= */

  order.status =
    "Pesanan Diproses";

  order.processingAt =
    new Date().toISOString();


  orders[index] =
    order;


  saveOrders(
    orders
  );


  saveLastOrder(
    order
  );


  /*
   * Tunggu beberapa detik
   * sebelum simulasi top up selesai.
   */

  setTimeout(
    () => {

      completeTransaction(
        orderId
      );

    },
    4000
  );

}


/* =========================================
   COMPLETE TRANSACTION
   ========================================= */

function completeTransaction(
  orderId
) {

  let orders =
    getOrders();


  const index =
    orders.findIndex(
      order =>
        order.orderId === orderId
    );


  if (index === -1) {
    return;
  }


  const order =
    orders[index];


  /* =========================================
     TOP UP BERHASIL
     ========================================= */

  order.status =
    "Top Up Berhasil";

  order.completedAt =
    new Date().toISOString();


  orders[index] =
    order;


  /* =========================================
     SAVE
     ========================================= */

  saveOrders(
    orders
  );


  saveLastOrder(
    order
  );


  /*
   * Kembali ke order tracking
   */

  window.location.replace(
    `order.html?id=${encodeURIComponent(
      orderId
    )}`
  );

}


/* =========================================
   GET ORDERS
   ========================================= */

function getOrders() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "fidelis_orders"
      )
    ) || [];

  } catch (error) {

    console.error(
      "Gagal membaca orders:",
      error
    );

    return [];

  }

}


/* =========================================
   SAVE ORDERS
   ========================================= */

function saveOrders(
  orders
) {

  localStorage.setItem(
    "fidelis_orders",
    JSON.stringify(
      orders
    )
  );

}


/* =========================================
   SAVE LAST ORDER
   ========================================= */

function saveLastOrder(
  order
) {

  localStorage.setItem(
    "fidelis_last_order",
    JSON.stringify(
      order
    )
  );

}
