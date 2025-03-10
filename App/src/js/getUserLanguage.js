export function getUserLanguage() {
   let [language] = navigator.language.split("-", 1)

   if (!language == "en" || !language == "es") {
      console.log(language)
      language = "en"
   }

   return language
}
