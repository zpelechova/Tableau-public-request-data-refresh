const Apify = require('apify')
const {
    utils: { log, puppeteer }
} = Apify

Apify.main(async () => {
    const { url, email, password } = await Apify.getInput()

    const requestList = await Apify.openRequestList('start-urls', [url])

    const crawler = new Apify.PuppeteerCrawler({
        requestList,
        handlePageFunction: async context => {
            const { url } = context.request

            log.info('Page opened.', { url })

            console.log('Launching Puppeteer...')
            const browser = await Apify.launchPuppeteer({})

            console.log('Signing in ...')
            const page = await browser.newPage()
            await page.goto(`${url}?authMode=signIn`, {
                waitUntil: 'networkidle2'
            })
            await page.type('#email', email, { delay: 100 })
            await page.type('#password', password, { delay: 100 })
            await page.waitForTimeout(5000)
            await puppeteer.injectJQuery(page)
            await page.evaluate(() => {
                $('button:contains(Sign In)').click()
            })
            await page.waitForTimeout(5000)
            const signinError = await page.evaluate(
                () => $('.SignInForm_authError__3LVX_').length
            )
            if (signinError === 1) {
                console.log(
                    'You used invalid email or password, the authentification failed, aborting the run.'
                )
            }
            if (signinError === 0) {
                console.log('Signed in...')
                await page.waitForTimeout(5000)
                await page.goto(url, { waitUntil: 'networkidle2' })
                await puppeteer.injectJQuery(page)
                const refreshButton = await page.evaluate(
                    () => $('button:contains(Request Data Refresh)').length
                )
                if (refreshButton === 1) {
                    console.log('Requesting Data Refresh')
                    await page.evaluate(() => {
                        $('button:contains(Request Data Refresh)').click()
                    })
                    console.log('Data refresh requested.')
                } else {
                    console.log('The button for data refresh cannot be found on the page. Make sure your dashboard has this feature and/or try again.')
                }
            }
            await browser.close()
        }
    })

    log.info('The process has started.')
    await crawler.run()
    log.info('The process has finished.')
})