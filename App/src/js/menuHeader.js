import { getUserLanguage } from "./getUserLanguage.js"
import { initCountryAndLengagePopUp } from "./countryAndLenguagePupUp.js"

let menuVisible = false

const textContent = {
   es: {
      preferences: "Preferencias",
   },
   en: {
      preferences: "Preferences",
   },
}

let language = getUserLanguage()

export function toggleHeaderUserMenu(state) {
   const menu = document.getElementById("header_user-menu")

   if (state) {
      const divToggleMenu = document.createElement("div")
      const body = document.querySelector("body")
      divToggleMenu.classList.add("toggle_menu-visibilty")
      // preferencesOption()
      body.appendChild(divToggleMenu)
      divToggleMenu.addEventListener("click", () => {
         menuVisible = false
         divToggleMenu.remove()
         toggleHeaderUserMenu()
      })
   }
   menu.classList.toggle("header_user-menu-visible", state)
}

function preferencesOption() {
   const button = document.querySelector(".preferences-option")

   button.innerHTML = `${textContent[language].preferences}<i class="fa fa-gear header_user-menu-option-icon"></i>`

   button.addEventListener("click", () => {
      const divToggleMenu = document.querySelector(".toggle_menu-visibilty")
      menuVisible = false
      divToggleMenu.remove()
      toggleHeaderUserMenu(menuVisible)
      localStorage.removeItem("preferences")
      initCountryAndLengagePopUp()
   })
}

export function menuInit() {
   language = getUserLanguage()

   const button = document.querySelector("#header_user-button")
   button.addEventListener("click", () => {
      const divToggleMenu = document.querySelector(".toggle_menu-visibilty")
      if (divToggleMenu) {
         divToggleMenu.remove()
      }
      menuVisible = !menuVisible
      toggleHeaderUserMenu(menuVisible)
      const preferencesButton = document.querySelector(".preferences-option")

      if (preferencesButton) {
         preferencesOption()
      }
   })
}
