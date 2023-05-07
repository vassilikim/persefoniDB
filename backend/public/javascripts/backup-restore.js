import { showAlert } from "./alerts.js";

const backup = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/super-admin/backup",
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const restore = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/super-admin/restore",
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const backupBtn = document.getElementById("backup");

backupBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  await backup();
});

const restoreBtn = document.getElementById("restore");

restoreBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  await restore();
});
