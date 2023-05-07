import { showAlert } from "./alerts.js";

const editSchool = async (name, address, city, phone, email, principal, id) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/library/schools/${id}`,
      data: {
        school_name: name,
        address,
        city,
        phone,
        email,
        principal,
      },
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

const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const school_name = document.getElementById("school_name").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const principal = document.getElementById("principal").value;
  const id = document.getElementById("id").value;

  await editSchool(school_name, address, city, phone, email, principal, id);
});
