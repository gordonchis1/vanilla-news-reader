import { initCountryAndLengagePopUp } from "../modules/countryAndLenguagePupUp.js"
import { launchFontAwesomeIcons } from "../modules/fontAwesomeIcons.js"
import { menuInit } from "../modules/menuHeader.js"
import { themeHandle, themeInit, updateThemeIcon } from "../modules/theme.js"
import { initScrollTopButton } from "../scrollTopButton.js"
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
