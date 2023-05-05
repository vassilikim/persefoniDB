import { showAlert } from "./alerts.js";

const getDelayedUsers = async (first_name, last_name, delay) => {
  try {
    if (!first_name) first_name = "";
    if (!last_name) last_name = "";
    if (!delay) delay = "";

    const res = await axios({
      method: "GET",
      url: `/api/library/school-admin/users-delayed-lending?first_name=${first_name}&last_name=${last_name}&delay=${delay}`,
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const delayedList = document.getElementById("admin-card");

function renderDelayedUsers(rets) {
  delayedList.innerHTML = "";
  rets.forEach((ret) => {
    const retDiv = document.createElement("div");
    const username = document.createElement("h3");
    const full_name = document.createElement("h3");

    retDiv.className = "schOfone";
    username.innerHTML = `<strong>Username: </strong>${ret.username}`;
    full_name.innerHTML = `<strong>Full Name: </strong>${ret.full_name}`;

    retDiv.appendChild(username);
    retDiv.appendChild(full_name);
    delayedList.appendChild(retDiv);
  });
}

renderDelayedUsers(await getDelayedUsers(null, null, null));

const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const delay = document.getElementById("delay").value;

  renderDelayedUsers(await getDelayedUsers(first_name, last_name, delay));
});
