import { showAlert } from "./alerts.js";

const borrowInSchool = async (username, book) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/library/reservations/handlereservation",
      data: {
        username,
        book,
      },
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/main-screen");
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
  const book = document.getElementById("book").value;

  await borrowInSchool(username, book);
});
