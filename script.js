
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
const selectionText = document.getElementById("selection-text");
const selectedItems = document.getElementById("selected-items");

const categoryNames = {
  atasan:"Atasan lengan pendek",
  dress:"Dress",
  celana:"Celana",
  rok:"Rok",
  tas:"Tas"
};

let chosen = [];
let category = "semua";

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

function saveChoices() {
  localStorage.setItem("littleWardrobeChosen", JSON.stringify(chosen));
}

function getPhoto(item) {
  return `images/${encodeURIComponent(item.image)}`;
}

/* HALAMAN HASIL PILIHAN */
const resultPage = document.createElement("section");
resultPage.id = "final-outfit-page";
resultPage.className = "hidden";

resultPage.innerHTML = `
  <div class="final-header">
    <button type="button" id="final-back" class="final-back">
      ← Kembali memilih
    </button>
    <p class="final-kicker">MADE WITH LOVE ♡</p>
    <h1>Outfit Pilihan Sholah</h1>
    <p>Ini dia koleksi yang kamu pilih khusus buat Salsa.</p>
  </div>

  <div class="final-content">
    <p id="final-count"></p>
    <div id="final-outfit-grid"></div>
    <p class="final-love">
      Makasih sudah memilihkan outfit buat aku, sayangku. ♡
    </p>
    <button type="button" id="final-share" class="final-share">
      Kirim Pilihan ke WhatsApp ♡
    </button>
  </div>
`;

document.body.appendChild(resultPage);

const style = document.createElement("style");
style.textContent = `
  #final-outfit-page {
    position: fixed;
    inset: 0;
    z-index: 99999;
    overflow-y: auto;
    background: #fffaf8;
    color: #754b59;
    font-family: inherit;
  }

  #final-outfit-page.hidden {
    display: none !important;
  }

  .final-header {
    text-align: center;
    padding: 26px 18px 30px;
    background: #fae4e9;
  }

  .final-back {
    display: block;
    margin: 0 auto 28px;
    padding: 10px 16px;
    border: 1px solid #eab8c9;
    border-radius: 30px;
    background: white;
    color: #a65376;
    cursor: pointer;
  }

  .final-kicker {
    letter-spacing: 3px;
    font-size: 11px;
  }

  .final-header h1 {
    font-size: clamp(25px, 5vw, 40px);
    margin: 10px 0;
  }

  .final-header p {
    line-height: 1.7;
  }

  .final-content {
    max-width: 1050px;
    padding: 26px 18px 50px;
    margin: auto;
    text-align: center;
  }

  #final-count {
    margin-bottom: 22px;
  }

  #final-outfit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 18px;
    text-align: left;
  }

  .final-outfit-card {
    overflow: hidden;
    background: white;
    border: 1px solid #f1d5df;
    border-radius: 16px;
    box-shadow: 0 5px 18px #b75d7812;
  }

  .final-outfit-card img {
    display: block;
    width: 100%;
    height: 225px;
    object-fit: cover;
    background: #fae4e9;
  }

  .final-outfit-info {
    padding: 12px;
  }

  .final-outfit-info h3 {
    margin: 0 0 6px;
    font-size: 15px;
  }

  .final-outfit-info p {
    margin: 0;
    color: #987f89;
    font-size: 13px;
  }

  .final-love {
    margin: 28px 0;
    line-height: 1.8;
  }

  .final-share {
    border: 0;
    border-radius: 30px;
    padding: 13px 22px;
    background: #ff8ea1;
    color: white;
    font-size: 14px;
    cursor: pointer;
  }

  @media(max-width:420px) {
    #final-outfit-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .final-outfit-card img {
      height: 175px;
    }
  }
`;
document.head.appendChild(style);

function renderWardrobe() {
  const items = outfits.filter(item =>
    category === "semua" || item.category === category
  );

  count.textContent = `${items.length} barang`;

  wardrobe.innerHTML = items.map(item => {
    const active = chosen.includes(item.id);

    return `
      <article class="outfit-card">
        <div class="photo-wrap">
          <img src="${getPhoto(item)}" alt="${item.name}" loading="lazy">
          <div class="photo-error">
            Foto belum ditemukan.<br>Periksa nama file di folder images.
          </div>
          <button class="favorite ${active ? "chosen" : ""}"
            data-id="${item.id}" aria-label="Pilih ${item.name}">
            ${active ? "♥" : "♡"}
          </button>
        </div>
        <div class="card-info">
          <h3>${item.name}</h3>
          <p>${categoryNames[item.category]}</p>
          <button class="choose ${active ? "chosen" : ""}" data-id="${item.id}">
            ${active ? "Dipilih ♥" : "Aku pilih ini ♡"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  wardrobe.querySelectorAll(".photo-wrap img").forEach(img => {
    img.addEventListener("error", () => {
      img.classList.add("broken");
      img.nextElementSibling.classList.add("show");
    });
  });

  wardrobe.querySelectorAll("[data-id]").forEach(button => {
    button.addEventListener("click", () => {
      toggleChoice(Number(button.dataset.id));
    });
  });
}

function toggleChoice(id) {
  chosen = chosen.includes(id)
    ? chosen.filter(itemId => itemId !== id)
    : [...chosen, id];

  saveChoices();
  renderWardrobe();
  renderSelection();
}

function renderSelection() {
  const items = outfits.filter(item => chosen.includes(item.id));

  selectionText.textContent = items.length
    ? `Ada ${items.length} barang pilihan Sholah. ♡`
    : "Belum ada pilihan, sayang.";

  selectedItems.innerHTML = items.map(item =>
    `<span class="chip">${item.name}</span>`
  ).join("");
}

/* Tombol menuju halaman hasil */
function showFinalPage() {
  if (!chosen.length) {
    alert("Pilih outfit dulu ya, Sholah ♡");
    return;
  }

  const items = outfits.filter(item => chosen.includes(item.id));
  const grid = document.getElementById("final-outfit-grid");

  document.getElementById("final-count").textContent =
    `${items.length} outfit pilihan Sholah ♡`;

  grid.innerHTML = items.map(item => `
    <article class="final-outfit-card">
      <img src="${getPhoto(item)}" alt="${item.name}">
      <div class="final-outfit-info">
        <h3>${item.name}</h3>
        <p>${categoryNames[item.category]}</p>
      </div>
    </article>
  `).join("");

  document.getElementById("final-outfit-page").classList.remove("hidden");
}

function addFinishButton() {
  if (document.getElementById("finish-outfits")) return;

  const button = document.createElement("button");
  button.id = "finish-outfits";
  button.type = "button";
  button.textContent = "Selesai Memilih ♡";
  button.style.cssText =
    "display:block;margin:24px auto;padding:14px 24px;border:0;border-radius:30px;background:#ff8ea1;color:white;cursor:pointer;font-size:15px;";

  button.addEventListener("click", showFinalPage);

  selectedItems.parentElement.appendChild(button);
}

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
  document.getElementById("wardrobe-page").classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
});

document.getElementById("back-home").addEventListener("click", () => {
  document.getElementById("wardrobe-page").classList.add("hidden");
  document.getElementById("welcome").classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
});

document.getElementById("clear-button").addEventListener("click", () => {
  chosen = [];
  saveChoices();
  renderWardrobe();
  renderSelection();
});

document.getElementById("share-button").addEventListener("click", () => {
  const items = outfits.filter(item => chosen.includes(item.id));

  if (!items.length) {
    alert("Pilih minimal satu barang dulu, yaa ♡");
    return;
  }

  const message =
    "Hai Salsa, ini pilihan outfit dari Sholah ♡\n\n" +
    items.map(item => `♥ ${item.name} — ${categoryNames[item.category]}`).join("\n") +
    "\n\nSemoga kamu suka pilihanku, sayang! ♡";

  window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
});

document.getElementById("final-back").addEventListener("click", () => {
  document.getElementById("final-outfit-page").classList.add("hidden");
});

document.getElementById("final-share").addEventListener("click", () => {
  const items = outfits.filter(item => chosen.includes(item.id));
  const message =
    "Hai Salsa, ini outfit pilihan Sholah ♡\n\n" +
    items.map(item => `♥ ${item.name} — ${categoryNames[item.category]}`).join("\n") +
    "\n\nDari Sholah, dengan cinta ♡";

  window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
});

renderWardrobe();
renderSelection();
addFinishButton();
