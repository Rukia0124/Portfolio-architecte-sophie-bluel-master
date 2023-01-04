const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
let galleryData = [];

async function fetchGallery() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (galleryData = data));
  filtersDisplay();
  worksDisplay();
}
function worksDisplay() {
  gallery.innerHTML = galleryData
    .map(
      (work) =>
        `
      <figure>
      <img src=${work.imageUrl} crossorigin="anonymous" alt=${work.title}>
      <figcaption>${work.title}</figcaption>
    </figure>
`
    )
    .join("");
}
function filtersDisplay() {
  let filtersData = new Set();
  filtersData.add("Tous");
  galleryData.forEach((filter) => {
    filtersData.add(filter.category.name);
  });
  const filtersArray = Array.from(filtersData);
  filters.innerHTML = filtersArray
    .map(
      (filter) => `
    <button id="filter">${filter}</button>
    `
    )
    .join("");
}

window.addEventListener("load", (event) => {
  fetchGallery();
});
