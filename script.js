
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

let chosen = JSON.parse(localStorage.getItem("sholahOutfitChoices") || "[]");
let category = "semua";

const imagePath = (item) =>
  `images/${encodeURIComponent(item.image)}`;

function saveChoices() {
  localStorage.setItem("sholahOutfitChoices", JSON.stringify(chosen));
}

function renderWardrobe() {
  if (!wardrobe) return;

  const items = category === "semua"
    ? outfits
    : outfits.filter(item => item.category === category);

  wardrobe.innerHTML = items.map(item => `
    <article class="outfit-card ${chosen.includes(item.id) ? "is-selected" : ""}">
      <img
        src="${imagePath(item)}"
        alt="${item.name}"
        loading="lazy"
        onerror="this.alt='Foto tidak ditemukan'; this.style.minHeight='180px';"
      >
      <div class="outfit-info">
        <h3>${item.name}</h3>
        <p>${categoryNames[item.category] || item.category}</p>
        <button
          type="button"
          class="choose-btn"
          data-id="${item.id}"
        >
          ${chosen.includes(item.id) ? "✓ Dipilih" : "Pilih Outfit"}
        </button>
      </div>
    </article>
  `).join("");

  if (count) {
    count.textContent = `${chosen.length} outfit dipilih`;
  }

  wardrobe.querySelectorAll(".choose-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);

      if (chosen.includes(id)) {
        chosen = chosen.filter(itemId => itemId !== id);
      } else {
        chosen.push(id);
      }

      saveChoices();
      renderWardrobe();
      renderSelection();
    });
  });
}

function renderSelection() {
  if (!selectedItems) return;

  const items = outfits.filter(item => chosen.includes(item.id));

  if (selectionText) {
    selectionText.textContent = items.length
      ? `Ada ${items.length} barang pilihan Sholah. ♡`
      : "Belum ada pilihan, sayang.";
  }

  selectedItems.innerHTML = items.length
    ? items.map(item => `
      <article class="selected-card">
        <img
          src="${imagePath(item)}"
          alt="${item.name}"
          loading="lazy"
          onerror="this.alt='Foto tidak ditemukan';"
        >
        <div class="selected-card-info">
          <strong>${item.name}</strong>
          <span>${categoryNames[item.category] || item.category}</span>
          <button
            type="button"
            class="remove-choice"
            data-id="${item.id}"
          >Hapus pilihan</button>
        </div>
      </article>
    `).join("")
    : `<p class="empty-selection">Pilihan outfit Sholah akan muncul di sini ♡</p>`;

  selectedItems.querySelectorAll(".remove-choice").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      chosen = chosen.filter(itemId => itemId !== id);
      saveChoices();
      renderWardrobe();
      renderSelection();
    });
  });
}

function injectSelectionStyles() {
  if (document.getElementById("selection-photo-styles")) return;

  const style = document.createElement("style");
  style.id = "selection-photo-styles";
  style.textContent = `
    .selected-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
      gap: 16px;
      width: 100%;
      margin-top: 18px;
    }

    .selected-card {
      overflow: hidden;
      border: 1px solid #f3d5dc;
      border-radius: 16px;
      background: #fffaf8;
      box-shadow: 0 4px 12px rgba(120, 60, 70, 0.08);
    }

    .selected-card img {
      display: block;
      width: 100%;
      height: 175px;
      object-fit: cover;
      background: #fae4d9;
    }

    .selected-card-info {
      display: flex;
      flex-direction: column;
      gap: 7px;
      padding: 12px;
    }

    .selected-card-info strong {
      color: #704b53;
      font-size: 14px;
    }

    .selected-card-info span {
      color: #9b777d;
      font-size: 12px;
    }

    .remove-choice {
      border: none;
      border-radius: 9px;
      padding: 8px;
      background: #ff8ea1;
      color: white;
      cursor: pointer;
      font: inherit;
      font-size: 12px;
    }

    .empty-selection {
      grid-column: 1 / -1;
      color: #9b777d;
      text-align: center;
      padding: 20px 8px;
    }

    .outfit-card.is-selected {
      outline: 2px solid #ff8ea1;
      border-radius: 16px;
    }
  `;

  document.head.appendChild(style);
}

function filterCategory(newCategory) {
  category = newCategory;
  renderWardrobe();

  document.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === category
    );
  });
}

function clearChoices() {
  chosen = [];
  saveChoices();
  renderWardrobe();
  renderSelection();
}

function shareToWhatsApp() {
  const items = outfits.filter(item => chosen.includes(item.id));

  if (!items.length) {
    alert("Pilih outfit dulu ya, Sholah ♡");
    return;
  }

  const message = [
    "Halo, Salsa! ♡",
    "Ini outfit yang aku pilih dari Little Wardrobe:",
    "",
    ...items.map((item, index) =>
      `${index + 1}. ${item.name} (${categoryNames[item.category] || item.category})`
    ),
    "",
    "Sudah aku pilih khusus buat kamu ♡"
  ].join("\n");

  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    filterCategory(button.dataset.category);
  });
});

document.querySelectorAll("[data-clear]").forEach(button => {
  button.addEventListener("click", clearChoices);
});

document.querySelectorAll("[data-share]").forEach(button => {
  button.addEventListener("click", shareToWhatsApp);
});

document.querySelectorAll("[data-show-wardrobe]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("home")?.classList.add("hidden");
    document.getElementById("wardrobe-section")?.classList.remove("hidden");
    renderWardrobe();
    renderSelection();
  });
});

document.querySelectorAll("[data-show-home]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("wardrobe-section")?.classList.add("hidden");
    document.getElementById("home")?.classList.remove("hidden");
  });
});

injectSelectionStyles();
renderWardrobe();
renderSelection();
