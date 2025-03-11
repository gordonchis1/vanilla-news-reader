import { getNewsById } from "./services/wordNewsApi.js"

let news = undefined

export async function getNewsContent(id) {
   if (id) {
      const response = await getNewsById(id)
      news = await response.news[0]
   }
}

export function changeTitle() {
   document.title = `${news.title} - News`
}

export function renderNews() {
   const contentContainer = document.querySelector(".news-container")

   let authors = undefined

   if (news.authors) {
      authors = news.authors.join(", ")
   } else {
      authors = "Unknown"
   }

   const summaryCleanText = news.summary
      .replace(/&nbsp;/g, "")
      .replace(/\n+/g, "<br>")

   const textCleanText = news.text
      .replace(/&nbsp;/g, "")
      .replace(/\n+/g, "</p><p>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>")

   contentContainer.innerHTML = `
    <div class="news-container">
            <h1 class="news-title">${news.title}</h1>
            <span class="news-authors"><i class="fa fa-user"></i>${authors}</span>
           <span class="news-publis_date"
               ><i class="fa fa-clock"></i>${news.publish_date}</span
            >
            <img
               src="${news.image}"
               alt="New image"
               class="news-image"
            />
            <p class="news-summary">
               ${summaryCleanText}
            </p>
            <div class="news-text-container"><p>${textCleanText}</p></div>
            <div class="news-sorce-link"><span>Fuente: </span> <a href="${news.url}">${news.url}</a></div>
         </div>`
}

export async function launchNewsPage() {
   let path = window.location.pathname
   let id = path.split("/").pop()

   await getNewsContent(id)
   changeTitle()
   renderNews()
}
