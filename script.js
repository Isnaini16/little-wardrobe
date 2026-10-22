
const outfits = [
  { id: 1, name: "Dress 01", category: "dress", image: "dress (1).jpeg" },
  { id: 2, name: "Atasan 01", category: "atasan", image: "atasan (1).jpeg" },
  { id: 3, name: "Atasan 02", category: "atasan", image: "atasan (2).jpeg" },
  { id: 4, name: "Atasan 03", category: "atasan", image: "atasan (3).jpeg" },
  { id: 5, name: "Atasan 04", category: "atasan", image: "atasan (4).jpeg" },
  { id: 6, name: "Atasan 05", category: "atasan", image: "atasan (5).jpeg" },
  { id: 7, name: "Atasan 06", category: "atasan", image: "atasan (6).jpeg" },
  { id: 8, name: "Atasan 07", category: "atasan", image: "atasan (7).jpeg" },
  { id: 9, name: "Atasan 08", category: "atasan", image: "atasan (8).jpeg" },
  { id: 10, name: "Atasan 09", category: "atasan", image: "atasan (9).jpeg" },
  { id: 11, name: "Celana 01", category: "celana", image: "celana (1).jpeg" },
  { id: 12, name: "Celana 02", category: "celana", image: "celana (2).jpeg" },
  { id: 13, name: "Celana 03", category: "celana", image: "celana (3).jpeg" },
  { id: 14, name: "Celana 04", category: "celana", image: "celana (4).jpeg" },
  { id: 15, name: "Dress 02", category: "dress", image: "dress (2).jpeg" },
  { id: 16, name: "Dress 03", category: "dress", image: "dress (3).jpeg" },
  { id: 17, name: "Dress 04", category: "dress", image: "dress (4).jpeg" },
  { id: 18, name: "Dress 05", category: "dress", image: "dress (5).jpeg" },
  { id: 19, name: "Dress 06", category: "dress", image: "dress (6).jpeg" },
  { id: 20, name: "Rok 01", category: "rok", image: "rok (1).jpeg" },
  { id: 21, name: "Rok 02", category: "rok", image: "rok (2).jpeg" },
  { id: 22, name: "Rok 03", category: "rok", image: "rok (3).jpeg" },
  { id: 23, name: "Rok 04", category: "rok", image: "rok (4).jpeg" },
  { id: 24, name: "Rok 05", category: "rok", image: "rok (5).jpeg" },
  { id: 25, name: "Rok 06", category: "rok", image: "rok (6).jpeg" }
];

const wardrobe = document.getElementById("wardrobe");
const count = document.getElementById("item-count");
const selectionText = document.getElementById("selection-text");
const selectedItems = document.getElementById("selected-items");

const categoryNames = {
  atasan: "Atasan lengan pendek",
  dress: "Dress",
  celana: "Celana",
  rok: "Rok",
  tas: "Tas"
};

let category = "semua";
let chosen = [];

try {
  const saved = JSON.parse(
    localStorage.getItem("littleWardrobeChosen") || "[]"
  );

  if (Array.isArray(saved)) {
    chosen = saved.filter(id =>
      outfits.some(item => item.id === id)
    );
  }
} catch {
  chosen = [];
}

function imagePath(item) {
  return `images/${encodeURIComponent(item.image)}`;
}

function saveChoices() {
  localStorage.setItem(
    "littleWardrobeChosen",
    JSON.stringify(chosen)
  );
}

/* =========================
   TAMPILAN KOLEKSI OUTFIT
========================= */

function renderWardrobe() {
  if (!wardrobe || !count) return;

  const items = outfits.filter(item =>
    category === "semua" || item.category === category
  );

  count.textContent = `${items.length} barang`;

  wardrobe.innerHTML = items.map(item => {
    const active = chosen.includes(item.id);

    return `
      <article class="outfit-card">
        <div class="photo-wrap">
          <img
            src="${imagePath(item)}"
            alt="${item.name}"
            loading="lazy"
          >
          <div class="photo-error">
            Foto belum ditemukan.<br>
            Periksa nama file di folder images.
          </div>

          <button
            type="button"
            class="favorite ${active ? "chosen" : ""}"
            data-id="${item.id}"
            aria-label="Pilih ${item.name}"
          >${active ? "♥" : "♡"}</button>
        </div>

        <div class="card-info">
          <h3>${item.name}</h3>
          <p>${categoryNames[item.category]}</p>

          <button
            type="button"
            class="choose ${active ? "chosen" : ""}"
            data-id="${item.id}"
          >${active ? "Dipilih ♥" : "Aku pilih ini ♡"}</button>
        </div>
      </article>
    `;
  }).join("");

  wardrobe.querySelectorAll(".photo-wrap img").forEach(img => {
    img.addEventListener("error", () => {
      img.classList.add("broken");

      if (img.nextElementSibling) {
        img.nextElementSibling.classList.add("show");
      }
    });
  });

  wardrobe.querySelectorAll("[data-id]").forEach(button => {
    button.addEventListener("click", () => {
      toggleChoice(Number(button.dataset.id));
    });
  });
}

function toggleChoice(id) {
  if (chosen.includes(id)) {
    chosen = chosen.filter(itemId => itemId !== id);
  } else {
    chosen.push(id);
  }

  saveChoices();
  renderWardrobe();
  renderSelection();
}

function renderSelection() {
  if (!selectedItems || !selectionText) return;

  const items = outfits.filter(item => chosen.includes(item.id));

  selectionText.textContent = items.length
    ? `Ada ${items.length} barang pilihan Sholah. ♡`
    : "Belum ada pilihan, sayang.";

  selectedItems.innerHTML = items.map(item =>
    `<span class="chip">${item.name}</span>`
  ).join("");
}

/* =========================
   HALAMAN HASIL PILIHAN
========================= */

const resultStyle = document.createElement("style");

resultStyle.textContent = `
  #sholah-result-page {
    position: fixed;
    inset: 0;
    z-index: 99999;
    overflow-y: auto;
    background: #fffaf8;
    color: #754b59;
    font-family: inherit;
  }

  #sholah-result-page[hidden] {
    display: none !important;
  }

  .sholah-result-header {
    text-align: center;
    padding: 32px 18px;
    background: #fae4e9;
  }

  .sholah-result-header .eyebrow {
    letter-spacing: 3px;
    font-size: 11px;
  }

  .sholah-result-header h1 {
    margin: 12px 0;
    font-size: clamp(27px, 5vw, 42px);
  }

  .sholah-result-header p {
    line-height: 1.7;
  }

  .sholah-result-content {
    max-width: 1050px;
    padding: 26px 18px 50px;
    margin: auto;
    text-align: center;
  }

  #sholah-result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 18px;
    margin-top: 24px;
    text-align: left;
  }

  .sholah-result-card {
    overflow: hidden;
    background: #fff;
    border: 1px solid #f1d5df;
    border-radius: 16px;
    box-shadow: 0 5px 18px #b75d7812;
  }

  .sholah-result-card img {
    display: block;
    width: 100%;
    height: 230px;
    object-fit: cover;
    background: #fae4e9;
  }

  .sholah-result-info {
    padding: 12px;
  }

  .sholah-result-info h3 {
    margin: 0 0 6px;
    color: #a65376;
    font-size: 15px;
  }

  .sholah-result-info p {
    margin: 0;
    color: #987f89;
    font-size: 13px;
  }

  .sholah-result-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  .sholah-result-actions button,
  #sholah-finish-button {
    padding: 13px 22px;
    border: 0;
    border-radius: 30px;
    background: #ff8ea1;
    color: white;
    font: inherit;
    cursor: pointer;
  }

  .sholah-result-actions .back-button {
    border: 1px solid #eab8c9;
    background: white;
    color: #a65376;
  }

  #sholah-finish-button {
    display: block;
    margin: 25px auto;
  }

  .sholah-empty-result {
    grid-column: 1 / -1;
    text-align: center;
    padding: 28px 10px;
  }

  @media (max-width: 420px) {
    #sholah-result-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .sholah-result-card img {
      height: 175px;
    }
  }
`;

document.head.appendChild(resultStyle);

const resultPage = document.createElement("section");
resultPage.id = "sholah-result-page";
resultPage.hidden = true;

resultPage.innerHTML = `
  <header class="sholah-result-header">
    <p class="eyebrow">A CLOSET FULL OF LOVE ♡</p>
    <h1>Outfit Pilihan Sholah</h1>
    <p>Sayang, ini dia outfit yang kamu pilih untuk Salsa. ♡</p>
  </header>

  <main class="sholah-result-content">
    <p id="sholah-result-count"></p>

    <div id="sholah-result-grid"></div>

    <p style="line-height:1.9;margin:30px 0">
      Makasih sudah memilihkan outfit buat aku, sayangku. ♡
      <br>
      <strong>For Sholah, from Salsa with love.</strong>
    </p>

    <div class="sholah-result-actions">
      <button type="button" class="back-button" id="sholah-back-button">
        ← Kembali memilih
      </button>

      <button type="button" id="sholah-whatsapp-button">
        Kirim pilihan ke WhatsApp ♡
      </button>
    </div>
  </main>
`;

document.body.appendChild(resultPage);

/* Tombol hasil diletakkan setelah daftar pilihan */
const finishButton = document.createElement("button");
finishButton.id = "sholah-finish-button";
finishButton.type = "button";
finishButton.textContent = "Lihat Hasil Pilihan Sholah ♡";

if (selectedItems) {
  selectedItems.insertAdjacentElement("afterend", finishButton);
}

function openResultPage() {
  if (!chosen.length) {
    alert("Pilih outfit dulu ya, Sholah ♡");
    return;
  }

  const items = outfits.filter(item => chosen.includes(item.id));
  const grid = document.getElementById("sholah-result-grid");

  document.getElementById("sholah-result-count").textContent =
    `Ada ${items.length} barang pilihan Sholah. ♡`;

  grid.innerHTML = items.map(item => `
    <article class="sholah-result-card">
      <img
        src="${imagePath(item)}"
        alt="${item.name}"
      >

      <div class="sholah-result-info">
        <h3>${item.name}</h3>
        <p>${categoryNames[item.category]}</p>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.alt = `Foto ${img.alt} tidak ditemukan`;
    });
  });

  resultPage.hidden = false;
  document.body.style.overflow = "hidden";
}

finishButton.addEventListener("click", openResultPage);

document.getElementById("sholah-back-button").addEventListener("click", () => {
  resultPage.hidden = true;
  document.body.style.overflow = "";
});

document.getElementById("sholah-whatsapp-button").addEventListener("click", () => {
  const items = outfits.filter(item => chosen.includes(item.id));

  if (!items.length) return;

  const message =
    "Hai Salsa! Ini outfit pilihan Sholah ♡\n\n" +
    items.map(item =>
      `♥ ${item.name} — ${categoryNames[item.category]}`
    ).join("\n") +
    "\n\nFor Sholah, from Salsa with love. ♡";

  window.open(
    "https://wa.me/?text=" + encodeURIComponent(message),
    "_blank"
  );
});

/* =========================
   FILTER KATEGORI
========================= */

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    category = button.dataset.category;

    document.querySelectorAll(".filter").forEach(filter => {
      filter.classList.toggle("active", filter === button);
    });

    renderWardrobe();
  });
});

/* =========================
   NAVIGASI HALAMAN
========================= */

const openWardrobeButton = document.getElementById("open-wardrobe");
const backHomeButton = document.getElementById("back-home");
const welcomePage = document.getElementById("welcome");
const wardrobePage = document.getElementById("wardrobe-page");

if (openWardrobeButton) {
  openWardrobeButton.addEventListener("click", () => {
    welcomePage.classList.add("hidden");
    wardrobePage.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (backHomeButton) {
  backHomeButton.addEventListener("click", () => {
    wardrobePage.classList.add("hidden");
    welcomePage.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================
   HAPUS PILIHAN
========================= */

const clearButton = document.getElementById("clear-button");

if (clearButton) {
  clearButton.addEventListener("click", () => {
    chosen = [];
    saveChoices();
    renderWardrobe();
    renderSelection();
  });
}

/* =========================
   WHATSAPP DARI HALAMAN KOLEKSI
========================= */

const shareButton = document.getElementById("share-button");

if (shareButton) {
  shareButton.addEventListener("click", () => {
    if (!chosen.length) {
      alert("Pilih minimal satu barang dulu, yaa ♡");
      return;
    }

    openResultPage();
  });
}

/* Jalankan website */
renderWardrobe();
renderSelection();
