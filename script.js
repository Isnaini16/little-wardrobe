
const outfits = [
  {id:1,name:"Dress 01",category:"dress",image:"dress (1).jpeg"},
  {id:2,name:"Atasan 01",category:"atasan",image:"atasan (1).jpeg"},
  {id:3,name:"Atasan 02",category:"atasan",image:"atasan (2).jpeg"},
  {id:4,name:"Atasan 03",category:"atasan",image:"atasan (3).jpeg"},
  {id:5,name:"Atasan 04",category:"atasan",image:"atasan (4).jpeg"},
  {id:6,name:"Atasan 05",category:"atasan",image:"atasan (5).jpeg"},
  {id:7,name:"Atasan 06",category:"atasan",image:"atasan (6).jpeg"},
  {id:8,name:"Atasan 07",category:"atasan",image:"atasan (7).jpeg"},
  {id:9,name:"Atasan 08",category:"atasan",image:"atasan (8).jpeg"},
  {id:10,name:"Atasan 09",category:"atasan",image:"atasan (9).jpeg"},
  {id:11,name:"Celana 01",category:"celana",image:"celana (1).jpeg"},
  {id:12,name:"Celana 02",category:"celana",image:"celana (2).jpeg"},
  {id:13,name:"Celana 03",category:"celana",image:"celana (3).jpeg"},
  {id:14,name:"Celana 04",category:"celana",image:"celana (4).jpeg"},
  {id:15,name:"Dress 02",category:"dress",image:"dress (2).jpeg"},
  {id:16,name:"Dress 03",category:"dress",image:"dress (3).jpeg"},
  {id:17,name:"Dress 04",category:"dress",image:"dress (4).jpeg"},
  {id:18,name:"Dress 05",category:"dress",image:"dress (5).jpeg"},
  {id:19,name:"Dress 06",category:"dress",image:"dress (6).jpeg"},
  {id:20,name:"Rok 01",category:"rok",image:"rok (1).jpeg"},
  {id:21,name:"Rok 02",category:"rok",image:"rok (2).jpeg"},
  {id:22,name:"Rok 03",category:"rok",image:"rok (3).jpeg"},
  {id:23,name:"Rok 04",category:"rok",image:"rok (4).jpeg"},
  {id:24,name:"Rok 05",category:"rok",image:"rok (5).jpeg"},
  {id:25,name:"Rok 06",category:"rok",image:"rok (6).jpeg"}
];

const wardrobe = document.getElementById("wardrobe");
const count = document.getElementById("item-count");
const categoryNames = {
  atasan:"Atasan",
  dress:"Dress",
  celana:"Celana",
  rok:"Rok",
  tas:"Tas"
};

let category = "semua";
let chosen = [];

try {
  const saved = JSON.parse(
    localStorage.getItem("littleWardrobeChosen") || "[]"
  );
  if (Array.isArray(saved)) {
    chosen = saved.filter(id => outfits.some(item => item.id === id));
  }
} catch {
  chosen = [];
}

function photo(item) {
  return `images/${encodeURIComponent(item.image)}`;
}

function saveChoices() {
  localStorage.setItem("littleWardrobeChosen", JSON.stringify(chosen));
}

function renderWardrobe() {
  const items = outfits.filter(item =>
    category === "semua" || item.category === category
  );

  count.textContent = `${items.length} barang`;

  wardrobe.innerHTML = items.map(item => `
    <article class="outfit-card">
      <div class="photo-wrap">
        <img src="${photo(item)}" alt="${item.name}" loading="lazy">
        <div class="photo-error">
          Foto tidak ditemukan. Periksa folder images.
        </div>
        <button class="favorite ${chosen.includes(item.id) ? "chosen" : ""}"
          data-id="${item.id}">${chosen.includes(item.id) ? "♥" : "♡"}</button>
      </div>
      <div class="card-info">
        <h3>${item.name}</h3>
        <p>${categoryNames[item.category]}</p>
        <button class="choose ${chosen.includes(item.id) ? "chosen" : ""}"
          data-id="${item.id}">
          ${chosen.includes(item.id) ? "Dipilih ♥" : "Aku pilih ini ♡"}
        </button>
      </div>
    </article>
  `).join("");

  wardrobe.querySelectorAll(".photo-wrap img").forEach(img => {
    img.addEventListener("error", () => {
      img.classList.add("broken");
      img.nextElementSibling.classList.add("show");
    });
  });

  wardrobe.querySelectorAll("[data-id]").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      chosen = chosen.includes(id)
        ? chosen.filter(n => n !== id)
        : [...chosen, id];

      saveChoices();
      renderWardrobe();
      updateDoneButton();
    });
  });

  updateDoneButton();
}

const main = document.getElementById("wardrobe-page");
const content = main.querySelector(".content");
const footer = main.querySelector("footer");
const oldSelection = main.querySelector(".selection");

// Hilangkan daftar pilihan di bawah koleksi.
oldSelection.style.display = "none";

// Buat tombol untuk menuju halaman hasil pilihan.
const nextArea = document.createElement("div");
nextArea.id = "next-area";
nextArea.style.cssText =
  "text-align:center;padding:32px 16px;";

nextArea.innerHTML = `
  <p id="chosen-count" style="color:#a65376;margin-bottom:14px">
    0 outfit dipilih
  </p>
  <button id="finish-picking" class="main-button">
    Selesai Memilih ♡
  </button>
`;

oldSelection.before(nextArea);

// Buat halaman hasil pilihan terpisah.
const resultPage = document.createElement("section");
resultPage.id = "result-page";
resultPage.className = "hidden";

resultPage.innerHTML = `
  <header class="mini-hero">
    <p class="eyebrow">A LITTLE COLLECTION OF LOVE</p>
    <h1>Outfit Pilihan Sholah ♡</h1>
    <p>Ini dia pilihanmu untuk cewek kesayanganmu!</p>
  </header>

  <section style="max-width:1000px;margin:auto;padding:24px 18px">
    <p id="result-message" style="text-align:center;line-height:1.8">
      Setiap pilihanmu spesial buat Salsa ♡
    </p>

    <div id="result-grid" class="result-grid"></div>

    <p style="text-align:center;color:#a65376;margin:25px 0">
      Makasih sudah memilihkan outfit untuk Salsa, sayangku. ♡
    </p>

    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button id="back-picking" class="secondary-button">
        ← Kembali Memilih
      </button>
      <button id="result-share" class="main-button">
        Kirim ke WhatsApp ♡
      </button>
    </div>
  </section>
`;

main.appendChild(resultPage);

const extraStyle = document.createElement("style");
extraStyle.textContent = `
  .result-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(170px,1fr));
    gap:18px;
    margin-top:26px;
  }

  .result-card {
    background:#fff;
    border:1px solid #f1d5df;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 5px 18px #b75d7812;
  }

  .result-card img {
    display:block;
    width:100%;
    height:230px;
    object-fit:cover;
    background:#fff1f5;
  }

  .result-card-info {
    padding:12px;
    text-align:center;
  }

  .result-card-info h3 {
    margin:4px 0 6px;
    color:#a65376;
    font-size:15px;
  }

  .result-card-info p {
    margin:0;
    color:#987f89;
    font-size:13px;
  }

  @media(max-width:420px) {
    .result-grid {
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;
    }

    .result-card img { height:180px; }
  }
`;
document.head.appendChild(extraStyle);

function updateDoneButton() {
  document.getElementById("chosen-count").textContent =
    `${chosen.length} outfit dipilih ♡`;

  document.getElementById("finish-picking").textContent =
    chosen.length ? "Selesai Memilih ♡" : "Pilih Outfit Dulu ♡";
}

function showResults() {
  if (!chosen.length) {
    alert("Pilih outfit yang kamu suka dulu ya, Sholah ♡");
    return;
  }

  const items = outfits.filter(item => chosen.includes(item.id));

  document.getElementById("result-message").textContent =
    `Sholah memilih ${items.length} outfit untuk Salsa. ` +
    "Semoga setiap pilihan ini bikin kamu makin sayang sama aku ♡";

  document.getElementById("result-grid").innerHTML = items.map(item => `
    <article class="result-card">
      <img src="${photo(item)}" alt="${item.name}" loading="lazy">
      <div class="result-card-info">
        <h3>${item.name}</h3>
        <p>${categoryNames[item.category]}</p>
      </div>
    </article>
  `).join("");

  document.getElementById("result-grid").querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.alt = "Foto tidak ditemukan: " + img.alt;
    });
  });

  content.classList.add("hidden");
  footer.classList.add("hidden");
  resultPage.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("finish-picking").addEventListener("click", showResults);

document.getElementById("back-picking").addEventListener("click", () => {
  resultPage.classList.add("hidden");
  content.classList.remove("hidden");
  footer.classList.remove("hidden");
  renderWardrobe();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("result-share").addEventListener("click", () => {
  const items = outfits.filter(item => chosen.includes(item.id));

  const message =
    "Hai Salsa, ini outfit yang aku pilih khusus buat kamu ♡\n\n" +
    items.map(item => `♥ ${item.name} — ${categoryNames[item.category]}`).join("\n") +
    "\n\nDari Sholah, dengan cinta ♡";

  window.open(
    "https://wa.me/?text=" + encodeURIComponent(message),
    "_blank"
  );
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    category = button.dataset.category;

    document.querySelectorAll(".filter").forEach(filter => {
      filter.classList.toggle("active", filter === button);
    });

    renderWardrobe();
  });
});

document.getElementById("open-wardrobe").addEventListener("click", () => {
  document.getElementById("welcome").classList.add("hidden");
  main.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("back-home").addEventListener("click", () => {
  main.classList.add("hidden");
  document.getElementById("welcome").classList.remove("hidden");
  resultPage.classList.add("hidden");
  content.classList.remove("hidden");
  footer.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("clear-button").addEventListener("click", () => {
  chosen = [];
  saveChoices();
  renderWardrobe();
  updateDoneButton();
});

document.getElementById("share-button").addEventListener("click", () => {
  showResults();
});

renderWardrobe();
`;
document.head.appendChild(extraStyle);
renderWardrobe();
