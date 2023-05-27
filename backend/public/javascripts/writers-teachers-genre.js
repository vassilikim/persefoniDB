import { showAlert } from "./alerts.js";

const theTable = document.getElementById("the_table");
theTable.style.display = "none";

const getData = async (genre) => {
  try {
    if (!genre) genre = "";

    const res = await axios({
      method: "GET",
      url: `/api/library/super-admin/writers-teachers-genre?genre=${genre}`,
    });

    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};


const bodyTableList1 = document.getElementById("body_table1");
const none_table1 = document.getElementById("none_table1");
const bodyTableList2 = document.getElementById("body_table2");
const none_table2 = document.getElementById("none_table2");

function renderBodyTable(data) {
  bodyTableList1.innerHTML = "";
  data.teachers.forEach((Data) => {

    const tr = document.createElement("tr");
    const td = document.createElement("td");

    td.textContent = Data.teacher;

    tr.appendChild(td);
    bodyTableList1.appendChild(tr);
  });
  bodyTableList2.innerHTML = "";
  data.writers.forEach((Data) => {

    const tr = document.createElement("tr");
    const td = document.createElement("td");

    td.textContent = Data.writer;

    tr.appendChild(td);
    bodyTableList2.appendChild(tr);
  });
  none_table1.style.display="block";
  none_table2.style.display="block";
}


const loader = document.getElementById("loader_book");


loader.style.display = "block";
setTimeout(async () => {

  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const genre = document.getElementById("genre").value;

    if (genre){
        renderBodyTable(await getData(genre));
    }

    
  });

  loader.style.display = "none";
  theTable.style.display = "flex";
}, 1000);
