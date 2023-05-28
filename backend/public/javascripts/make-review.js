import { showAlert } from "./alerts.js";

const makeReview = async (book, review, rating) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/library/reviews/makereview`,
      data: {
        book,
        review,
        rating,
      },
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/my-lendings");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const review = document.getElementById("review").value;
  const rating = document.querySelector('input[name="rating"]:checked');
  const ratingValue = rating ? rating.value : 0;

  await makeReview(title, review, ratingValue);
});
