import { initCountryAndLengagePopUp } from "./modules/countryAndLenguagePupUp.js"
import { launchFontAwesomeIcons } from "./modules/fontAwesomeIcons.js"
import { menuInit } from "./modules/menuHeader.js"
import { relaunchNewsInScroll } from "./modules/newsLazyLoading.js"
import { themeHandle, themeInit } from "./modules/theme.js"
import { launchSlider } from "./modules/topNewsSlider.js"
import { initScrollTopButton } from "./scrollTopButton.js"
import { destroySlider } from "../js/modules/topNewsSlider.js"

export function destroyHomePage() {
   destroySlider()
}

export async function launchHomePage() {
   await launchSlider()
   relaunchNewsInScroll()
   initScrollTopButton()
   menuInit()
   initCountryAndLengagePopUp()
   themeHandle()
   themeInit()
   launchFontAwesomeIcons()
}
