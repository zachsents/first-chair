import pup from "puppeteer"

// Important constants
const IKON = {
    login: "https://account.ikonpass.com/en/login",
    reservation: "https://account.ikonpass.com/en/myaccount/add-reservations/"
}
const EMAIL = ""
const PASSWORD = ""
const DATE = {
    month: 3,
    day: 29
}

// Open browser
const browser = await pup.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [`--window-size=800,600`]
})
const [page] = await browser.pages()

// Send some commands to fix browser view
await page._client.send('Emulation.clearDeviceMetricsOverride')

// Login to Ikon account
await page.goto(IKON.login)

// stupid fucking cookie acknowledgemnt that you have to click
// 3 times for some reason
await delay(1000)
await page.mouse.click(150, 430)
await delay(500)
await page.mouse.click(150, 430)
await delay(500)
await page.mouse.click(150, 430)
await delay(1000)

// login
await page.type("#email", EMAIL)
await page.type("#sign-in-password", PASSWORD)
await delay(500)
await page.click("button.submit")
await page.waitForNavigation()

// let's make the res
await page.goto(IKON.reservation)
await delay(300)
await page.type('input[placeholder="Search"]', "winter park")
await delay(300)
await page.click('.react-autosuggest__suggestions-list li')
await delay(300)
await page.keyboard.press('Tab')
await delay(300)
await page.keyboard.press('Enter')
await delay(300)

// pick date
let now = new Date()
let then = new Date()
then.setMonth(DATE.month - 1)
then.setDate(DATE.day)
await page.waitForSelector('.DayPicker-wrapper button:nth-of-type(2)')
for(let i = 0; i < DATE.month - now.getMonth() - 1; i++) {
    await page.click('.DayPicker-wrapper button:nth-of-type(2)')
    delay(300)
}
let datePicked = await page.$$(`.DayPicker-Day[aria-label="${then.toDateString()}"]:not(.DayPicker-Day--unavailable)`)

// Not available? suicide
if(!datePicked.length)
    process.exit()

datePicked[0].click()
await delay(300)


// confirm that hoe
await page.$$eval('button', buttons => buttons[9].click())
await delay(1000)
await page.$$eval('button', buttons => buttons[11].click())
await page.waitForSelector('input[type="checkbox"]')
await page.click('input[type="checkbox"]')
await delay(300)
await page.$$eval('button', buttons => buttons[9].click())

console.log("Reserved.")



/*
*   Returns a promise that resolves after a fixed amount of time
*/
function delay(ms) {
    return new Promise(res => setTimeout(() => res(), ms))
}
