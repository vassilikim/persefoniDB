import { showAlert } from "./alerts.js";
const theTable = document.getElementById("the_table");
theTable.style.display = "none";

const getData = async (month, year) => {
  try {
    if (!month) month = "";
    if (!year) year = "";

    const res = await axios({
      method: "GET",
      url: `/api/library/super-admin/lendings-per-school?month=${month}&year=${year}`,
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

    td1.textContent = Data.school_name;
    td2.textContent = Data.lendings;

    tr.appendChild(td1);
    tr.appendChild(td2);
    bodyTableList.appendChild(tr);
  });
  none_table.style.display = "block";
}

const loader = document.getElementById("loader_book");

loader.style.display = "block";
setTimeout(async () => {
  renderBodyTable(await getData(null, null));

  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    renderBodyTable(await getData(month, year));
  });

  loader.style.display = "none";
  theTable.style.display = "flex";
}, 1000);
