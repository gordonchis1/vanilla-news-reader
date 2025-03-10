// TODO: change the location of apikey
const NEWS_API_PATH = `http://localhost:3300/api`

// TODO: implementar diferentes lenguajes

export function convertDateFormat(date) {
   const year = date.getFullYear().toString()
   const month = (date.getMonth() + 1).toString().padStart(2, "0")
   const day = date.getDate().toString().padStart(2, "0")

   const formattedDate = `${year}-${month}-${day}`
   return formattedDate
}

export async function getTopNews(country, date, language) {
   try {
      const response = await fetch(
         `${NEWS_API_PATH}/top-news?source-country=${country}&language=${language}&date=${date}`,
      )
      const data = await response.json()
      return data
   } catch (error) {
      console.error(error)
   }
}

export async function getNews(country, date, language, page) {
   try {
      const response = await fetch(
         `${NEWS_API_PATH}/news?source-country=${country}&language=${language}&date=${date}&page=${page}`,
      )

      const data = await response.json()

      return data
   } catch (error) {
      console.error(error)
   }
}

export async function getNewsById(id) {
   try {
      const response = await fetch(`${NEWS_API_PATH}/news/${id}`)
      const data = await response.json()

      return data
   } catch (error) {
      console.error(error)
   }
}
