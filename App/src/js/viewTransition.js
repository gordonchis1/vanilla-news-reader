import { destroyHomePage, launchHomePage } from "./launchHomePage.js"
import { relaunchNewsPage } from "./relaunchNewsPage.js"

export function initViewTransitions() {
   if (!window.navigation) return

   window.navigation.addEventListener("navigate", (event) => {
      if (!document.startViewTransition) return
      const toUrl = new URL(event.destination.url)

      if (toUrl.origin !== window.location.origin) return

      event.intercept({
         async handler() {
            const response = await fetch(event.destination.url)
            const text = await response.text()
            const [, head, data] =
               text.match(
                  /<head>([\s\S]*?)<\/head>[\s\S]*<body>([\s\S]*)<\/body>/i,
               ) || []

            document.startViewTransition(() => {
               document.head.innerHTML = head
               document.body.innerHTML = data

               if (toUrl.pathname === "/") {
                  launchHomePage()
               } else if (toUrl.pathname.startsWith("/news")) {
                  destroyHomePage()
                  relaunchNewsPage()
               }

               document.documentElement.scrollTop = 0
               setTimeout(() => {
                  document.documentElement.scrollTop = 0
               }, 0)
            })
         },
      })
   })
}
