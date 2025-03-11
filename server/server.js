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

const temporalNews = {
   news: [
      {
         id: 297712032,
         title: "Russia bombards Ukraine’s energy grid after Zelensky says his team will hold talks with the US",
         text: "Russia targeted Ukraine’s energy infrastructure in a large-scale missile and drone bombardment during the night, officials said Friday, hours after Ukrainian President Volodymyr Zelensky said talks with the US on ending the 3-year war will take place next week.\n\nUkraine came under a “massive missile and drone” attack, Energy Minister Herman Halushchenko wrote on Facebook.\n\nAt least 10 people, including a child, were injured, authorities said.\n\n“Russia is trying to hurt ordinary Ukrainians by striking energy and gas production facilities, without abandoning its goal of leaving us without light and heat, and causing the greatest harm to ordinary citizens,” Halushchenko wrote.\n\nRussia has repeatedly targeted Ukraine’s power grid during the war.\n\nThe attacks have depleted electricity generation capacity and disrupted critical heating and water supplies.\n\nUkrainian officials have accused Russia of “weaponizing winter” in an effort to erode civilian morale.\n\nRussia fired 67 missiles from air, land and sea and launched 194 strike and decoy drones, Ukraine’s air force said.\n\nTheir primary target was Ukraine’s natural gas extraction facilities, it said.\n\nFor the first time, Ukraine deployed French Mirage-2000 warplanes delivered a month ago to help repel the attack, according to the air force.\n\nUkraine also has Western-supplied F-16 fighter jets to shoot down Russian missiles.\n\nUkrainian defenses downed 34 missiles and 100 drones, the air force said, while up to 10 missiles didn’t reach their targets and 86 drones were lost from radars, presumably jammed by electronic warfare.\n\nWestern-supplied air defense systems are crucial for Ukraine’s fight but further US help is uncertain under US President Donald Trump, who says he is determined to end the war and has paused American military aid for Kyiv as a way of pressuring Zelensky to negotiate.\n\nIn his nightly address, Zelensky said Thursday he would travel to Saudi Arabia on Monday to meet the country’s crown prince, and his team would stay on to hold talks with US officials.\n\nZelensky welcomed a European Union plan to bolster the continent’s defenses. He expressed hope that some of the new spending could be used to strengthen Ukraine’s own defense industry.",
         summary:
            "Ukraine came under a “massive missile and drone” attack, Energy Minister Herman Halushchenko wrote on Facebook.",
         url: "https://nypost.com/2025/03/07/world-news/russia-attacks-ukraines-energy-grip-after-zelensky-announces-peace-talks-with-us/",
         image: "https://nypost.com/wp-content/uploads/sites/2/2025/03/newspress-collage-nk9a4d1w8-1741345467510.jpg?quality=75&strip=all&1741327493&w=1200",
         video: "https://cdn.jwplayer.com/videos/i7Jqs09n-RyIcpnTz.mp4",
         publish_date: "2025-03-07 11:19:31",
         author: "Associated Press",
         authors: ["Associated Press"],
         language: "en",
         source_country: "us",
         sentiment: 0.02,
      },
   ],
}

app.get("/api/news/:id", async (req, res) => {
   // const { id } = req.params
   // console.log(id)
   // try {
   //    const response = await fetch(
   //       `${WORD_NEWS_API_PATH}/retrieve-news?ids=${id}&api-key=${WORD_NEWS_API_KEY}`,
   //    )
   //    const data = await response.json()
   //    res.json(data)
   // } catch (error) {
   //    console.error("Error fetching news:", error)
   //    res.status(504).send()
   // }
   res.json(temporalNews)
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
