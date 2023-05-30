import { showAlert } from "./alerts.js";

const getNotVerifiedTeachersStudents = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/school-admin/teachers-students",
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const userList = document.getElementById("admin-card");

function renderUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    const buttonInfo = document.createElement("button");
    const first_name = document.createElement("h3");
    const last_name = document.createElement("h3");
    const username = document.createElement("h3");
    const birth_date = document.createElement("h3");
    const role = document.createElement("h3");

    userDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Verify";
    buttonInfo.dataset.username = user.username;
    buttonInfo.id = "verify-user-btn";
    first_name.innerHTML = `<strong>First Name: </strong>${user.first_name}`;
    last_name.innerHTML = `<strong>Last Name: </strong>${user.last_name}`;
    username.innerHTML = `<strong>Username: </strong>${user.username}`;
    birth_date.innerHTML = `<strong>Birth Date: </strong>${
      user.birth_date.split("T")[0]
    }`;
    role.innerHTML = `<strong>Role: </strong>${user.user_role}`;

    userDiv.appendChild(buttonInfo);
    userDiv.appendChild(first_name);
    userDiv.appendChild(last_name);
    userDiv.appendChild(username);
    userDiv.appendChild(birth_date);
    userDiv.appendChild(role);
    userList.appendChild(userDiv);
  });
}

const loader = document.getElementById("loader");
loader.style.display = "block";
setTimeout(async () => {
  renderUsers(await getNotVerifiedTeachersStudents());

  const verifyTeacherStudent = async (username) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: "/api/library/school-admin/verifyteacherstudent",
        data: {
          username,
        },
      });

      if (res.status == 200) {
        showAlert("success", res.data.message);
        window.setTimeout(() => {
          location.reload();
        }, 1500);
      }
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  };

  const verifyUserBtns = document.querySelectorAll(".sch-edit");

  verifyUserBtns.forEach((verifyUserBtn) => {
    verifyUserBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const username = verifyUserBtn.dataset.username;

      await verifyTeacherStudent(username);
    });
  });

  function checkDiv() {
    var myDiv = document.getElementById("admin-card");
    if (myDiv.childElementCount <= 0) {
      myDiv.innerHTML =
        '<p class="no-items-message"><strong>This page is empty!</strong></p>';
    }
  }

  checkDiv();

  loader.style.display = "none";
}, 1000);
