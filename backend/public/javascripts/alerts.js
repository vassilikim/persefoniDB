// export const hideAlert = () => {
//   // If there is an alert element in the html code, erase it
//   const el = document.querySelector(".alert");
//   if (el) el.parentElement.removeChild(el);
// };

// export const showAlert = (type, msg, time = 7) => {
//   // Hide previouw alerts
//   hideAlert();
//   // Put the HTML code for the alert in the beginning of the body
//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
//   if (type==='success'){
//     const button = document.getElementById('login-btn');
//     button.classList.add('loading');
//     button.disabled = true;
//   }
//   // Close the alert after five seconds
//   window.setTimeout(hideAlert, time * 1000);
// };

// // export const showAlert = (type, msg, time) => {
//   // Hide previous alerts
//   hideAlert();

//   // Put the HTML code for the alert in the beginning of the body
//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

//   // Add loading state to button if alert type is success
//   if (type === 'success') {
//     const form = document.getElementById('login-btn');
//     form.classList.add('loading');
//     form.disabled = true;
//   }

//   // Close the alert after a specified time
//   window.setTimeout(() => {
//     hideAlert();

//     // Remove loading state from button if alert type is success
//     if (type === 'success') {
//       const form = document.getElementById('login-btn');
//       form.classList.remove('loading');
//       button.disabled = false;
//     }
//   }, time * 1000);
// };
export const hideAlert = () => {
  // If there is an alert element in the html code, erase it
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);

  // If the login button is disabled and has the loading class, remove it and enable it again
  const button = document.getElementById("login-btn");
  if (button.disabled && button.classList.contains("loading")) {
    button.classList.remove("loading");
    button.disabled = false;
  }
};

export const showAlert = (type, msg, time = 7) => {
  // Hide previous alerts
  hideAlert();
  
  // Put the HTML code for the alert in the beginning of the body
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  // If the type is success, show the loading spinner
  if (type === "success") {
    const button = document.getElementById("login-btn");
    button.classList.add("loading");
    button.disabled = true;
  }
  
  // Close the alert after a given time
  window.setTimeout(hideAlert, time * 1000);
};
