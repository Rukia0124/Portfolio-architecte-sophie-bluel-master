import ApiService from "./ApiService.js";
const Api = new ApiService();

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    Api.login(email, password)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            document.cookie = "access_token=" + data.token;
            window.location = "index.html";
            document.querySelector(".error").style = "display:none";
          });
        } else {
          document.querySelector(".error").style = "display:block";
        }
      })
      .catch(function (error) {
        console.error("erreur connexion:" + error);
      });
  });
