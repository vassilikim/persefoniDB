import { showAlertconteiner } from "./alert-conteiner.js";
import { showAlert } from "./alerts.js";

const getBooks = async (title, genre, author) => {
  try {
    if (!title) title = "";
    if (!genre) genre = "";
    if (!author) author = "";

    const res = await axios({
      method: "GET",
      url: `/api/library/books?title=${title}&genre=${genre}&writer=${author}`,
    });

    if (res.status == 200) {
      return res.data.books;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const makeReservation = async (book,the_id) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/api/library/reservations/makereservation`,
      data: {
        book,
      },
    });

    if (res.status == 200) {
      showAlertconteiner("success", res.data.message,7, the_id);
      window.setTimeout(() => {
        location.replace("/user-books");
      }, 1500);
    }
  } catch (err) {
    showAlertconteiner("error", err.response.data.message,7,the_id);
  }
};

const bookList = document.getElementById("book-list");

function renderBooks(books) {
  bookList.innerHTML = "";
  books.forEach((book,index) => {
    const button_info = document.createElement("button");
    const li = document.createElement("li");
    const title = document.createElement("h2");
    const authors = document.createElement("h3");
    const publisher = document.createElement("h4");
    const keywords = document.createElement("p");
    const button_del = document.createElement("button");
    const button_lend = document.createElement("button");
    const conteiner = document.createElement("div");
    const div_pop = document.createElement("div");

    title.textContent = book.title;
    authors.textContent = `by ${book.full_names}`;
    publisher.textContent = `Publisher: ${book.publisher}`;
    keywords.textContent = `Keywords: ${book.keywords}`;
    button_info.textContent = "Info";
    button_info.className = "info";
    button_lend.textContent = "Lend";
    button_lend.className = "edit";
    button_lend.dataset.title = book.title;
    button_lend.dataset.the_id = index;
    button_del.innerHTML = "<span>x</span>";
    button_del.className = "del";
    conteiner.className = "conteiner";
    conteiner.id = `conteiner-${index}`;

    div_pop.innerHTML = `
      <h2>${book.title}</h2>
      <p><strong>Authors:</strong> ${book.full_names}</p>
      <p><strong>Publisher:</strong> ${book.publisher}</p>
      <p><strong>Genre:</strong> ${book.genres}</p>
      <p><strong>Keywords:</strong> ${book.keywords}</p>
      <p><strong>Summary:</strong> ${book.summary}</p>
      <p><strong>ISBN:</strong> ${book.ISBN}</p>
      <p><strong>Copies:</strong> ${book.copies}</p>
      <p><strong>Nuber of pages:</strong> ${book.page_number}</p>
      <p><strong>Language:</strong> ${book.lang}</p>
    `;
    div_pop.className = "bookInfoDiv";
    div_pop.style.display = "none";
    conteiner.style.display = "none";

    button_info.addEventListener("click", () => {
      if (div_pop.style.display === "none" && conteiner.style.display === "none") {
        div_pop.style.display = "block";
        conteiner.style.display = "block";
      } else {
        div_pop.style.display = "none";
        conteiner.style.display = "none";
      }
    });

    button_del.addEventListener("click", () => {
      div_pop.style.display = "none";
      conteiner.style.display = "none";
    });

    li.appendChild(button_info);
    li.appendChild(title);
    li.appendChild(authors);
    div_pop.appendChild(button_del);
    div_pop.appendChild(button_lend);
    conteiner.appendChild(div_pop);
    li.appendChild(conteiner);
    bookList.appendChild(li);
  });
}

const loader = document.getElementById("loader_book");
loader.style.display = "block";
setTimeout(async () => {
  renderBooks(await getBooks(null, null, null));

  const searchBtn = document.getElementById("search-btn");

  searchBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const genre = document.getElementById("genre").value;
    const author = document.getElementById("author").value;

    renderBooks(await getBooks(title, genre, author));
  });

  const editBtns = document.querySelectorAll(".edit");

  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const title = editBtn.dataset.title;
      const the_id = editBtn.dataset.the_id;

      await makeReservation(title,the_id);
    });
  });

  loader.style.display = "none";
}, 1000);
