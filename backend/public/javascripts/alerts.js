export const hideAlert = () => {
  // If there is an alert element in the html code, erase it
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg, time = 7) => {
  // Hide previouw alerts
  hideAlert();
  // Put the HTML code for the alert in the beginning of the body
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  // Close the alert after five seconds
  window.setTimeout(hideAlert, time * 1000);
};
