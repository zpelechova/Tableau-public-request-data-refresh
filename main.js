const Apify = require('apify');
const { utils: { log, puppeteer } } = Apify;

Apify.main(async () => {
    const { url, email, password } = await Apify.getInput();

    const requestList = await Apify.openRequestList('start-urls', [url]);

    const crawler = new Apify.PuppeteerCrawler({
        requestList,
        handlePageFunction: async (context) => {
            const { url, email, password } = context.request;

            log.info('Page opened.', { url });

            console.log('Launching Puppeteer...');
            const browser = await Apify.launchPuppeteer({});
        
            console.log('Signing in ...');
            const page = await browser.newPage();
            await page.goto(`${url}?authMode=signIn`, { waitUntil: 'networkidle2' });
            await page.type('#email', email, { delay: 100 });
            await page.type('#password', password, { delay: 100 });
            await page.waitForTimeout(5000);
            await puppeteer.injectJQuery(page);
            await page.evaluate(() => { $('button:contains(Sign In)').click(); });
            console.log('Signed in...');
        
            console.log('Requesting Data Refresh');
            await page.waitForTimeout(10000);
            await page.goto(url, { waitUntil: 'networkidle2' });
            await puppeteer.injectJQuery(page);
            await page.evaluate(() => { $('button:contains(Request Data Refresh)').click(); });
            console.log('Done.');
        
            await browser.close();

        },
    });

    log.info('Starting the crawl.');
    await crawler.run();
    log.info('Crawl finished.');
});
