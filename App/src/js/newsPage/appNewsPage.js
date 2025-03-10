import { toggleHeaderUserMenu } from "../modules/menuHeader.js"
import { initCountryAndLengagePopUp } from "../modules/countryAndLenguagePupUp.js"
import { themeHandle, themeInit } from "../modules/theme.js"
import { launchNewsPage } from "./newsPage.js"
import { initViewTransitions } from "../modules/viewTransition.js"
import { initScrollTopButton } from "../scrollTopButton.js"

initViewTransitions()
launchNewsPage()
toggleHeaderUserMenu()
initCountryAndLengagePopUp()
themeHandle()
themeInit()
initScrollTopButton()
