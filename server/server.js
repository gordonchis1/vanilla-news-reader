/* eslint-disable no-undef */
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.static(path.resolve(__dirname, "..", "App", "src")));

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "App", "src", "index.html"));
});
// Serve js
app.get("/*.js", (req, res) => {
  res.type("text/javascript"); // Asegurar el MIME type
  res.sendFile(path.resolve(__dirname, "..", "App", "src"));
});

// API handlers
// TODO: cambiar las funciones de los fetch a un archivo particular
const { WORD_NEWS_API_KEY } = process.env;
const WORD_NEWS_API_PATH = `https://api.worldnewsapi.com`;

let cacheNews = {};

//? entrega las primeras 10 noticias las mas destacadas
app.get("/api/top-news", async (req, res) => {
  const { date, language } = req.query;
  const parseQuerys = new URLSearchParams(req.query).toString();

  const country = req.query["source-country"];

  if (!cacheNews[country]) {
    cacheNews[country] = {};
  }

  if (!cacheNews[country][language]) {
    cacheNews[country][language] = {};
  }

  if (cacheNews[country][language][date]) {
    console.log("return cache");

    return res.json({
      country: cacheNews[country][language][date].country,
      language: cacheNews[country][language][date].lenguage,
      top_news: cacheNews[country][language][date].top_news.slice(0, 10),
    });
  }

  try {
    const response = await fetch(
      `${WORD_NEWS_API_PATH}/top-news?api-key=${WORD_NEWS_API_KEY}&${parseQuerys}`
    );

    console.log(response.url);

    const data = await response.json();
    console.log(data);

    let newsToReturn = data.top_news;

    newsToReturn = data.top_news.slice(0, 10);

    cacheNews[country][language][date] = {
      country: data.country,
      lenguage: data.language,
      top_news: data.top_news,
    };

    res.json({
      country: data.country,
      language: data.lenguage,
      top_news: newsToReturn,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(504).send();
  }
});

// ? regresa un objeto con la siguiente pagina si la siguiente pagina no existe regresa null
app.get("/api/news", async (req, res) => {
  const { date, language, page } = req.query;
  const parseQuerys = new URLSearchParams(req.query).toString();

  let realPage = Number(page) + 1;
  let nextPage = realPage;

  const country = req.query["source-country"];

  if (!cacheNews[country]) {
    cacheNews[country] = {};
  }

  if (!cacheNews[country][language]) {
    cacheNews[country][language] = {};
  }

  if (cacheNews[country][language][date]) {
    console.log("return cache");
    if (realPage * 10 >= cacheNews[country][language][date].top_news.length) {
      nextPage = null;
    }
    if (
      cacheNews[country][language][date].top_news.slice(
        realPage * 10 - 10,
        realPage * 10
      ).length == 0
    ) {
      return res.status(404).json({ content: "No more news to see" });
    }
    return res.json({
      country: cacheNews[country][language][date].country,
      language: cacheNews[country][language][date].lenguage,
      top_news: cacheNews[country][language][date].top_news.slice(
        realPage * 10 - 10,
        realPage * 10
      ),
      nextPage,
    });
  }

  try {
    const response = await fetch(
      `${WORD_NEWS_API_PATH}/top-news?api-key=${WORD_NEWS_API_KEY}&${parseQuerys}`
    );

    const data = await response.json();

    let newsToReturn = data.top_news;

    console.log(data);

    if (realPage * 10 >= newsToReturn.length) {
      nextPage = null;
    }

    if (realPage == 2 && realPage * 10 - 10 >= newsToReturn.length) {
      realPage = 1;
    }
    const startIndex = realPage * 10 - 10;
    console.log(realPage, startIndex, newsToReturn.length);

    if (startIndex >= newsToReturn.length) {
      return res.status(404).json({ content: "No more news to see" });
    }
    newsToReturn = data.top_news.slice(realPage * 10 - 10, realPage * 10);

    cacheNews[country][language][date] = {
      country: data.country,
      lenguage: data.language,
      top_news: data.top_news,
    };

    res.json({
      country: data.country,
      language: data.lenguage,
      top_news: newsToReturn,
      nextPage,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(504).send();
  }
});

// 404 page
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "App", "src"));
});

app.listen(3300, "192.168.100.22", (url) => {
  console.log("Desplegado");
});
