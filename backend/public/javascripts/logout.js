import { showAlert } from "./alerts.js";

const logout = async () => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/library/auth/logout",
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const logoutBtn = document.getElementById("logout-button");

logoutBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  await logout();
});
