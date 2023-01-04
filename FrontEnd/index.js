const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

let galleryData = [];
let filteredGalleryData = [];

async function fetchGallery() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (galleryData = data));
  filtersDisplay();
  worksDisplay(galleryData);
}
function worksDisplay(data) {
  gallery.innerHTML = data
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
    <button class="filter">${filter}</button>
    `
    )
    .join("");
  addFilterListener();
}
function addFilterListener() {
  let filter = document.querySelectorAll(".filter");
  for (let i = 0; i < filter.length; i++) {
    filter[i].addEventListener("click", (e) => {
      const selectedFilter = e.target.innerText;
      const filteredGalleryData = galleryData.filter(
        (work) => work.category.name === selectedFilter
      );
      if (selectedFilter === "Tous") {
        worksDisplay(galleryData);
      } else {
        worksDisplay(filteredGalleryData);
      }
    });
  }
}

window.addEventListener("load", (event) => {
  fetchGallery();
});
