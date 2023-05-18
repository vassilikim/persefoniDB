import { showAlert } from "./alerts.js";

const getBooks = async (title, genre, author, copies) => {
  try {
    if (!title) title = "";
    if (!genre) genre = "";
    if (!author) author = "";
    if (!copies) copies = "";

    const res = await axios({
      method: "GET",
      url: `/api/library/books?title=${title}&genre=${genre}&writer=${author}&copies=${copies}`,
    });

    if (res.status == 200) {
      return res.data.books;
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const bookList = document.getElementById('book-list');

function renderBooks(books) {
  bookList.innerHTML = '';
  books.forEach(book => {
    const button_info = document.createElement('button');
    const book_del = document.createElement('button');
    const book_edit = document.createElement('button');
    const add_book = document.createElement('button');
    const li = document.createElement('li');
    const title = document.createElement('h2');
    const authors = document.createElement('h3');
    const publisher = document.createElement('h4');
    const publishDate = document.createElement('p');
    const keywords = document.createElement('p');
    const summary = document.createElement('p');
    const ISBN = document.createElement('p');
    const copies = document.createElement('h4');
    const lang = document.createElement('h4');
    const page_number = document.createElement('h4');
    const button_del = document.createElement('button');
    const button_lend = document.createElement('button');
    const conteiner= document.createElement('div');
    const div_pop= document.createElement('div');

    title.textContent = book.title;
    authors.textContent = `by ${book.full_names}`;
    publisher.textContent = `Publisher: ${book.publisher}`;
    keywords.textContent = `Keywords: ${book.keywords}`;
    button_info.textContent ='Info';
    button_info.className = 'info';
    book_del.textContent='Delete';
    book_del.className='delete';
    book_edit.textContent='Edit';
    book_edit.className='edit';
    button_lend.textContent = 'Lend';
    button_lend.className = 'lend';
    button_del.innerHTML = '<span>x</span>';
    button_del.className = 'del';
    conteiner.className = 'conteiner';
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
    div_pop.className = 'bookInfoDiv';
    div_pop.style.display = 'none';
    conteiner.style.display = 'none';

    button_info.addEventListener('click', () => {
      if (div_pop.style.display === 'none') {
        div_pop.style.display = 'block';
        conteiner.style.display='block';
      } else {
        div_pop.style.display = 'none';
        conteiner.style.display = 'none';
      }
    });

    button_del.addEventListener('click', () => {
      div_pop.style.display = 'none';
      conteiner.style.display = 'none';
    });

    li.appendChild(book_del);
    li.appendChild(button_info);
    li.appendChild(title);
    li.appendChild(authors);
    div_pop.appendChild(button_del);
    div_pop.appendChild(book_edit);
    conteiner.appendChild(div_pop);
    li.appendChild(conteiner);
    bookList.appendChild(li);
  });
}




const loader = document.getElementById("loader_book");
loader.style.display = "block";
setTimeout(async () => {
  renderBooks(await getBooks(null,null,null,null));


const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", async function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const genre = document.getElementById("genre").value;
  const author = document.getElementById("author").value;
  const copies = document.getElementById("copies").value;

  renderBooks(await getBooks(title,genre,author,copies));
});

  loader.style.display = "none";
  
}, 1500);
