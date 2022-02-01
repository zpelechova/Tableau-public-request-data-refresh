const Apify = require('apify')

const {
    utils: { log, puppeteer, sleep }
} = Apify

Apify.main(async () => {
    const { url, email, password } = await Apify.getInput()
    const loginUrl = `${url}?authMode=signIn`

    const requestList = await Apify.openRequestList(null, [loginUrl])

    const crawler = new Apify.PuppeteerCrawler({
        requestList,
        handlePageFunction: async ({ page, request }) => {
            await puppeteer.injectJQuery(page)

            log.info('Login page opened.', { url: request.url })
            log.info('Signing in...')

            await page.type('#email', email, { delay: 100 })
            await page.type('#password', password, { delay: 100 })
            await sleep(5000)

            await page.evaluate(() => $('button:contains(Sign In)').click()) // eslint-disable-line
            await sleep(5000)

            const loginSuccessful = await page.evaluate(
                () => !$('.SignInForm_authError__3LVX_').length
            ) // eslint-disable-line
            let retries = 3
            if (loginSuccessful) {
                log.info('Signed in.')
                log.info('Navigating to dashboard...')
                await sleep(5000)

                await page.goto(url, { waitUntil: 'networkidle2' })
                log.info('Dashboard opened.', { url })
                await puppeteer.injectJQuery(page)

                const refreshButtonAvailable = await page.evaluate(
                    () => $('button:contains(RequestDataRefresh)').length
                ) // eslint-disable-line
                if (refreshButtonAvailable) {
                    log.info('Requesting Data Refresh...')
                    await page.evaluate(() =>
                        $('button:contains(Request Data Refresh)').click()
                    ) // eslint-disable-line
                    log.info('Data refresh requested.')
                } else {
                    retries -= 1
                    if (retries > 0) {
                        throw new Error(
                            'The button for data refresh cannot be found on the page. Make sure your dashboard has this feature and/or try again.'
                        )
                    } else {
                        log.error(
                            'It seems the button to refresh data were not found three times. Not going to try again.'
                        )
                        process.exit(1)
                    }
                }
            } else {
                request.noRetry = true
                log.error(
                    'You used invalid email or password, the authentication failed, aborting the run.'
                )
                process.exit(1)
            }
        },
        preNavigationHooks: [
            async (crawlingContext, gotoOptions) => {
                gotoOptions.waitUntil = 'networkidle2'
            }
        ]
    })

    log.info('The process has started.')
    await crawler.run()
    log.info('The process has finished.')
})
