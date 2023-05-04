import { showAlert } from "./alerts.js";

const changePassword = async (old_password, new_password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/library/auth/changepassword",
      data: {
        old_password,
        new_password
      },
    });


    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const changePasswordForm = document.getElementById("password-form");

changePasswordForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const old_password = document.getElementById("current-password").value;
  const new_password = document.getElementById("new-password").value;
  const confirm_password = document.getElementById("confirm-password").value;

  if (new_password != confirm_password) {
    showAlert("error", "New password and confirm password must match.")
  } else {
    await changePassword(old_password, new_password);
  }
});
