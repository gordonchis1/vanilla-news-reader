import { relaunchNewsInScroll } from "./newsLazyLoading.js"
import { launchSlider } from "./topNewsSlider.js"
const countries = [
   { country: "Afghanistan", code: "af", language: "Persian", lang_code: "fa" },
   { country: "Albania", code: "al", language: "Albanian", lang_code: "sq" },
   { country: "Algeria", code: "dz", language: "Arabic", lang_code: "ar" },
   { country: "Argentina", code: "ar", language: "Spanish", lang_code: "es" },
   { country: "Australia", code: "au", language: "English", lang_code: "en" },
   { country: "Austria", code: "at", language: "German", lang_code: "de" },
   { country: "Bahamas", code: "bs", language: "English", lang_code: "en" },
   { country: "Bahrain", code: "bh", language: "Arabic", lang_code: "ar" },
   { country: "Bangladesh", code: "bd", language: "Bengali", lang_code: "bn" },
   { country: "Belarus", code: "by", language: "Russian", lang_code: "ru" },
   { country: "Belgium", code: "be", language: "Dutch", lang_code: "nl" },
   { country: "Belize", code: "bz", language: "English", lang_code: "en" },
   {
      country: "Bosnia And Herzegovina",
      code: "ba",
      language: "Bosnian",
      lang_code: "bs",
   },
   { country: "Brazil", code: "br", language: "Portuguese", lang_code: "pt" },
   { country: "Bulgaria", code: "bg", language: "Bulgarian", lang_code: "bg" },
   { country: "Canada", code: "ca", language: "English", lang_code: "en" },
   { country: "Chile", code: "cl", language: "Spanish", lang_code: "es" },
   { country: "China", code: "cn", language: "Chinese", lang_code: "zh" },
   { country: "Colombia", code: "co", language: "Spanish", lang_code: "es" },
   { country: "Croatia", code: "hr", language: "Croatian", lang_code: "hr" },
   {
      country: "Czech Republic",
      code: "cz",
      language: "Czech",
      lang_code: "cs",
   },
   { country: "Denmark", code: "dk", language: "Danish", lang_code: "da" },
   {
      country: "Dominican Republic",
      code: "do",
      language: "Spanish",
      lang_code: "es",
   },
   { country: "Ecuador", code: "ec", language: "Spanish", lang_code: "es" },
   { country: "Egypt", code: "eg", language: "Arabic", lang_code: "ar" },
   { country: "El Salvador", code: "sv", language: "Spanish", lang_code: "es" },
   { country: "Estonia", code: "ee", language: "Estonian", lang_code: "et" },
   { country: "Finland", code: "fi", language: "Finnish", lang_code: "fi" },
   { country: "France", code: "fr", language: "French", lang_code: "fr" },
   { country: "Germany", code: "de", language: "German", lang_code: "de" },
   { country: "Greece", code: "gr", language: "Greek", lang_code: "el" },
   { country: "Guatemala", code: "gt", language: "Spanish", lang_code: "es" },
   { country: "Honduras", code: "hn", language: "Spanish", lang_code: "es" },
   { country: "Hungary", code: "hu", language: "Hungarian", lang_code: "hu" },
   { country: "Iceland", code: "is", language: "Icelandic", lang_code: "is" },
   { country: "India", code: "in", language: "Hindi", lang_code: "hi" },
   {
      country: "Indonesia",
      code: "id",
      language: "Indonesian",
      lang_code: "id",
   },
   { country: "Iran", code: "ir", language: "Persian", lang_code: "fa" },
   { country: "Israel", code: "il", language: "Hebrew", lang_code: "he" },
   { country: "Italy", code: "it", language: "Italian", lang_code: "it" },
   { country: "Japan", code: "jp", language: "Japanese", lang_code: "ja" },
   { country: "Mexico", code: "mx", language: "Spanish", lang_code: "es" },
   { country: "Netherlands", code: "nl", language: "Dutch", lang_code: "nl" },
   { country: "New Zealand", code: "nz", language: "English", lang_code: "en" },
   { country: "Norway", code: "no", language: "Norwegian", lang_code: "no" },
   { country: "Pakistan", code: "pk", language: "Urdu", lang_code: "ur" },
   { country: "Peru", code: "pe", language: "Spanish", lang_code: "es" },
   { country: "Poland", code: "pl", language: "Polish", lang_code: "pl" },
   { country: "Portugal", code: "pt", language: "Portuguese", lang_code: "pt" },
   { country: "Romania", code: "ro", language: "Romanian", lang_code: "ro" },
   { country: "Russia", code: "ru", language: "Russian", lang_code: "ru" },
   { country: "Serbia", code: "rs", language: "Serbian", lang_code: "sr" },
   { country: "Spain", code: "es", language: "Spanish", lang_code: "es" },
   { country: "Sweden", code: "se", language: "Swedish", lang_code: "sv" },
   { country: "Thailand", code: "th", language: "Thai", lang_code: "th" },
   { country: "Turkey", code: "tr", language: "Turkish", lang_code: "tr" },
   { country: "Ukraine", code: "ua", language: "Ukrainian", lang_code: "uk" },
   {
      country: "United Kingdom",
      code: "gb",
      language: "English",
      lang_code: "en",
   },
   {
      country: "United States",
      code: "us",
      language: "English",
      lang_code: "en",
   },
   { country: "Uzbekistan", code: "uz", language: "Uzbek", lang_code: "uz" },
   { country: "Vietnam", code: "vn", language: "Vietnamese", lang_code: "vi" },
]

export function getUserLanguage() {
   let [language] = navigator.language.split("-", 1)

   if (!language == "en" || !language == "es") {
      console.log(language)
      language = "en"
   }

   return language
}
export const textContent = {
   general: {
      en: {
         title: "Welcome to your personalized news experience!",
         nextButton: "Next",
      },
      es: {
         title: "¡Bienvenido a tu experiencia de noticias personalizada!",
         nextButton: "Siguiente",
      },
   },
   country: {
      en: {
         subtitle: "Step 1: Choose your country",
         description:
            "Select the country you want to receive news from. This will help us personalize the top stories based on your location.",
      },
      es: {
         subtitle: "Paso 1: Elige tu país",
         description:
            "Selecciona el país del que quieres recibir noticias. Esto nos ayudará a personalizar las principales historias según tu ubicación.",
      },
   },
   language: {
      en: {
         subtitle: "Step 2: Select your language",
         description:
            "Choose the language in which you prefer to read the news.",
         button: "Finish",
      },
      es: {
         subtitle: "Paso 2: Selecciona tu idioma",
         description: "Elige el idioma en el que prefieres leer las noticias.",
         button: "Finalizar",
      },
   },
}

let preferences = {}

let section = ""
let language = getUserLanguage()

export function initCountryAndLengagePopUp() {
   const localStoragePreferences = window.localStorage.getItem("preferences")
   const body = document.querySelector("body")

   if (!localStoragePreferences) {
      body.style.overflow = "hidden"
      const container = document.createElement("div")
      container.classList.add("pop-up_select-country-container")
      container.innerHTML = `         
       <div class="pop-up_select-country">
             <h1 class="pop-up_title">
                ${textContent.general[language].title}
             </h1>
             <div class="pop-up_progress-bar-container">
                <div class="pop-up_progress-bar" id="bar-1"></div>
                <div class="pop-up_progress-bar" id="bar-2"></div>
             </div>
             <h2 class="pop-up_subtitle">
             </h2>
             <p class="pop-up_description">
 
             <div class="pop-up_selector-container">
 
             </div>
 
             </p>                  
             <div class="pop-up_button-container">
                <button class="pop-up_button-next-section">${textContent.general[language].nextButton}</button>
             </div>
          </div>`
      body.appendChild(container)

      section = "country"
      renderCountrySection(container)
   }
}

function renderCountrySection(container) {
   if (window.localStorage.getItem("preferences")) {
      container.remove()
   }

   // ? Modificando la barra de progreso
   container
      .querySelector(section === "country" ? "#bar-1" : "#bar-2")
      .classList.add("pop-up_progress-bar-checked")

   const subtitle = container.querySelector(".pop-up_subtitle")
   const description = container.querySelector(".pop-up_description")
   const selectorContainer = container.querySelector(
      ".pop-up_selector-container",
   )
   const nextButton = container.querySelector(".pop-up_button-next-section")

   subtitle.innerHTML = `<i class="fa fa-globe"></i>${textContent[section][language].subtitle}`
   description.textContent = textContent[section][language].description

   if (section === "country") {
      const selectorCountry = document.createElement("select")
      selectorCountry.classList.add("pop-select_input-country")

      countries.forEach((element) => {
         selectorCountry.innerHTML += `<option value=${element.code}>${element.country}</option>`
      })

      selectorContainer.appendChild(selectorCountry)

      nextButton.addEventListener("click", () => {
         section = "language"
         preferences["country"] = selectorCountry.value
         renderCountrySection(container)
      })
   } else {
      selectorContainer.innerHTML = ""
      const selectorLanguage = document.createElement("select")
      selectorLanguage.classList.add("pop-select_input-country")
      selectorLanguage.disabled = true

      countries.forEach((element) => {
         if (element.code === preferences.country) {
            selectorLanguage.innerHTML += `<option value=${element.lang_code} selected>${element.language}</option>`
         }
      })

      selectorContainer.appendChild(selectorLanguage)

      nextButton.textContent = textContent.language[language].button
      nextButton.addEventListener("click", () => {
         document.querySelector("body").style.overflow = "scroll"
         preferences["language"] = selectorLanguage.value
         window.localStorage.setItem("preferences", JSON.stringify(preferences))
         renderCountrySection(container)
         launchSlider()
         relaunchNewsInScroll()
      })
   }
}
