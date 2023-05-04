import { showAlert } from "./alerts.js";

const addSchool = async (name, address, city, phone, email, principal) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/library/schools/create`,
      data: {
        school_name: name,
        address,
        city,
        phone,
        email,
        principal,
      },
    });

    if (res.status == 201) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/schools");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const school_name = document.getElementById("school_name").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const principal = document.getElementById("principal").value;

  await addSchool(school_name, address, city, phone, email, principal);
});
