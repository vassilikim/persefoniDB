import { showAlert } from "./alerts.js";

const login = async (username, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/library/auth/login",
      data: {
        username,
        password,
      },
    });

    console.log(res);

    if (res.status == 200) {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/super-admin");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const loginForm = document.getElementById("form-login");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await login(username, password);
});
