const config = require('./starter-kit/config');

const main = async (browser, username, password) => {
  if (! username || ! password) {
    throw new Error('Missing username and/or password');
  }

  debugLog('username in main', username);

  const page = await browser.newPage();
  await page.goto('https://www.myrfpulse.com/Account/LogOn');
  await page.waitForSelector('#UserName');

  debugLog('login page loaded');

  await page.evaluate(
    (username) => document.querySelector('#UserName').value = username,
    username
  );

  await page.evaluate(
    (password) => document.querySelector('#Password').value = password,
    password
  );

  const $loginBtn = await page.$('#submit');
  $loginBtn.click();
  await page.waitForNavigation();

  debugLog('logged in');

  await page.goto('https://www.myrfpulse.com/Performance');

  await page.waitForSelector('#gaugeData');

  debugLog('loaded performance page');

  const rfxTableSel = '.rfxTable tbody tr td:nth-child';

  const PSQV = await page.evaluate(
    () => document.querySelector('#gaugeData').innerText
  );
  const ECLegs = await page.evaluate(
    (table) => document.querySelector(`${table}(1) span`).innerText,
    rfxTableSel
  );
  const LVECLegs = await page.evaluate(
    (table) => document.querySelector(`${table}(2) span`).innerText,
    rfxTableSel
  );
  const L1L2Volume = await page.evaluate(
    (table) => document.querySelector(`${table}(3) span`).innerText,
    rfxTableSel
  );
  const L1L6Volume = await page.evaluate(
    (table) => document.querySelector(`${table}(4) span`).innerText,
    rfxTableSel
  );

  await page.goto('https://www.myrfpulse.com/Account/LogOff');
  await browser.close();

  const values = {
    PSQV,
    ECLegs,
    LVECLegs,
    L1L2Volume,
    L1L6Volume,
  };

  debugLog(JSON.stringify(values));

  return values;
};

exports.default = main;

const debugLog = (log) => {
  if (config.DEBUG) {
    let message = log;
    if (typeof log === 'function') message = log();
    Promise.resolve(message).then(
      (message) => console.log(message)
    );
  }
};
