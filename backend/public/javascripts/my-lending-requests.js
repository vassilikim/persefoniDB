import { showAlert } from "./alerts.js";

const getMyLendingRequests = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/reservations/myreservations",
    });

    if (res.status == 200) {
      return res.data.data;
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
    const request_date = document.createElement("h3");
    const status = document.createElement("h3");

    reqDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Cancel";
    buttonInfo.dataset.book = req.title;
    buttonInfo.id = "handle-request-btn";
    book.innerHTML = `<strong>Book: </strong>${req.title}`;
    request_date.innerHTML = `<strong>Request Date: </strong>${
      req.request_date.split("T")[0]
    }`;
    status.innerHTML = `<strong>Status: </strong>${
      req.reservation_status == 0
        ? "-"
        : req.reservation_status == 1
        ? "pending"
        : req.reservation_status == 2
        ? "served"
        : "canceled"
    }`;

    if (req.reservation_status == 0 || req.reservation_status == 1)
      reqDiv.appendChild(buttonInfo);
    reqDiv.appendChild(book);
    reqDiv.appendChild(request_date);
    reqDiv.appendChild(status);
    lendreqList.appendChild(reqDiv);
  });
}

const loader = document.getElementById("loader");
loader.style.display = "block";
setTimeout(async () => {
  renderLendingRequests(await getMyLendingRequests());

  const cancelRequest = async (book) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: "/api/library/reservations/cancel",
        data: {
          book,
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
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  };

  const handleRequestBtn = document.querySelectorAll(".sch-edit");

  handleRequestBtn.forEach((handleRequestBtn) => {
    handleRequestBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const book = handleRequestBtn.dataset.book;

      await cancelRequest(book);
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
