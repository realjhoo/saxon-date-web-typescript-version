const navSlide = () => {
  const burger = document.querySelector(".burger") as HTMLDivElement;
  const nav = document.querySelector(".nav-links") as HTMLUListElement;
  const navLinks = document.querySelectorAll<HTMLLinkElement>(".nav-links li");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");

    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.3
        }s`;
      }
    });
    //
    burger.classList.toggle("toggle");
  });
};

navSlide();
