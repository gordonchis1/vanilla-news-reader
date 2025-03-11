import { themeHandle, themeInit } from "./modules/theme.js"
import { launchSlider } from "./modules/topNewsSlider.js"
import { initCountryAndLengagePopUp } from "./modules/countryAndLenguagePupUp.js"
import { menuInit } from "./modules/menuHeader.js"
import { initNewsInScroll } from "./modules/newsLazyLoading.js"
import { initScrollTopButton } from "./scrollTopButton.js"
import { initViewTransitions } from "./modules/viewTransition.js"

export async function initNews() {
   await launchSlider()
   initNewsInScroll()
}

menuInit()
initScrollTopButton()
initNews()
initCountryAndLengagePopUp()
themeHandle()
themeInit()
initViewTransitions()
