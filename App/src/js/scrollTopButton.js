export function initScrollTopButton() {
   const topButton = document.querySelector("#goToTop")

   document.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
         topButton.classList.add("goToTop-visible")
         topButton.classList.remove("goToTop-hidden")
      } else {
         topButton.classList.add("goToTop-hidden")
         topButton.classList.remove("goToTop-visible")
      }
   })

   topButton.addEventListener("click", () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth",
      })
   })
}
