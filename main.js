const Apify = require('apify');
const { puppeteer } = Apify.utils;

Apify.main(async () => {
    const input = await Apify.getInput();

    const url = input.url;
    const email = input.email;
    const password = input.password;

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
});
