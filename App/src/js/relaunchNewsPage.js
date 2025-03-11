import { initCountryAndLengagePopUp } from "./countryAndLenguagePupUp.js"
import { launchFontAwesomeIcons } from "./fontAwesomeIcons.js"
import { menuInit } from "./menuHeader.js"
import { themeHandle, themeInit, updateThemeIcon } from "./theme.js"
import { initScrollTopButton } from "./scrollTopButton.js"
import { launchNewsPage } from "./newsPage.js"

export async function relaunchNewsPage() {
   await launchNewsPage()
   menuInit()
   initCountryAndLengagePopUp()
   themeHandle()
   themeInit()
   initScrollTopButton()
   updateThemeIcon()
   launchFontAwesomeIcons()
}
