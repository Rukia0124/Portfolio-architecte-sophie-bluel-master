document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let myHeaders = new Headers({
      accept: "application/json",
      "Content-Type": "application/json",
    });

    let myBody = JSON.stringify({
      email: email,
      password: password,
    });

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: myHeaders,
      body: myBody,
      credentials: "same-origin",
    })
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
