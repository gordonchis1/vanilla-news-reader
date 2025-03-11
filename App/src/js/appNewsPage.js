import { toggleHeaderUserMenu } from "./menuHeader.js"
import { initCountryAndLengagePopUp } from "./countryAndLenguagePupUp.js"
import { themeHandle, themeInit } from "./theme.js"
import { launchNewsPage } from "./newsPage.js"
import { initViewTransitions } from "./viewTransition.js"
import { initScrollTopButton } from "./scrollTopButton.js"

initViewTransitions()
launchNewsPage()
toggleHeaderUserMenu()
initCountryAndLengagePopUp()
themeHandle()
themeInit()
initScrollTopButton()
