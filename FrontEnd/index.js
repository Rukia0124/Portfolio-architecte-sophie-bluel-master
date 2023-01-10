const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

let galleryData = [];
let filteredGalleryData = [];

async function fetchGallery() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (galleryData = data));
  // const storeGallery = JSON.stringify(galleryData);
  // window.localStorage.setItem("gallery", storeGallery);

  filtersDisplay();
  worksDisplay(galleryData);
}
// function localFetch() {
//   let localGallery = window.localStorage.getItem("gallery");
//   if (localGallery === null) {
//     fetchGallery();
//   } else {
//     localGallery = JSON.parse(localGallery);
//     galleryData = localGallery;
//     filtersDisplay();
//     worksDisplay(galleryData);
//   }
// }

function worksDisplay(data) {
  //   gallery.innerHTML = data
  //     .map(
  //       (work) =>
  //         `
  //       <figure>
  //       <img src=${work.imageUrl} crossorigin="anonymous" alt=${work.title}>
  //       <figcaption>${work.title}</figcaption>
  //     </figure>
  // `
  //     )
  //     .join("");

  for (let i = 0; i < galleryData.length; i++) {
    const workElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const titleElement = document.createElement("figcaption");
    imageElement.src = data[i].imageUrl;
    imageElement.alt = data[i].title;
    imageElement.crossOrigin = "anonymous";
    titleElement.innerText = data[i].title;
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
    gallery.appendChild(workElement);
  }
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
let login = document.querySelector("#login");
login.addEventListener("click", (e) => {
  navigateToLoginPage();
});

function navigateToLoginPage() {
  window.location = "login.html";
}
window.addEventListener("load", (event) => {
  // localFetch();
  fetchGallery();
  checkCookie();
});

function checkCookie() {
  let token = getCookie("access_token");
  console.log("test", token);
  if (token) {
    document.getElementById("modify-btn").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "block";
  } else {
    document.getElementById("modify-btn").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("logout").style.display = "none";
  }
}

function getCookie(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  console.log(value);
  if (parts.length == 2) return parts.pop().split(";").shift();
}
// window.onload = checkCookie();

window.addEventListener("unload", function (event) {});

document.getElementById("logout").addEventListener("click", function () {
  document.cookie = "access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.reload();
});
