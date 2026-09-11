/* =========================================
   LEOOSTORE
   GLOBAL APP
   ========================================= */
document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
  "LEOOSTORE initialized."
);


    /* =====================================
       ACTIVE NAVIGATION
       ===================================== */

    const currentPage =
      window.location.pathname
        .split("/")
        .pop() ||
      "index.html";


    const navLinks =
      document.querySelectorAll(
        "nav a"
      );


    navLinks.forEach(link => {

      const href =
        link.getAttribute("href");

      if (!href) return;


      const cleanHref =
        href.split("?")[0];


      if (
        cleanHref === currentPage
      ) {

        link.classList.add(
          "active"
        );

      }

    });


    /* =====================================
       PREVENT DOUBLE CLICK
       ===================================== */

    document
      .querySelectorAll(
        "button[type='submit']"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            setTimeout(
              () => {

                if (
                  button.form &&
                  button.form.checkValidity()
                ) {

                  button.disabled =
                    true;

                  button.textContent =
                    "Memproses...";

                }

              },
              50
            );

          }
        );

      });

  }
);


/* =========================================
   STORAGE HELPERS
   ========================================= */

function saveData(
  key,
  value
) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

}


function getData(key) {

  const value =
    localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {

    return JSON.parse(value);

  } catch (error) {

    console.error(
      "Gagal membaca storage:",
      error
    );

    return null;

  }

}


function removeData(key) {

  localStorage.removeItem(key);

}


/* =========================================
   GENERATE ID
   ========================================= */

function generateId(
  prefix = "LEO"
) {

  const timestamp =
    Date.now()
      .toString()
      .slice(-8);

  const random =
    Math.floor(
      100 +
      Math.random() * 900
    );

  return `${prefix}-${timestamp}-${random}`;

}
