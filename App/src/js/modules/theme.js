export function updateThemeIcon(currentColor) {
   const themeIcon = document.querySelector("#theme_icon")

   if (currentColor == "light") {
      themeIcon.setAttribute("class", "fa fa-moon")
   } else {
      themeIcon.setAttribute("class", "fa fa-sun")
   }
}

export function themeInit() {
   const html = document.querySelector("html")
   const currentColor = window.localStorage.getItem("theme")

   if (!currentColor) {
      if (
         window.matchMedia &&
         window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
         window.localStorage.setItem("theme", "dark")
         html.setAttribute("theme", "dark")
         updateThemeIcon("dark")
      } else {
         html.setAttribute("theme", "light")
         window.localStorage.setItem("theme", "light")
         updateThemeIcon("light")
      }
   } else {
      html.setAttribute("theme", currentColor)
      updateThemeIcon(currentColor)
   }
}

export function themeHandle() {
   const themeButton = document.getElementById("theme")

   themeButton.addEventListener("click", () => {
      const html = document.querySelector("html")
      const currentColor = window.localStorage.getItem("theme")
      const colorTochange = currentColor !== "light" ? "light" : "dark"

      html.setAttribute("theme", colorTochange)
      window.localStorage.setItem("theme", colorTochange)

      updateThemeIcon(colorTochange)
   })
}
