import { showAlert } from "./alerts.js";

const getPendingReservations = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/reservations/pendingreservations",
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const reservList = document.getElementById("admin-card");

function renderPendingReservations(reservs) {
  reservList.innerHTML = "";
  reservs.forEach((reserv) => {
    const reservDiv = document.createElement("div");
    const buttonInfo = document.createElement("button");
    const book = document.createElement("h3");
    const username = document.createElement("h3");
    const role = document.createElement("h3");
    const request_date = document.createElement("h3");
    const reservation_date = document.createElement("h3");

    reservDiv.className = "schOfone";
    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Handle reservation";
    buttonInfo.dataset.username = reserv.username;
    buttonInfo.dataset.book = reserv.title;
    buttonInfo.id = "handle-request-btn";
    book.innerHTML = `<strong>Book: </strong>${reserv.title}`;
    username.innerHTML = `<strong>Username: </strong>${reserv.username}`;
    role.innerHTML = `<strong>Role: </strong>${reserv.user_role}`;
    request_date.innerHTML = `<strong>Request Date: </strong>${
      reserv.request_date.split("T")[0]
    }`;
    reservation_date.innerHTML = `<strong>Reservation Date: </strong>${
      reserv.pending_reservation_date.split("T")[0]
    }`;

    reservDiv.appendChild(buttonInfo);
    reservDiv.appendChild(book);
    reservDiv.appendChild(username);
    reservDiv.appendChild(role);
    reservDiv.appendChild(request_date);
    reservDiv.appendChild(reservation_date);
    reservList.appendChild(reservDiv);
  });
}

renderPendingReservations(await getPendingReservations());

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
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
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

