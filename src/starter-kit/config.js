const path = require('path');

const launchOptionForLambda = [
    // error when launch(); No usable sandbox! Update your kernel
    '--no-sandbox',
    // error when launch(); Failed to load libosmesa.so
    '--disable-gpu',
    // freeze when newPage()
    '--single-process',
];

const localChromePath = path.join('headless_shell.tar.gz');
const remoteChromeS3Bucket = process.env.CHROME_BUCKET;
const remoteChromeS3Key = process.env.CHROME_KEY || 'headless_shell.tar.gz';

const setupChromePath = path.join(path.sep, 'tmp');
const executablePath = path.join(
    setupChromePath,
    'headless_shell'
);

const DEBUG = process.env.DEBUG;

const debugLog = (log) => {
    if (DEBUG) {
      let message = log;
      if (typeof log === 'function') message = log();
      Promise.resolve(message).then(
        (message) => console.log(message)
      );
    }
  };

module.exports = {
    launchOptionForLambda,
    localChromePath,
    remoteChromeS3Bucket,
    remoteChromeS3Key,
    setupChromePath,
    executablePath,
    debugLog,
};
