const gallery = document.querySelector(".gallery");
let galleryData = [];
console.log(gallery);

async function fetchGallery() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (galleryData = data));

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
window.addEventListener("load", fetchGallery);
