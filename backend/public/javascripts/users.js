import { showAlert } from "./alerts.js";

const getUsers = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/users/teachers-students",
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const deleteUser = async (username) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/library/users/delete`,
      data: {
        username,
      },
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/users");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const deactivateUser = async (username) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/library/users/deactivate`,
      data: {
        username,
      },
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/users");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const userList = document.getElementById("sch-card");

function renderUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    const buttonInfo = document.createElement("button");
    const buttonDel = document.createElement("button");
    const username = document.createElement("h3");
    const first_name = document.createElement("h3");
    const last_name = document.createElement("h3");
    const birth_date = document.createElement("h3");
    const role = document.createElement("h3");
    const status = document.createElement("h3");

    userDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Deactivate";
    buttonInfo.dataset.username = user.username;
    buttonDel.className = "sch-delete";
    buttonDel.textContent = "Delete";
    buttonDel.dataset.username = user.username;
    buttonDel.onclick = function () {
      confirmDelete(buttonDel.dataset.username);
    };
    username.innerHTML = `<strong>Username: </strong>${user.username}`;
    first_name.innerHTML = `<strong>First Name: </strong>${user.first_name}`;
    last_name.innerHTML = `<strong>Last Name: </strong>${user.last_name}`;
    birth_date.innerHTML = `<strong>Birth Date: </strong>${
      user.birth_date.split("T")[0]
    }`;
    role.innerHTML = `<strong>Role: </strong>${user.user_role}`;
    status.innerHTML = `<strong>Status: </strong>${
      user.verified.data[0] == 0 ? "not verified" : "verified"
    }`;

    if (user.verified.data == 1) userDiv.appendChild(buttonInfo);
    userDiv.appendChild(buttonDel);
    userDiv.appendChild(username);
    userDiv.appendChild(first_name);
    userDiv.appendChild(last_name);
    userDiv.appendChild(birth_date);
    userDiv.appendChild(role);
    userDiv.appendChild(status);
    userList.appendChild(userDiv);
  });
}

renderUsers(await getUsers());

const deactivateUserBtns = document.querySelectorAll(".sch-edit");

deactivateUserBtns.forEach((deactivateUserBtn) => {
  deactivateUserBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    await deactivateUser(deactivateUserBtn.dataset.username);
  });
});

async function confirmDelete(username) {
  if (confirm("Are you sure you want to delete this user?")) {
    await deleteUser(username);
  } else {
  }
}
