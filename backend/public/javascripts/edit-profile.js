import { showAlert } from "./alerts.js";

const getProfile = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/users/account",
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const editProfile = async (username, first_name, last_name, birth_date) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/library/users/account",
      data: {
        username,
        first_name,
        last_name,
        birth_date
      },
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.assign("/profile");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const birth_date = document.getElementById("birth_date").value;

  await editProfile(username, first_name, last_name, birth_date);
});


function renderAccount(info) {
    const firstName = document.getElementById("first_name");
    const lastName = document.getElementById("last_name");
    const username = document.getElementById("username");
    const birthDate = document.getElementById("birth_date");

    console.log(info);

    firstName.value = info.first_name;
    lastName.value = info.last_name;
    username.value = info.username;
    birthDate.value = info.birth_date;
}

  renderAccount(await getProfile());


