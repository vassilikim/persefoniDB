import { showAlert } from "./alerts.js";

const getSchools = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/schools",
    });

    if (res.status == 200) {
      return res.data.schools;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const deleteSchool = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/library/schools/${id}`,
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/schools");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const schoolList = document.getElementById("sch-card");

function renderSchools(schools) {
  schoolList.innerHTML = "";
  schools.forEach((school) => {
    const schoolDiv = document.createElement("div");
    const buttonInfo = document.createElement("button");
    const buttonDel = document.createElement("button");
    const title = document.createElement("h2");
    const address = document.createElement("h3");
    const city = document.createElement("h3");
    const phone = document.createElement("h3");
    const principal = document.createElement("h3");
    const email = document.createElement("h3");

    schoolDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Edit";
    buttonDel.className = "sch-delete";
    buttonDel.textContent = "Delete";
    buttonDel.dataset.id = school.ID;
    buttonDel.onclick = function () {
      confirmDelete(buttonDel.dataset.id);
    };
    buttonInfo.dataset.school_name = school.school_name;
    buttonInfo.dataset.address = school.address;
    buttonInfo.dataset.city = school.city;
    buttonInfo.dataset.phone = school.phone;
    buttonInfo.dataset.email = school.email;
    buttonInfo.dataset.principal = school.principal;
    buttonInfo.dataset.id = school.ID;
    title.textContent = `${school.school_name}`;
    address.innerHTML = `<strong>Address: </strong>${school.address}`;
    city.innerHTML = `<strong>City: </strong>${school.city}`;
    phone.innerHTML = `<strong>Phone: </strong>${school.phone}`;
    email.innerHTML = `<strong>Email: </strong>${school.email}`;
    principal.innerHTML = `<strong>Principal: </strong>${school.principal}`;

    schoolDiv.appendChild(buttonInfo);
    schoolDiv.appendChild(buttonDel);
    schoolDiv.appendChild(title);
    schoolDiv.appendChild(address);
    schoolDiv.appendChild(city);
    schoolDiv.appendChild(phone);
    schoolDiv.appendChild(email);
    schoolDiv.appendChild(principal);
    schoolList.appendChild(schoolDiv);
  });
}

function registerEditButtonListeners() {
  const editSchBtns = document.querySelectorAll(".sch-edit");

  editSchBtns.forEach((editSchBtn) => {
    editSchBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const queryString = new URLSearchParams({
        id: editSchBtn.dataset.id,
        school_name: editSchBtn.dataset.school_name,
        address: editSchBtn.dataset.address,
        city: editSchBtn.dataset.city,
        phone: editSchBtn.dataset.phone,
        email: editSchBtn.dataset.email,
        principal: editSchBtn.dataset.principal,
      }).toString();

      location.replace("/edit-school?" + queryString);
    });
  });
}

const loader = document.getElementById("loader");
loader.style.display = "block";
setTimeout(async () => {
  const schools = await getSchools();

  function checkDiv() {
    var myDiv = document.getElementById("admin-card");
    if (myDiv.childElementCount <= 0) {
      myDiv.innerHTML =
        '<p class="no-items-message"><strong>This page is empty!</strong></p>';
    }
  }

  checkDiv();

  loader.style.display = "none";
  renderSchools(schools);

  registerEditButtonListeners();
}, 1000);

async function confirmDelete(school_id) {
  if (confirm("Are you sure you want to delete this school?")) {
    await deleteSchool(school_id);
  } else {
  }
}
