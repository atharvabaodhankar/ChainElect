// Navbar

const menu = document.querySelector(".menu");
var navbar = document.querySelector(".navbar");
var lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll <= 0) {
    document.body.classList.remove("scroll-down");
  }

  if (
    currentScroll > lastScroll &&
    !document.body.classList.contains("scroll-down")
  ) {
    {
      document.body.classList.add("scroll-down");
    }
  }

  if (
    currentScroll < lastScroll &&
    document.body.classList.contains("scroll-down")
  ) {
    document.body.classList.remove("scroll-down");
  }

  lastScroll = currentScroll;
});