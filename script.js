
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

  selectedItems.innerHTML = items.length
    ? items.map(item => `
      <article class="selected-card">
        <img
          src="${imagePath(item)}"
          alt="${item.name}"
          loading="lazy"
        >
        <div class="selected-info">
          <strong>${item.name}</strong>
          <span>${categoryNames[item.category]}</span>
          <button
            type="button"
            class="remove-choice"
            data-remove="${item.id}"
          >Hapus pilihan</button>
        </div>
      </article>
    `).join("")
    : `<p class="empty-selection">
        Pilihan outfit Sholah akan muncul di sini ♡
      </p>`;

  selectedItems.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.classList.add("image-missing");
      img.alt = "Foto tidak ditemukan: " + img.alt;
    });
  });

  selectedItems.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      toggleChoice(Number(button.dataset.remove));
    });
  });
}

function injectSelectionStyles() {
  const style = document.createElement("style");
  style.textContent = `
    #selected-items.selected-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
      gap: 16px;
      margin: 20px 0;
      text-align: left;
    }

    .selected-card {
      overflow: hidden;
      border: 1px solid #efceda;
      border-radius: 16px;
      background: white;
      box-shadow: 0 4px 14px #a6537612;
    }

    .selected-card img {
      display: block;
      width: 100%;
      height: 190px;
      object-fit: cover;
      background: #fae4e9;
    }

    .selected-card img.image-missing {
      height: 80px;
      object-fit: contain;
      padding: 10px;
    }

    .selected-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
    }

    .selected-info strong {
      color: #a65376;
      font-size: 14px;
    }

    .selected-info span {
      color: #987f89;
      font-size: 12px;
    }

    .remove-choice {
      padding: 8px;
      border: 0;
      border-radius: 9px;
      background: #fff0f4;
      color: #a65376;
      cursor: pointer;
    }

    .empty-selection {
      grid-column: 1 / -1;
      text-align: center;
      padding: 20px 5px;
      color: #987f89;
    }

    @media (max-width: 400px) {
      #selected-items.selected-items {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .selected-card img {
        height: 155px;
      }
    }
  `;

  document.head.appendChild(style);
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

  renderWardrobe();
  renderSelection();

  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("back-home").addEventListener("click", () => {
  document.getElementById("wardrobe-page").classList.add("hidden");
  document.getElementById("welcome").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    items.map(item =>
      `♥ ${item.name} — ${categoryNames[item.category]}`
    ).join("\n") +
    "\n\nSemoga kamu suka pilihanku, sayang! ♡";

  window.open(
    "https://wa.me/?text=" + encodeURIComponent(message),
    "_blank"
  );
});

injectSelectionStyles();
renderWardrobe();
renderSelection();
