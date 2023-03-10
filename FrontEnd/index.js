import ApiService from "./ApiService.js";

const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const filter = document.querySelectorAll(".filter");
const Api = new ApiService();

let galleryData = [];
let filteredGalleryData = [];
let modal = null;
let categoryArray = [];

async function fetchGallery() {
  await Api.getGallery().then((data) => {
    galleryData = data;
  });
  await Api.getCategories().then((data) => {
    categoryArray = data;
  });
  filtersDisplay();
  worksDisplay(galleryData);
  modalDisplay(galleryData);
}

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
    workElement.classList = "img-" + data[i].id;
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
      filter.forEach((filter) => {
        filter.classList.remove("cat-active");
      });
      e.target.classList.add("cat-active");
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
  fetchGallery();
  checkCookie();
  modalDisplay();
});

function checkCookie() {
  if (Api.isConnected()) {
    document.getElementById("modify-btn").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "block";
  } else {
    document.getElementById("modify-btn").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("logout").style.display = "none";
  }
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
    const deleteWorkSpan = document.createElement("span");
    article.id = "editwork";
    article.classList = "img-" + data[i].id;
    deleteWorkSpan.id = "deletework";
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteIcon.id = data[i].id;
    imageElement.src = data[i].imageUrl;
    imageElement.alt = data[i].title;
    imageElement.crossOrigin = "anonymous";
    titleElement.innerText = "??diter";
    titleElement.id = "img" + data[i].id;
    editGallery.appendChild(article);
    article.appendChild(imageElement);
    article.appendChild(titleElement);
    article.appendChild(deleteWorkSpan);
    deleteWorkSpan.appendChild(deleteIcon);

    deleteWorkSpan.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("??tes-vous s??r de vouloir supprimer le projet ?")) {
        deleteWork(e);
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

function deleteDomImg(id) {
  let elementList = document.querySelectorAll(".img-" + id);
  elementList.forEach((elem, i) => {
    elem.remove();
  });
}

const deleteAllBtn = document.querySelector("#deleteGallery");

deleteAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("??tes-vous s??r de vouloir supprimer la galerie ?")) {
    deleteGallery();
  }
});

async function deleteGallery(e) {
  if (!Api.isConnected()) {
    return;
  }
  for (let i = 0; i < galleryData.length; i++) {
    await Api.deleteWork(galleryData[i].id)
      .then((res) => {
        if (res.ok) {
          deleteDomImg(galleryData[i].id);
          console.log("Gallery deleted successfully");
        } else {
          console.log("Error while deleting the Gallery");
        }
      })
      .catch((err) => console.log("Error while deleting the Gallery", err));
  }
  galleryData = [];
  filtersDisplay();
}
// DELETE WORKS
async function deleteWork(e) {
  if (!Api.isConnected) {
    return;
  }
  Api.deleteWork(e.target.id)
    .then((res) => {
      if (res.ok) {
        deleteDomImg(e.target.id);
        for (let i = 0; i < galleryData.length; i++) {
          if (galleryData[i].id == e.target.id) {
            galleryData.splice(i, 1);
          }
        }
        filtersDisplay();
        document.querySelector("#sucessDelete").style.display = "block";
        setTimeout(() => {
          document.querySelector("#sucessDelete").style.display = "none";
        }, "2000");
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

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeAddModal(e);
  } else {
    return;
  }
});

// ADD WORK

const workImgField = document.querySelector('input[type="file"]');
const sizeError = document.querySelector("#sizeError");
const workTitleField = document.querySelector("#title");
const workCatField = document.querySelector("#cat");
const emptyFieldError = document.querySelector("#emptyFieldError");

function keepLastFile() {
  while (workImgField.files.length > 1) {
    workImgField.files.pop();
  }
}

function checkFileSize() {
  if (workCatField.value === "" || workTitleField.value === "") {
    emptyFieldError.style.display = "block";
  } else if (workImgField.files.length === 0) {
    emptyFieldError.style.display = "block";
  } else if (
    workImgField.files[0] &&
    workImgField.files[0].size &&
    workImgField.files[0].size > 4194304
  ) {
    sizeError.style.display = "block";
  } else {
    sizeError.style.display = "none";
    emptyFieldError.style.display = "none";
    addNewWork();
  }
}
function addNewImg(id, title, image) {
  const newFigure = document.createElement("figure");
  const newImg = document.createElement("img");
  const newTitle = document.createElement("figcaption");
  const article = document.createElement("article");
  const deleteIcon = document.createElement("i");
  const deleteWorkSpan = document.createElement("span");
  const editGallery = document.getElementById("edit-gallery");
  const titleElement = document.createElement("figcaption");
  const miniImg = document.createElement("img");

  newFigure.classList = "img-" + id;
  newTitle.innerText = title;
  newImg.src = image;
  newImg.crossOrigin = "anonymous";
  gallery.appendChild(newFigure);
  newFigure.appendChild(newImg);
  newFigure.appendChild(newTitle);

  titleElement.innerText = "??diter";
  article.id = "editwork";
  article.classList = "img-" + id;
  deleteWorkSpan.id = "deletework";
  deleteIcon.id = id;
  deleteIcon.classList.add("fa-solid", "fa-trash-can");
  miniImg.crossOrigin = "anonymous";
  miniImg.src = image;
  editGallery.appendChild(article);
  article.appendChild(miniImg);
  article.appendChild(titleElement);
  article.appendChild(deleteWorkSpan);
  deleteWorkSpan.appendChild(deleteIcon);

  deleteWorkSpan.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("??tes-vous s??r de vouloir supprimer le projet ?")) {
      deleteWork(e);
    }
  });
}

function addNewWork() {
  const successAdd = document.querySelector("#successAdd");
  let formData = new FormData();
  formData.append("title", workTitleField.value);
  formData.append("category", workCatField.value);
  formData.append("image", workImgField.files[0]);

  if (!Api.isConnected) {
    return console.log("User not authenticated");
  }

  Api.addWork(formData)
    .then((data) => {
      successAdd.style.display = "block";
      for (let i = 0; i < categoryArray.length; i++) {
        if (categoryArray[i].id == data.categoryId) {
          data.category = categoryArray[i];
        }
      }
      galleryData.push(data);
      filtersDisplay();
      addNewImg(data.id, data.title, data.imageUrl);
      setTimeout(() => {
        successAdd.style.display = "none";
        document.querySelector("#addForm").reset();
        removePreviewImg();
      }, "3000");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return false;
}

document.querySelector("#addWorkBtn").addEventListener("click", (e) => {
  e.preventDefault();
  keepLastFile();
  checkFileSize();
});

let dragZone = document.querySelector(".custom-input-container");
dragZone.addEventListener("drop", (e) => {
  dropHandler(e);
});
dragZone.addEventListener("dragover", (e) => {
  dragOverHandler(e);
});

// PREVIEW IMG
const previewContainer = document.querySelector(".custom-input-container");
const preview = document.querySelector("#preview");
const fileLabel = document.querySelector("#fileLabel");
const maxSize = document.querySelector("#maxSize");
const imgI = document.querySelector("#imgI");
const delSpan = document.createElement("span");
const deleteIcon = document.createElement("i");
const input = document.querySelector(".custom-input");

input.addEventListener("change", (e) => {
  previewImg(e);
});

function previewImg(event) {
  preview.src = URL.createObjectURL(
    event.dataTransfer && event.dataTransfer.files[0]
      ? event.dataTransfer.files[0]
      : workImgField.files[0]
  );
  preview.style.position = "relative";

  deleteIcon.classList.add("fa-solid", "fa-trash-can");
  deleteIcon.style.position = "absolute";
  deleteIcon.style.display = "block";
  delSpan.append(deleteIcon);
  previewContainer.append(delSpan);
  fileLabel.style.display = "none";
  maxSize.style.display = "none";
  imgI.style.display = "none";
  preview.onload = function () {
    URL.revokeObjectURL(preview.src);
  };

  delSpan.addEventListener("click", removePreviewImg);
}
function removePreviewImg() {
  deleteIcon.style.display = "none";
  preview.src = "";
  fileLabel.style.display = "flex";
  maxSize.style.display = "block";
  imgI.style.display = "block";
}
// DRAG AND DROP
document
  .querySelector(".custom-input-container")
  .addEventListener("drop", (e) => {
    dropHandler(e);
  });

function dropHandler(e) {
  let fileInput = document.querySelector("#custom-input");
  e.preventDefault();
  previewImg(e);
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      fileInput.files = e.dataTransfer.files;
    });
  } else {
    [...e.dataTransfer.files].forEach((file, i) => {
      console.log(`??? file[${i}].name = ${file.name}`);
    });
  }
}

document
  .querySelector(".custom-input-container")
  .addEventListener("dragover", (e) => {
    dragOverHandler(e);
  });

function dragOverHandler(e) {
  e.preventDefault();
}
