import { showAlert } from "./alerts.js";

const getLendingRequests = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/reservations/allreservations",
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
    const username = document.createElement("h3");
    const role = document.createElement("h3");
    const request_date = document.createElement("h3");

    reqDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Handle request";
    buttonInfo.dataset.username = req.username;
    buttonInfo.dataset.book = req.title;
    buttonInfo.id = "handle-request-btn";
    book.innerHTML = `<strong>Book: </strong>${req.title}`;
    username.innerHTML = `<strong>Username: </strong>${req.username}`;
    role.innerHTML = `<strong>Role: </strong>${req.user_role}`;
    request_date.innerHTML = `<strong>Request Date: </strong>${
      req.request_date.split("T")[0]
    }`;

    reqDiv.appendChild(buttonInfo);
    reqDiv.appendChild(book);
    reqDiv.appendChild(username);
    reqDiv.appendChild(role);
    reqDiv.appendChild(request_date);
    lendreqList.appendChild(reqDiv);
  });
}

renderLendingRequests(await getLendingRequests());

const handleRequest = async (username, book) => {
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
      console.log("here");
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

    const username = handleRequestBtn.dataset.username;
    const book = handleRequestBtn.dataset.book;

    await handleRequest(username, book);
  });
});

function checkDiv() {
  var myDiv = document.getElementById("admin-card");
  if (myDiv.childElementCount <= 0) {
    myDiv.innerHTML = '<p class="no-items-message"><strong>This page is empty!</strong></p>';
  }
}

checkDiv()