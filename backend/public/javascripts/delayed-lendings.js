import { showAlert } from "./alerts.js";

const getDelayedUsers = async (first_name, last_name, delay) => {
  try {
    if (!first_name) first_name = "";
    if (!last_name) last_name = "";
    if (!delay) delay = "";

    const res = await axios({
      method: "GET",
      url: `/api/library/school-admin/users-delayed-lending?first_name=${first_name}&last_name=${last_name}&delay=${delay}`,
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const delayedList = document.getElementById("admin-card");

function renderDelayedUsers(rets) {
  delayedList.innerHTML = "";
  rets.forEach((ret) => {
    const retDiv = document.createElement("div");
    const username = document.createElement("h3");
    const full_name = document.createElement("h3");
    const book = document.createElement("h3");
    const return_date = document.createElement("h3");

    retDiv.className = "schOfone";
    username.innerHTML = `<strong>Username: </strong>${ret.username}`;
    full_name.innerHTML = `<strong>Full Name: </strong>${ret.full_name}`;
    book.innerHTML = `<strong>Book: </strong>${ret.title}`;
    return_date.innerHTML = `<strong>Return Date: </strong>${
      ret.must_be_returned_at.split("T")[0]
    }`;

    retDiv.appendChild(username);
    retDiv.appendChild(full_name);
    retDiv.appendChild(book);
    retDiv.appendChild(return_date);
    delayedList.appendChild(retDiv);
  });
}



const loader = document.getElementById("loader");
loader.style.display = "block";
setTimeout(async () => {
  
  
renderDelayedUsers(await getDelayedUsers(null, null, null));

const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const delay = document.getElementById("delay").value;

  renderDelayedUsers(await getDelayedUsers(first_name, last_name, delay));
});


  function checkDiv() {
    var myDiv = document.getElementById("admin-card");
    if (myDiv.childElementCount <= 0) {
      myDiv.innerHTML = '<p class="no-items-message"><strong>This page is empty!</strong></p>';
    }
  }
    
  checkDiv()
  
  loader.style.display = "none";
}, 1500);