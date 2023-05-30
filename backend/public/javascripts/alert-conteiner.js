export const hideAlert = () => {
    // If there is an alert element in the html code, erase it
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
  
  };
  
  export const showAlert = (type, msg, time = 7) => {
    // Hide previous alerts
    hideAlert();
  
    // Put the HTML code for the alert in the beginning of the body
    const markup = `<div class="alert gap_new alert--${type}">${msg}</div>`;
    document.querySelector("div .conteiner").insertAdjacentHTML("afterbegin", markup);
  
    // Close the alert after a given time
    window.setTimeout(hideAlert, time * 1000);
  };
  