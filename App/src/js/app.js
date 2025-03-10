import { themeHandle, themeInit } from "./modules/theme.js"
import { launchSlider } from "./modules/topNewsSlider.js"
import { initCountryAndLengagePopUp } from "./modules/countryAndLenguagePupUp.js"
import { toggleHeaderUserMenu } from "./modules/menuHeader.js"
import { initNewsInScroll } from "./modules/newsLazyLoading.js"
import { initScrollTopButton } from "./scrollTopButton.js"
import { initViewTransitions } from "./modules/viewTransition.js"

export async function initNews() {
   await launchSlider()
   initNewsInScroll()
}

toggleHeaderUserMenu()
initScrollTopButton()
initNews()
initCountryAndLengagePopUp()
themeHandle()
themeInit()
initViewTransitions()
