const Apify = require('apify');

const { utils: { log } } = Apify;

Apify.main(async () => {
    // const { url, email, password } = await Apify.getInput();

    // const input = await Apify.getInput();
    const input= {
        "url": ["https://public.tableau.com/app/profile/alena.me.ov./viz/TOP_SLEVY/Dashboard1"],
        "email": "aja.mecirova@gmail.com",
        "password": "Czechitas2021*"
      }

    const url = input.url;
    // const email = input.email;
    // const password = input.password;

    const requestList = await Apify.openRequestList('start-urls', url);
    // const requestQueue = await Apify.openRequestQueue();
    // const proxyConfiguration = await Apify.createProxyConfiguration();

    const crawler = new Apify.PuppeteerCrawler({
        requestList,
        handlePageFunction: async (context) => {
            const { url } = context.request;
            const input= {
                "url": ["https://public.tableau.com/app/profile/alena.me.ov./viz/TOP_SLEVY/Dashboard1"],
                "email": "aja.mecirova@gmail.com",
                "password": "Czechitas2021*"
              }
        
            const email = input.email;
            const password = input.password;
            log.info('Page opened.', { url });

            console.log('Launching Puppeteer...');
            const browser = await Apify.launchPuppeteer({});
        
            console.log('Signing in ...');
            const page = await browser.newPage();
            await page.goto(`${url}?authMode=signIn`, { waitUntil: 'networkidle2' });
            await page.type('#email', email, { delay: 100 });
            await page.type('#password', password, { delay: 100 });
            await page.waitForTimeout(5000);
            // await page.injectJQuery();
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
