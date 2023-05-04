import { showAlert } from "./alerts.js";

const getNotVerifiedSchoolAdmins = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/super-admin/school-admins",
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const adminList = document.getElementById("admin-card");

function renderAdmins(admins) {
  let i = 0;
  adminList.innerHTML = "";
  admins.forEach((admin) => {
    const adminDiv = document.createElement("div");
    const buttonInfo = document.createElement("button");
    const first_name = document.createElement("h3");
    const last_name = document.createElement("h3");
    const username = document.createElement("h3");
    const birth_date = document.createElement("h3");
    const school_name = document.createElement("h3");

    adminDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Verify";
    buttonInfo.dataset.username = admin.username;
    buttonInfo.id = "verify-admin-btn";
    first_name.innerHTML = `<strong>First Name: </strong>${admin.first_name}`;
    last_name.innerHTML = `<strong>Last Name: </strong>${admin.last_name}`;
    username.innerHTML = `<strong>Username: </strong>${admin.username}`;
    birth_date.innerHTML = `<strong>Birth Date: </strong>${admin.birth_date}`;
    school_name.innerHTML = `<strong>School: </strong>${admin.school_name}`;

    adminDiv.appendChild(buttonInfo);
    adminDiv.appendChild(first_name);
    adminDiv.appendChild(last_name);
    adminDiv.appendChild(username);
    adminDiv.appendChild(birth_date);
    adminDiv.appendChild(school_name);
    adminList.appendChild(adminDiv);
  });
}

renderAdmins(await getNotVerifiedSchoolAdmins());

const verifySchAdmin = async (school_admin) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/library/super-admin/verifyschadmin",
      data: {
        school_admin,
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

const verifyAdminBtns = document.querySelectorAll(".sch-edit");

verifyAdminBtns.forEach((verifyAdminBtn) => {
  verifyAdminBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const username = verifyAdminBtn.dataset.username;

    await verifySchAdmin(username);
  });
});
