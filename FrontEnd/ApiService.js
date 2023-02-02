const URL_API = "http://localhost:5678/api/";

export default class ApiService {
  getGallery() {
    return fetch(URL_API + "works/").then((res) => res.json());
  }

  getCategories() {
    return fetch(URL_API + "categories").then((res) => res.json());
  }

  deleteWork(itemId) {
    if (!this.isConnected()) {
      return false;
    }

    let token = this.getToken();
    return fetch(URL_API + "works/" + itemId, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: "Bearer " + token,
      },
    });
  }

  addWork(formData) {
    let postHeaders = new Headers({
      accept: "application/json",
      Authorization: "Bearer " + this.getToken(),
    });
    return fetch(URL_API + "works/", {
      method: "POST",
      headers: postHeaders,
      body: formData,
      redirect: "manual",
    }).then((response) => response.json());
  }

  isConnected() {
    if (!this.getToken()) {
      return false;
    } else {
      return true;
    }
  }

  getToken() {
    let value = "; " + document.cookie;
    let parts = value.split("; access_token=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

  login(email, password) {
    let myHeaders = new Headers({
      accept: "application/json",
      "Content-Type": "application/json",
    });

    let myBody = JSON.stringify({
      email: email,
      password: password,
    });

    return fetch(URL_API + "users/login", {
      method: "POST",
      headers: myHeaders,
      body: myBody,
      credentials: "same-origin",
    });
  }
}
