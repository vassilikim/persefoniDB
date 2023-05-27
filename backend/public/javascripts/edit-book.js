import { showAlert } from "./alerts.js";

const editBook = async (
  publisher,
  ISBN,
  page_number,
  summary,
  copies,
  image,
  lang,
  keywords,
  genre,
  writer_name,
  id
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/library/books/${id}`,
      data: {
        publisher,
        ISBN,
        page_number,
        summary: summary,
        copies,
        image,
        lang,
        keywords,
        genre: genre + ",",
        writer_name: writer_name + ",",
      },
    });

    if (res.status == 200) {
      showAlert("success", res.data.message);
      window.setTimeout(() => {
        location.replace("/books");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const publisher = document.getElementById("publisher").value;
  const ISBN = document.getElementById("ISBN").value;
  const page_number = document.getElementById("page_number").value;
  const copies = document.getElementById("copies").value;
  const summary = document.getElementById("summary").value;
  const image = document.getElementById("image").value;
  const lang = document.getElementById("lang").value;
  const keywords = document.getElementById("keywords").value;
  const genre = document.getElementById("genre").value;
  const writer_name = document.getElementById("writer_name").value;
  const ID = document.getElementById("id").value;

  await editBook(
    publisher,
    ISBN,
    page_number,
    summary,
    copies,
    image,
    lang,
    keywords,
    genre,
    writer_name,
    ID
  );
});
