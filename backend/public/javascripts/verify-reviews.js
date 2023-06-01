import { showAlert } from "./alerts.js";

const getNotVerifiedReviews = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/reviews/notverified",
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const reviewList = document.getElementById("admin-card");

function renderReviews(reviews) {
  reviewList.innerHTML = "";
  reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    const buttonInfo = document.createElement("button");
    const username = document.createElement("h3");
    const book = document.createElement("h3");
    const text = document.createElement("h3");
    const rating = document.createElement("h3");

    reviewDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Verify";
    buttonInfo.dataset.username = review.username;
    buttonInfo.dataset.book = review.title;
    username.innerHTML = `<strong>Username: </strong>${review.username}`;
    book.innerHTML = `<strong>Book: </strong>${review.title}`;
    text.innerHTML = `<strong>Review: </strong>${review.review}`;
    rating.innerHTML = "<strong>Rating: </strong> ";

    const starContainer = document.createElement("div");
    starContainer.className = "star-rating";
    const ratingValue = review.rating;

    for (let i = 0; i < 5; i++) {
      if (5 === ratingValue){
        const star = document.createElement("span");
        star.className = "yellow-icon full-star";
        starContainer.appendChild(star);
      } else if (i < ratingValue) {
        const star = document.createElement("span");
        star.className = "black-star full-star";
        starContainer.appendChild(star);
      } else {
        const star = document.createElement("span");
        star.className = "yellow-icon full-star";
        starContainer.appendChild(star);
      }
    }

    rating.appendChild(starContainer);

    reviewDiv.appendChild(buttonInfo);
    reviewDiv.appendChild(username);
    reviewDiv.appendChild(book);
    reviewDiv.appendChild(text);
    reviewDiv.appendChild(rating);
    reviewList.appendChild(reviewDiv);
  });
}

const loader = document.getElementById("loader");
loader.style.display = "block";
setTimeout(async () => {
  renderReviews(await getNotVerifiedReviews());

  const verifyReview = async (book, student) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: "/api/library/reviews/verify",
        data: {
          book,
          student,
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

  const verifyReviewBtns = document.querySelectorAll(".sch-edit");

  verifyReviewBtns.forEach((verifyReviewBtn) => {
    verifyReviewBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const username = verifyReviewBtn.dataset.username;
      const book = verifyReviewBtn.dataset.book;

      await verifyReview(book, username);
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
