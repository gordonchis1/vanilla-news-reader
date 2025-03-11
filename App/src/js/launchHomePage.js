import { initCountryAndLengagePopUp } from "./countryAndLenguagePupUp.js"
import { launchFontAwesomeIcons } from "./fontAwesomeIcons.js"
import { menuInit } from "./menuHeader.js"
import { relaunchNewsInScroll } from "./newsLazyLoading.js"
import { themeHandle, themeInit } from "./theme.js"
import { launchSlider } from "./topNewsSlider.js"
import { initScrollTopButton } from "./scrollTopButton.js"
import { destroySlider } from "./topNewsSlider.js"

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
