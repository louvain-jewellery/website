dropdownButton = document.querySelector(".koleksi-dropdown");
const overlay = document.querySelector(".overlay");

dropdownButton.addEventListener("mouseenter", () => {
  overlay.style.display = "block";
})

dropdownButton.addEventListener("mouseleave", () => {
  overlay.style.display = "none";
})

document.addEventListener("touchstart", function(e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
}, { passive: false });