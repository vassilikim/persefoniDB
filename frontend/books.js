const books = [
  {
    title: 'Book1',
    authors: ['mike kon', 'niko parl'],
    publisher: 'Publisher1',
    publishDate: '2022-01-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['one', 'two', 'three']
  },
  {
    title: 'Book 2',
    authors: ['Author3'],
    publisher: 'Publisher2',
    publishDate: '2022-02-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['four', 'five', 'six']
  },
  {
    title: 'Book 3',
    authors: ['Author3', 'niko parl'],
    publisher: 'Publisher1',
    publishDate: '2022-03-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['seven', 'eight', 'nine']
  },
  {
    title: 'Book 2',
    authors: ['Author3'],
    publisher: 'Publisher2',
    publishDate: '2022-02-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['four', 'five', 'six']
  },
  {
    title: 'Book 3',
    authors: ['Author3', 'niko parl'],
    publisher: 'Publisher1',
    publishDate: '2022-03-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['seven', 'eight', 'nine']
  },
  {
    title: 'Book 2',
    authors: ['Author3'],
    publisher: 'Publisher2',
    publishDate: '2022-02-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['four', 'five', 'six']
  },
  {
    title: 'Book 3',
    authors: ['Author3', 'niko parl'],
    publisher: 'Publisher1',
    publishDate: '2022-03-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['seven', 'eight', 'nine']
  },
  {
    title: 'Book 2',
    authors: ['Author3'],
    publisher: 'Publisher2',
    publishDate: '2022-02-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['four', 'five', 'six']
  },
  {
    title: 'Book 3',
    authors: ['Author3', 'niko parl'],
    publisher: 'Publisher1',
    publishDate: '2022-03-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['seven', 'eight', 'nine']
  },
  {
    title: 'Book 2',
    authors: ['Author3'],
    publisher: 'Publisher2',
    publishDate: '2022-02-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['four', 'five', 'six']
  },
  {
    title: 'Book 3',
    authors: ['Author3', 'niko parl'],
    publisher: 'Publisher1',
    publishDate: '2022-03-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['seven', 'eight', 'nine']
  },
  {
    title: 'Book 2',
    authors: ['Author3'],
    publisher: 'Publisher2',
    publishDate: '2022-02-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['four', 'five', 'six']
  },
  {
    title: 'Book 3',
    authors: ['Author3', 'niko parl'],
    publisher: 'Publisher1',
    publishDate: '2022-03-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['seven', 'eight', 'nine']
  },
  {
    title: 'Book 2',
    authors: ['Author3'],
    publisher: 'Publisher2',
    publishDate: '2022-02-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['four', 'five', 'six']
  },
  {
    title: 'Book 3',
    authors: ['Author3', 'niko parl'],
    publisher: 'Publisher1',
    publishDate: '2022-03-01',
    ISBN:'e5e79a46-61a7-3a1c-9648-20f3f71945e7',
    page_number:'100',
    summary:'Natus sunt qui et iure. Eaque voluptate perspiciatis voluptatem. Accusamus perferendis similique optio fugit quas rerum. Rerum ipsam ut reiciendis nulla illum quos ex.',
    copies:'10',
    lang:'Greek',
    keywords: ['seven', 'eight', 'nine']
  }
];

const bookList = document.getElementById('book-list');

function renderBooks(books) {
  bookList.innerHTML = '';
  books.forEach(book => {
    const button_info = document.createElement('button');
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
    authors.textContent = `by ${book.authors.join(', ')}`;
    publisher.textContent = `Publisher: ${book.publisher}`;
    publishDate.textContent = `Published on: ${book.publishDate}`;
    keywords.textContent = `Keywords: ${book.keywords.join(', ')}`;
    button_info.textContent ='Info';
    button_info.className = 'info';
    button_lend.textContent = 'Lend';
    button_lend.className = 'lend';
    button_del.innerHTML = '<span>x</span>';
    button_del.className = 'del';
    conteiner.className = 'conteiner';
    div_pop.innerHTML = `
      <h2>${book.title}</h2>
      <p><strong>Authors:</strong> ${book.authors.join(', ')}</p>
      <p><strong>Publisher:</strong> ${book.publisher}</p>
      <p><strong>Published on:</strong> ${book.publishDate}</p>
      <p><strong>Keywords:</strong> ${book.keywords.join(', ')}</p>
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

    li.appendChild(button_info);
    li.appendChild(title);
    li.appendChild(authors);
    // li.appendChild(publisher);
    // li.appendChild(publishDate);
    // li.appendChild(keywords);
    // li.appendChild(button_lend);
    div_pop.appendChild(button_del);
    conteiner.appendChild(div_pop);
    li.appendChild(conteiner);
    bookList.appendChild(li);
  });
}

const searchBar = document.getElementById('search-bar');

// function filterBooks(searchQuery) {
//   const searchTerms = searchQuery.toLowerCase().split(' ');
//   const filteredBooks = books.filter((book) => {
//     const title = book.title.toLowerCase();
//     const authors = book.authors.map((author) => author.toLowerCase());
//     const keywords = book.keywords.map((keyword) => keyword.toLowerCase());
//     return searchTerms.every((term) => {
//       return title.includes(term) || authors.some((author) => author.includes(term)) || keywords.some((keyword) => keyword.includes(term));
//     });
//   });
//   renderBooks(filteredBooks);
// }



// // Handle search input
//   searchBar.addEventListener('input', (event) => {
//     const searchQuery = event.target.value;
//     filterBooks(searchQuery);
//   });
  
  // Initial render
  renderBooks(books);

