import { themeHandle, themeInit } from "./theme.js"
import { launchSlider } from "./topNewsSlider.js"
import { initCountryAndLengagePopUp } from "./countryAndLenguagePupUp.js"
import { menuInit } from "./menuHeader.js"
import { initNewsInScroll } from "./newsLazyLoading.js"
import { initScrollTopButton } from "./scrollTopButton.js"
import { initViewTransitions } from "./viewTransition.js"

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
