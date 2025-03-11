const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")

app.use(cors())

app.use(express.static(path.resolve(__dirname, "..", "App", "src")))
app.use(express.static(path.resolve(__dirname, "..", "App", "src", "assets")))

// Serve HTML
app.get("/", (req, res) => {
   res.sendFile(path.resolve(__dirname, "..", "App", "src", "index.html"))
})

// Serve js
app.get("/*.js", (req, res) => {
   res.type("text/javascript") // Asegurar el MIME type
   res.sendFile(path.resolve(__dirname, "..", "App", "src"))
})

app.get("/news/:id", (req, res) => {
   res.sendFile(
      path.resolve(__dirname, "..", "App", "src", "pages", "news.html"),
   )
})

// API handlers
// TODO: cambiar las funciones de los fetch a un archivo particular
const { WORD_NEWS_API_PRODUCTION_KEY, WORD_NEWS_API_DEVELOPER_KEY } =
   process.env

const WORD_NEWS_API_KEY = WORD_NEWS_API_PRODUCTION_KEY

const WORD_NEWS_API_PATH = `https://api.worldnewsapi.com`

let cacheNews = {}

//? entrega las primeras 10 noticias las mas destacadas
app.get("/api/top-news", async (req, res) => {
   const { date, language } = req.query
   const parseQuerys = new URLSearchParams(req.query).toString()

   const country = req.query["source-country"]

   if (!cacheNews[country]) {
      cacheNews[country] = {}
   }

   if (!cacheNews[country][language]) {
      cacheNews[country][language] = {}
   }

   if (cacheNews[country][language][date]) {
      return res.json({
         country: cacheNews[country][language][date].country,
         language: cacheNews[country][language][date].language,
         top_news: cacheNews[country][language][date].top_news.slice(0, 10),
      })
   }

   try {
      const response = await fetch(
         `${WORD_NEWS_API_PATH}/top-news?api-key=${WORD_NEWS_API_KEY}&${parseQuerys}`,
      )

      const data = await response.json()

      let newsToReturn = data.top_news

      newsToReturn = data.top_news.slice(0, 10)

      cacheNews[country][language][date] = {
         country: data.country,
         language: data.language,
         top_news: data.top_news,
      }

      res.json({
         country: data.country,
         language: data.language,
         top_news: newsToReturn,
      })
   } catch (error) {
      console.error("Error fetching news:", error)
      res.status(504).send()
   }
})

// ? regresa un objeto con la siguiente pagina si la siguiente pagina no existe regresa null
app.get("/api/news", async (req, res) => {
   const { date, language, page } = req.query
   const parseQuerys = new URLSearchParams(req.query).toString()

   let realPage = Number(page) + 1
   let nextPage = realPage
   const country = req.query["source-country"]

   cacheNews[country] = cacheNews[country] || {}
   cacheNews[country][language] = cacheNews[country][language] || {}

   if (cacheNews[country][language][date]) {
      const cachedData = cacheNews[country][language][date]

      if (realPage * 10 >= cachedData.top_news.length) {
         nextPage = null
      }

      if (realPage === 2 && realPage * 10 - 10 >= cachedData.top_news.length) {
         realPage = 1
      }

      const newsSlice = cachedData.top_news.slice(
         realPage * 10 - 10,
         realPage * 10,
      )
      if (newsSlice.length === 0) {
         return res.status(404).json({ content: "No more news to see" })
      }

      return res.json({
         country: cachedData.country,
         language: cachedData.language,
         top_news: newsSlice,
         nextPage,
      })
   }

   try {
      const response = await fetch(
         `${WORD_NEWS_API_PATH}/top-news?api-key=${WORD_NEWS_API_KEY}&${parseQuerys}`,
      )
      const data = await response.json()

      let newsToReturn = data.top_news

      if (realPage * 10 >= newsToReturn.length) {
         nextPage = null
      }

      if (realPage === 2 && realPage * 10 - 10 >= newsToReturn.length) {
         realPage = 1
      }

      const startIndex = realPage * 10 - 10
      if (startIndex >= newsToReturn.length) {
         return res.status(404).json({ content: "No more news to see" })
      }

      newsToReturn = newsToReturn.slice(startIndex, realPage * 10)

      cacheNews[country][language][date] = {
         country: data.country,
         language: data.language,
         top_news: data.top_news,
      }

      res.json({
         country: data.country,
         language: data.language,
         top_news: newsToReturn,
         nextPage,
      })
   } catch (error) {
      console.error("Error fetching news:", error)
      res.status(504).send()
   }
})

app.get("/api/news/:id", async (req, res) => {
   const { id } = req.params
   console.log(id)
   try {
      const response = await fetch(
         `${WORD_NEWS_API_PATH}/retrieve-news?ids=${id}&api-key=${WORD_NEWS_API_KEY}`,
      )
      const data = await response.json()
      res.json(data)
   } catch (error) {
      console.error("Error fetching news:", error)
      res.status(504).send()
   }
})

// 404 page
app.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "..", "App", "src"))
})

function clearCache() {
   console.log("Clearing cache...")
   cacheNews = {}
   console.log("Cache cleared!")
}

setInterval(clearCache, 24 * 60 * 60 * 1000)

app.listen(3300, () => {
   console.log("Desplegado")
})
