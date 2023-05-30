import { showAlert } from "./alerts.js";
const theTable = document.getElementById("the_table");
theTable.style.display = "none";

const getData = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `/api/library/super-admin/young-teachers-max-books`,
    });

    if (res.status == 200) {
      return res.data.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const bodyTableList = document.getElementById("body_table");
const none_table = document.getElementById("none_table");

function renderBodyTable(data) {
  bodyTableList.innerHTML = "";
  data.forEach((Data) => {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");

    td1.textContent = Data.username;
    td2.textContent = Data.books;

    tr.appendChild(td1);
    tr.appendChild(td2);
    bodyTableList.appendChild(tr);
  });
  none_table.style.display = "block";
}

const loader = document.getElementById("loader_book");

loader.style.display = "block";
setTimeout(async () => {
  renderBodyTable(await getData());

  loader.style.display = "none";
  theTable.style.display = "flex";
}, 1000);
