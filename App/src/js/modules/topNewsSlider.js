import { convertDateFormat, getTopNews } from "./services/wordNewsApi.js"
import {
   getUserLanguage,
   initCountryAndLengagePopUp,
} from "../modules/countryAndLenguagePupUp.js"

let news = undefined
let currentUserSliderPosition = 0
let currentSliderRenderNews = 0
let autoScrolling = false
let userHasScrolled = false
let sourceIndex = 0
let observer = null
let preferences = undefined
let restartDots = false

const textContent = {
   es: {
      noNewsContent:
         "No hay noticias disponibles en tu idioma o región. Intenta cambiar la región o el idioma en las preferencias",
      noNewsContentButton: "Ir a preferencias",
   },
   en: {
      noNewsContent:
         "There are no news available in your language or region. Try changing the region or language in preferences.",
      noNewsContentButton: "Go to Preferences",
   },
}

export function sliderNewsDots(newsArray, isVisibleId) {
   const containerDots = document.querySelector(
      ".main-content_dots-slider-container",
   )

   if (containerDots.childElementCount == 0 || restartDots) {
      containerDots.innerHTML = ""
      for (let i = 0; i < newsArray.length; i++) {
         const dotChild = document.createElement("div")
         dotChild.setAttribute("id", `${i}`)

         dotChild.classList.add("main-content_dot")

         containerDots.appendChild(dotChild)
      }
   }

   const dots = containerDots.querySelectorAll(".main-content_dot")

   dots.forEach((dot) => {
      dot.classList.remove("main-content_dot-current")
      if (dot.id === isVisibleId) {
         dot.classList.add("main-content_dot-current")
      }
   })
}

function renderNoContentWarning(container) {
   let language = getUserLanguage()
   if (news.length === 0) {
      container.classList.add("no-news_content-container")
      container.innerHTML = `
         <p>${textContent[language].noNewsContent}</p>
      `
      const buttonGoToPreferences = document.createElement("button")
      container.appendChild(buttonGoToPreferences)
      buttonGoToPreferences.textContent =
         textContent[language].noNewsContentButton

      buttonGoToPreferences.addEventListener("click", () => {
         window.localStorage.removeItem("preferences")
         initCountryAndLengagePopUp()
      })

      return
   }
   container.classList.remove("no-news_content-container")
}

export async function initTopNewsSlider() {
   if (preferences) {
      const container = document.querySelector(
         ".main-content_top-news-container",
      )
      const date = new Date()

      container.innerHTML += "<p>cargando</p>"

      await new Promise(requestAnimationFrame)

      try {
         const response = await getTopNews(
            preferences.country,
            convertDateFormat(date),
            preferences.language,
            10,
         )
         news = response.top_news

         if (news) {
            container.innerHTML = ""
            restartDots = true
            onUserSliderScroll()
            autoSliderNews()
            renderNewsInSlider(news)
            sliderNewsDots(news, 0)
            restartDots = false
         }
         renderNoContentWarning(container)
      } catch (error) {
         console.log(error)
      }
   }
}

export function renderNewsInSlider(newsArray) {
   const container = document.querySelector(".main-content_top-news-container")

   if (newsArray.length - 1 < currentSliderRenderNews) {
      currentSliderRenderNews = 0
   }

   if (newsArray.length !== 0) {
      const { title, summary, image, author, url } =
         newsArray[currentSliderRenderNews].news[sourceIndex]

      const card = document.createElement("div")
      card.classList.add("main-content_card")
      card.setAttribute("id", currentSliderRenderNews)

      card.innerHTML = `
                <img
                   src="${image}"
                   alt="News image"
                   class="news-card_img"
                />
                <div class="main-content_card-text-container">
                   <div>
                      <p class="card_title">
                         ${title}
                      </p>
                      <p class="card_summary">
                         ${summary}
                      </p>
                      <p class="card_author">Author: ${author}</p>
                   </div>
                                        <a
                         href="${url}"
                         aria-label="Read more"
                         class="card_read-more"
                         >Leer mas ></a
                      >
                </div>
             `

      container.appendChild(card)

      if (observer === null) {
         observer = new IntersectionObserver(
            (entrys) => {
               entrys.forEach((entry) => {
                  if (entry.isIntersecting) {
                     if (newsArray.length - 1 == entry.target.id) {
                        currentUserSliderPosition = news.length + 1
                     }

                     if (entry.target.id === "loading-card") {
                        entry.target.previousElementSibling.remove()
                        sourceIndex++
                        if (
                           newsArray[newsArray.length - 1].news.length - 1 ===
                           sourceIndex
                        ) {
                           sourceIndex = 0
                        }
                        currentSliderRenderNews = 0

                        renderNewsInSlider(newsArray)
                     } else {
                        currentUserSliderPosition = Number(entry.target.id) + 1
                     }

                     sliderNewsDots(newsArray, entry.target.id)
                  }
               })
            },
            { root: container },
         )
      }

      observer.observe(card)
      if (currentSliderRenderNews === newsArray.length - 1) {
         const lastCard = document.createElement("div")

         lastCard.classList.add("main-content_card")
         lastCard.setAttribute("id", "loading-card")

         container.appendChild(lastCard)
         observer.observe(lastCard)
      }

      currentSliderRenderNews++
   }
}

export function renderAllTopNewsIfUserHasScrolled() {
   // ? Si el usuario hace scroll rendrizamos todas las cards
   if (userHasScrolled) {
      for (let i = currentSliderRenderNews; i < news.length; i++) {
         renderNewsInSlider(news)
      }
   }
}

export function onUserSliderScroll() {
   // ? Vemos si el usuario hiso scroll o si fue el auto scroll
   const container = document.querySelector(".main-content_top-news-container")
   container.addEventListener("scroll", () => {
      if (!autoScrolling) {
         userHasScrolled = true
         renderAllTopNewsIfUserHasScrolled()
      }
   })
}

// TODO: quitar la posicion del usurio de aqui y dejar todo para el observer
export function autoSliderNews() {
   // ? avanzamos el scroll automaticamente y tambien la posicion de este
   setInterval(() => {
      if (!userHasScrolled) {
         autoScrolling = true
         renderNewsInSlider(news)
         const container = document.querySelector(
            ".main-content_top-news-container",
         )

         container.scrollTo(
            container.clientWidth * currentUserSliderPosition + 1,
            0,
         )

         setTimeout(() => {
            autoScrolling = false
         }, 800)
      }
   }, 3500)
}

export async function launchSlider() {
   preferences = JSON.parse(window.localStorage.getItem("preferences"))
   news = undefined
   currentUserSliderPosition = 0
   currentSliderRenderNews = 0
   autoScrolling = false
   userHasScrolled = false
   sourceIndex = 0
   observer = null
   restartDots = false

   if (preferences) {
      await initTopNewsSlider()
   }
}
