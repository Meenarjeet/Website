const productNames = [
  "Tesa 4965 Red Polyester Tape",
  "Tesa 62510 PE Foam Tape",
  "Tesa 4965 paper liner",
  "Tesa 63610 tape",
  "Lohmann 57006 tape",
  "3M GPT020 Tape",
  "3M 5011 Tape",
  "3M GPH-110GF Tape",
  "Masking Tape",
  "Tissue Tape",
  "Cloth Tape",
  "Red Polyester Tape",
  "Eva Foam Tape",
  "VHB Tape",
  "BOPP Tape",
  "Duct Tape",
  "3M Primer",
  "Pet Strap",
  "Green Foam Tape",
  "Cell Alignment Tape",
  "Stretch Film",
  "Fragile Tape",
  "Lohmann Foam Tape"
];

const TAPE_COUNT = productNames.length;
const IMAGE_ENDINGS = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"];
const fallbackColors = ["#E3C98F", "#7D8A92", "#C9A46A", "#9CC3D5", "#2B2B2B", "#B8C2C8", "#F2B705", "#D64545"];

const tapes = productNames.map((name, index) => {
  const tapeNumber = index + 1;
  return {
    name: name,
    category: "Tapes",
    color: fallbackColors[index % fallbackColors.length],
    image: "tapes/tape" + tapeNumber,
    isBestSeller: [2, 4, 5, 14, 17, 18].includes(tapeNumber)
  };
});

function tryNextImage(img) {
  const base = img.dataset.base;
  const next = Number(img.dataset.try || 0) + 1;
  if (base && next < IMAGE_ENDINGS.length) {
    img.dataset.try = next;
    img.src = base + IMAGE_ENDINGS[next];
  } else {
    const roll = document.createElement("div");
    roll.className = "roll";
    img.replaceWith(roll);
  }
}

const grid        = document.getElementById("product-grid");
const emptyMsg    = document.getElementById("empty");
const searchBox   = document.getElementById("search");
const filterBar   = document.getElementById("filters");

let currentCategory = "Tapes";

function makeCard(tape) {
  let art = `<div class="roll"></div>`;
  if (tape.image) {
    const hasEnding = /\.\w+$/.test(tape.image);
    const src = hasEnding ? tape.image : tape.image + IMAGE_ENDINGS[0];
    const base = hasEnding ? "" : tape.image;
    art = `<img src="${src}" data-base="${base}" data-try="0" alt="${tape.name}" loading="lazy" onerror="tryNextImage(this)">`;
  }
  
  const badgeHTML = tape.isBestSeller ? `<span class="badge">Best seller</span>` : '';

  return `
    <article class="card" style="--card-color:${tape.color}">
      <div class="card-art">
        ${badgeHTML}
        ${art}
        <span class="card-name">${tape.name}</span>
      </div>
    </article>`;
}

function showTapes() {
  const word = searchBox.value.trim().toLowerCase();

  const visible = tapes.filter(t => {
    const matchesCategory = t.category === currentCategory;
    const matchesSearch   = t.name.toLowerCase().includes(word);
    return matchesCategory && matchesSearch;
  });

  let gridHTML = visible.map(makeCard).join("");
  
  gridHTML += `
    <article class="card" style="--card-color: var(--tape);">
      <div class="card-art" style="padding: 1.5rem; text-align: center; background: var(--paper); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 1;">
        <p style="font-size: 1.05rem; font-weight: 700; color: var(--blue); margin-bottom: 1rem; line-height: 1.4;">
          looking for a specific product contact us we might have it!!
        </p>
        <a href="#contact" class="btn" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">Contact Us</a>
      </div>
    </article>`;

  grid.innerHTML = gridHTML;
  emptyMsg.hidden = visible.length > 0;
}

filterBar.addEventListener("click", event => {
  const button = event.target.closest(".filter");
  if (!button) return;

  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  currentCategory = button.dataset.category;
  showTapes();
});

searchBox.addEventListener("input", showTapes);

document.getElementById("year").textContent = new Date().getFullYear();
showTapes();