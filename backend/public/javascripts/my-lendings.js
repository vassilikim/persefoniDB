import { showAlert } from "./alerts.js";

const getMyLendings = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/reservations/mylendings",
    });

    if (res.status == 200) {
      return res.data.books;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const lendreqList = document.getElementById("admin-card");

function renderLendingRequests(reqs) {
  lendreqList.innerHTML = "";
  reqs.forEach((req) => {
    const reqDiv = document.createElement("div");
    const buttonInfo = document.createElement("button");
    const book = document.createElement("h3");
    const lending_date = document.createElement("h3");
    const must_return = document.createElement("h3");

    reqDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Make Review";
    buttonInfo.dataset.book = req.title;
    buttonInfo.id = "handle-request-btn";
    book.innerHTML = `<strong>Book: </strong>${req.title}`;
    lending_date.innerHTML = `<strong>Lending Date: </strong>${
      req.lending_date.split("T")[0]
    }`;
    must_return.innerHTML = `<strong>Return Date: </strong>${
      req.must_be_returned_at.split("T")[0]
    }`;

    if (req.was_returned_at) {
      const returnedLabel = document.createElement("span");
      returnedLabel.className = "returned-label";
      returnedLabel.textContent = "RETURNED";
      reqDiv.appendChild(returnedLabel);
    }

    reqDiv.appendChild(buttonInfo);
    reqDiv.appendChild(book);
    reqDiv.appendChild(lending_date);
    reqDiv.appendChild(must_return);
    lendreqList.appendChild(reqDiv);
  });
}

const loader = document.getElementById("loader");
loader.style.display = "block";
setTimeout(async () => {
  renderLendingRequests(await getMyLendings());

  const handleRequestBtn = document.querySelectorAll(".sch-edit");

  handleRequestBtn.forEach((handleRequestBtn) => {
    handleRequestBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const queryString = new URLSearchParams({
        title: handleRequestBtn.dataset.book,
      }).toString();

      location.assign("/review-book?" + queryString);
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
