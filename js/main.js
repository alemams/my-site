function toggleMenu() {
  const menu = document.getElementById("navMenu");
  if (!menu) return;
  menu.classList.toggle("show");
}

function setYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

window.addEventListener("DOMContentLoaded", () => {
  setYear();
});