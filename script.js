const menu = document.querySelector(".city-menu");
const cityLabel = document.querySelector("[data-current-city]");
const studioGrid = document.querySelector("[data-studio-grid]");
const cityLinks = [...document.querySelectorAll("[data-city-choice]")];
const bookingLinks = [...document.querySelectorAll("[data-book-jump]")];
const priceLink = document.querySelector("[data-full-price]");
const priceLabel = priceLink.querySelector("span");
const studios = [...studioGrid.querySelectorAll("[data-studio]")];
const storageKey = "lasermax-city";
let selectedCity = "";

function getStoredCity() {
  try {
    return window.localStorage.getItem(storageKey) ?? "";
  } catch {
    return "";
  }
}

function rememberCity(city) {
  try {
    window.localStorage.setItem(storageKey, city);
  } catch {
    // The current selection still works if the browser blocks storage.
  }
}

function selectCity(city) {
  const studio = studios.find((item) => item.id === city);
  if (!studio || selectedCity === city) return;

  selectedCity = city;
  const name = studio.querySelector("h3").textContent;
  cityLabel.textContent = name;
  priceLink.href = studio.querySelector("[data-studio-price]").href;
  priceLabel.textContent = "Полный прайс · " + name;

  for (const link of bookingLinks) link.hash = city;
  for (const link of cityLinks) {
    if (link.hash === "#" + city) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  }
  for (const item of studios) {
    item.classList.toggle("is-selected", item === studio);
    studioGrid.append(item);
  }
  studioGrid.prepend(studio);
  rememberCity(city);
  return studio;
}

function selectCityFromHash() {
  const hash = window.location.hash;
  const studio = selectCity(hash.slice(1));
  if (!studio) return;

  // The browser may already have jumped to the card's former position.
  requestAnimationFrame(() => {
    if (window.location.hash === hash) studio.scrollIntoView({ block: "start" });
  });
}

for (const link of cityLinks) {
  link.addEventListener("click", (event) => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    selectCity(link.hash.slice(1));
    menu.open = false;
  });
}

menu.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.open) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});

document.addEventListener("click", (event) => {
  if (menu.open && !menu.contains(event.target)) menu.open = false;
});

selectCityFromHash();
if (!selectedCity) selectCity(getStoredCity());
window.addEventListener("hashchange", selectCityFromHash);
