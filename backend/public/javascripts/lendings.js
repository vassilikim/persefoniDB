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

    lendDiv.className = "schOfone";
    book.innerHTML = `<strong>Book: </strong>${lending.title}`;
    username.innerHTML = `<strong>Username: </strong>${lending.username}`;
    role.innerHTML = `<strong>Role: </strong>${lending.user_role}`;
    lending_date.innerHTML = `<strong>Request Date: </strong>${
      lending.lending_date.split("T")[0]
    }`;
    return_date.innerHTML = `<strong>Reservation Date: </strong>${
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

renderLendings(await getLendings());
