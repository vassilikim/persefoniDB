export const hideAlert = () => {
    // If there is an alert element in the html code, erase it
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
  
  };
  
  export const showAlertconteiner = (type, msg, time = 7, the_id) => {
    hideAlert();
  
    const markup = `<div class="alert gap_new alert--${type}">${msg}</div>`;
  
    const bookInfoDiv = document.getElementById(`conteiner-${the_id}`);
    if (bookInfoDiv) {
      bookInfoDiv.insertAdjacentHTML("afterbegin", markup);
    }
  
    window.setTimeout(hideAlert, time * 1000);
  };
  
  