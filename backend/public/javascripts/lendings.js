import { showAlert } from "./alerts.js";

const getLendings = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/library/reservations/alllendings",
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const lendList = document.getElementById("admin-card");

function renderLendings(lendings) {
  lendList.innerHTML = "";
  lendings.forEach((lending) => {
    const lendDiv = document.createElement("div");
    const buttonInfo = document.createElement("button");
    const book = document.createElement("h3");
    const username = document.createElement("h3");
    const role = document.createElement("h3");
    const lending_date = document.createElement("h3");
    const return_date = document.createElement("h3");

    buttonInfo.className = "sch-edit";
    buttonInfo.textContent = "Return Book";
    buttonInfo.dataset.book = lending.title;
    buttonInfo.dataset.username = lending.username;
    buttonInfo.id = "verify-user-btn";
    lendDiv.className = "schOfone";
    book.innerHTML = `<strong>Book: </strong>${lending.title}`;
    username.innerHTML = `<strong>Username: </strong>${lending.username}`;
    role.innerHTML = `<strong>Role: </strong>${lending.user_role}`;
    lending_date.innerHTML = `<strong>Lending Date: </strong>${
      lending.lending_date.split("T")[0]
    }`;
    return_date.innerHTML = `<strong>Return Date: </strong>${
      lending.must_be_returned_at.split("T")[0]
    }`;

    lendDiv.appendChild(buttonInfo);
    lendDiv.appendChild(book);
    lendDiv.appendChild(username);
    lendDiv.appendChild(role);
    lendDiv.appendChild(lending_date);
    lendDiv.appendChild(return_date);
    lendList.appendChild(lendDiv);
  });
}

const loader = document.getElementById("loader");
loader.style.display = "block";
setTimeout(async () => {
  renderLendings(await getLendings());

  const returnBook = async (book, username) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: "/api/library/reservations/returnbook",
        data: {
          book,
          username,
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

  const returnBookBtns = document.querySelectorAll(".sch-edit");

  returnBookBtns.forEach((returnBookBtn) => {
    returnBookBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const username = returnBookBtn.dataset.username;
      const book = returnBookBtn.dataset.book;

      await returnBook(book, username);
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
