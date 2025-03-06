import { getNews, convertDateFormat } from "./services/wordNewsApi.js"
import { getUserLanguage } from "./countryAndLenguagePupUp.js"

function calcularTiempoLectura(texto, velocidad = 200) {
   const palabras = texto.split(/\s+/).length
   const tiempo = palabras / velocidad
   return Math.ceil(tiempo)
}

const lenguage = getUserLanguage()

const textContent = {
   es: {
      title: "Noticias",
      timeToRead: "min de lectura",
   },
   en: {
      title: "News",
      timeToRead: "min read",
   },
}

let pastDays = 0
let nextPageNews = undefined
let currDate = convertDateFormat(getPastDate(pastDays))
let firstDateAndTitleRender = true

async function renderNewsInScroll(news) {
   const container = document.querySelector(".news_scroll-title-container")

   if (pastDays === 0 && firstDateAndTitleRender) {
      container.innerHTML += `
       <h2 class="title-section section_front-pages-title">
          ${getDayLabel(new Date())[lenguage]} ${textContent[lenguage].title}
       </h2>
       <span class="title-section news_scroll-number-date"
          >${convertDateFormat(new Date())}</span
       >`
   }
   firstDateAndTitleRender = false

   if (news.top_news) {
      news.top_news.forEach((element, index) => {
         const eachNews = element.news[0]

         container.innerHTML += `
             <article class="news_scroll-news-card ${news.top_news.length - 1 === index ? "last-item" : ""}" id="${index}">
                <img
                   src=${eachNews.image}
                   alt="News image"
                   class="news-card_img-cover"
                />
                <div class="news-card_text-container">
                   <div class="news-card_text-props">
                      <div class="news-card_props-date">
                         <i class="fa fa-clock"></i>${eachNews.publish_date.split(" ", 1)}
                      </div>
                      <span class="news-card_text-props-spacer">•</span>
                      <div class="news-card_props-author">
                         <i class="fa fa-user"></i>${eachNews.author}
                      </div>
                      <span class="news-card_text-props-spacer">•</span>
                      <div class="news-card_props-date">
                         <i class="fa fa-clock"></i>${calcularTiempoLectura(eachNews.text)} ${textContent[lenguage].timeToRead}
                      </div>
                   </div>
                   <h3 class="news-card_text-title">
                     ${eachNews.title}
                   </h3>
                   <p>
                      <!-- TODO: render caractees especiales en js -->
                     ${eachNews.summary}
                   </p>
                </div>
             </article>
          `
         nextPageNews = news.nextPage
      })
      if (!nextPageNews) {
         pastDays += 1
         currDate = convertDateFormat(getPastDate(pastDays))
         nextPageNews = 1

         let currentDate = getPastDate(pastDays)
         let dayLevel = getDayLabel(new Date(currentDate))

         container.innerHTML += `
              <h2 class="title-section section_front-pages-title">
                  ${dayLevel[lenguage] || dayLevel} ${textContent[lenguage].title}
              </h2>
              <span class="title-section news_scroll-number-date">
                  ${convertDateFormat(currentDate)}
              </span>
          `
      }
   }
}
function getDayLabel(date) {
   let today = new Date()
   let formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

   let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

   if (formattedDate === formattedToday) {
      return { es: "Hoy", en: "Today" }
   }

   today.setDate(today.getDate() - 1)
   let formattedYesterday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
   if (formattedDate === formattedYesterday) {
      return { es: "Ayer", en: "Yesterday" }
   }

   return formattedDate
}

function getPastDate(daysAgo) {
   let date = new Date()
   date.setDate(date.getDate() - daysAgo)
   return date
}

let isLoading = false

function lazyLoadingNews() {
   const preferences = JSON.parse(window.localStorage.getItem("preferences"))
   const container = document.querySelector(".news_scroll-title-container")
   let lastItem = container.querySelector(".last-item")

   const observer = new IntersectionObserver(async (entry) => {
      entry.forEach(async (element) => {
         if (element.isIntersecting && !isLoading) {
            let news = null
            isLoading = true
            observer.unobserve(element.target)

            news = await getNews(
               preferences.country,
               currDate,
               preferences.language,
               nextPageNews,
            )

            if (news) {
               document
                  .querySelectorAll(".news_scroll-news-card.last-item")
                  .forEach((el) => el.classList.remove("last-item"))

               await renderNewsInScroll(news)

               lastItem = container.querySelector(".last-item")
               if (lastItem) {
                  observer.observe(lastItem)
               }
            }

            isLoading = false
         }
      })
   })

   observer.observe(lastItem)
}

export async function initNewsInScroll() {
   const preferences = JSON.parse(window.localStorage.getItem("preferences"))

   const news = await getNews(
      preferences.country,
      currDate,
      preferences.language,
      1,
   )

   if (news) {
      await renderNewsInScroll(news)
      lazyLoadingNews()
   }
}

export function relaunchNewsInScroll() {
   const container = document.querySelector(".news_scroll-title-container")
   container.innerHTML = ""
   pastDays = 0
   nextPageNews = undefined
   currDate = convertDateFormat(getPastDate(pastDays))
   firstDateAndTitleRender = true
   initNewsInScroll()
}
