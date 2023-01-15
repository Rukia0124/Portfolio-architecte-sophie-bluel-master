const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

let galleryData = [];
let filteredGalleryData = [];
let modal = null;

async function fetchGallery() {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (galleryData = data));
  // const storeGallery = JSON.stringify(galleryData);
  // window.localStorage.setItem("gallery", storeGallery);

  filtersDisplay();
  worksDisplay(galleryData);
  modalDisplay(galleryData);
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
  // gallery.innerHTML = data
  //   .map(
  //     (work) =>
  //       `
  //       <figure>
  //       <img src=${work.imageUrl} crossorigin="anonymous" alt=${work.title}>
  //       <figcaption>${work.title}</figcaption>
  //     </figure>
  // `
  //   )
  //   .join("");

  gallery.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
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
  modalDisplay();
});

function checkCookie() {
  let token = getCookie("access_token");
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
  if (parts.length == 2) return parts.pop().split(";").shift();
}

document.getElementById("logout").addEventListener("click", function () {
  document.cookie = "access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.reload();
});

// MODAL

function modalDisplay(data) {
  for (let i = 0; i < galleryData.length; i++) {
    const editGallery = document.getElementById("edit-gallery");
    const article = document.createElement("article");
    const imageElement = document.createElement("img");
    const titleElement = document.createElement("figcaption");
    const deleteIcon = document.createElement("i");
    const deleteWork = document.createElement("span");
    article.id = "editwork";
    deleteWork.id = "deletework";
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteIcon.id = data[i].id;
    imageElement.src = data[i].imageUrl;
    imageElement.alt = data[i].title;
    imageElement.crossOrigin = "anonymous";
    titleElement.innerText = "éditer";
    titleElement.id = "img" + data[i].id;
    editGallery.appendChild(article);
    article.appendChild(imageElement);
    article.appendChild(titleElement);
    article.appendChild(deleteWork);
    deleteWork.appendChild(deleteIcon);

    deleteWork.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Êtes-vous sûr de vouloir supprimer le projet ?")) {
        self.deleteWork(e);
      }
    });
  }
}

let closeModalEventAdded = false;
let closeModalCloseEventAdded = false;
let stopPropagationEventAdded = false;

function openModal(e) {
  e.preventDefault();
  const target = document.querySelector("#modifymodal");
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.querySelector("#closemodal").addEventListener("click", closeModal);
  closeModalCloseEventAdded = true;
  modal.addEventListener("click", closeModal);
  closeModalEventAdded = true;
  modal
    .querySelector(".modal-wrapper")
    .addEventListener("click", stopPropagation);
  stopPropagationEventAdded = true;
}
const modifyBtn = document.querySelector(".modify-btn");
modifyBtn.addEventListener("click", (e) => {
  openModal(e);
});

function closeModal(e) {
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  if (closeModalEventAdded) {
    modal.removeEventListener("click", closeModal);
    closeModalEventAdded = false;
  }
  if (closeModalCloseEventAdded) {
    modal.querySelector("#closemodal").removeEventListener("click", closeModal);
    closeModalCloseEventAdded = false;
  }
  if (stopPropagationEventAdded) {
    modal
      .querySelector(".modal-wrapper")
      .removeEventListener("click", stopPropagation);
    stopPropagationEventAdded = false;
  }
  modal = null;
}
function stopPropagation(e) {
  e.stopPropagation();
}
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  } else {
    return;
  }
});

// DELETE GALLERY

const deleteAllBtn = document.querySelector("#deleteGallery");

deleteAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("Êtes-vous sûr de vouloir supprimer la galerie ?")) {
    deleteGallery();
  }
});

async function deleteGallery(e) {
  const token = getCookie("access_token");
  if (!token) {
    return console.log("User not authenticated");
  }

  for (i = 0; i < galleryData.length; i++) {
    await fetch("http://localhost:5678/api/works/" + galleryData[i].id, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log("Gallery deleted successfully");
        } else {
          console.log("Error while deleting the Gallery");
        }
      })
      .catch((err) => console.log("Error while deleting the Gallery", err));
  }
}
// DELETE WORKS
async function deleteWork(e) {
  const token = getCookie("access_token");
  if (!token) {
    return console.log("User not authenticated");
  }

  await fetch("http://localhost:5678/api/works/" + e.target.id, {
    method: "DELETE",
    headers: {
      accept: "*/*",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        console.log("Work deleted successfully");
      } else {
        console.log("Error while deleting the work");
      }
    })
    .catch((err) => console.log("Error while deleting the work", err));
}
// ADD WORK MODAL
let closeAddModalEventAdded = false;
let closeAddModalCloseEventAdded = false;

function openAddModal(e) {
  e.preventDefault();
  closeModal(e);
  const target = document.querySelector("#addmodal");
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal
    .querySelector("#closeaddmodal")
    .addEventListener("click", closeAddModal);
  closeAddModalCloseEventAdded = true;
  modal.addEventListener("click", closeAddModal);
  closeAddModalEventAdded = true;
  modal
    .querySelector(".modal-wrapper")
    .addEventListener("click", stopPropagation);
  stopPropagationEventAdded = true;
  modal.querySelector("#back").addEventListener("click", () => {
    closeAddModal(e), openModal(e);
  });
}

const addBtn = document.querySelector("#addWork");
addBtn.addEventListener("click", (e) => {
  openAddModal(e);
});

function closeAddModal(e) {
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  if (closeAddModalEventAdded) {
    modal.removeEventListener("click", closeAddModal);
    closeAddModalEventAdded = false;
  }
  if (closeAddModalCloseEventAdded) {
    modal
      .querySelector("#closeaddmodal")
      .removeEventListener("click", closeAddModal);
    closeAddModalCloseEventAdded = false;
  }
  if (stopPropagationEventAdded) {
    modal
      .querySelector(".modal-wrapper")
      .removeEventListener("click", stopPropagation);
    stopPropagationEventAdded = false;
  }
  modal = null;
}
function stopPropagation(e) {
  e.stopPropagation();
}
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeAddModal(e);
  } else {
    return;
  }
});

// ADD WORK

document.querySelector("#addWorkBtn").addEventListener("click", (e) => {
  e.preventDefault();
  addNewWork();
});

function addNewWork() {
  const workImgField = document.querySelector('input[type="file"]');
  const workTitleField = document.querySelector("#title");
  const workCatField = document.querySelector("#cat");

  let formData = new FormData();
  formData.append("title", workTitleField.value);
  formData.append("category", workCatField.value);
  formData.append("image", workImgField.files[0]);

  const token = getCookie("access_token");
  if (!token) {
    return console.log("User not authenticated");
  }

  let postHeaders = new Headers({
    accept: "application/json",
    Authorization: "Bearer " + token,
    // "Content-Type": "multipart/form-data",
  });

  fetch("http://localhost:5678/api/works/", {
    method: "POST",
    headers: postHeaders,
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// DRAG AND DROP
document
  .querySelector(".custom-input-container")
  .addEventListener("drop", (e) => {
    dropHandler(e);
  });

function dropHandler(e) {
  let fileInput = document.querySelector("#custom-input");
  console.log("File(s) dropped");
  e.preventDefault();

  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      fileInput.files = e.dataTransfer.files;
    });
  } else {
    [...e.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}
function dragOverHandler(e) {
  e.preventDefault();
}
