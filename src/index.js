const AWS = require('aws-sdk');
const kms = new AWS.KMS();

const setup = require('./starter-kit/setup');
const main = require('./main').default;

const username = process.env.CONSULTANT_USERNAME;
const encryptedPassword = process.env.CONSULTANT_PASSWORD;
let decryptedPassword;

exports.handler = async (event, context, callback) => {
  // For keeping the browser launch
  context.callbackWaitsForEmptyEventLoop = false;
  const browser = await setup.getBrowser();

  const execute = (browser, username, password) => {
    exports.run(browser, username, password).then(
      (result) => callback(null, result)
    ).catch(
      (err) => callback(err)
    );
  };

  if (decryptedPassword) {
    execute(browser, username, decryptedPassword);
  } else {
    // Decrypt code should run once and variables stored outside of the function
    // handler so that these are decrypted once per container
    kms.decrypt({
      CiphertextBlob: new Buffer(encryptedPassword, 'base64'),
    }, (err, data) => {
      if (err) {
        console.log('Decrypt error:', err);
        return callback(err);
      }
      decryptedPassword = data.Plaintext.toString('ascii');
      execute(browser, username, decryptedPassword);
    });
  }
};

exports.run = async (browser, username, password) => {
  const results = await main(
    browser,
    username,
    password
  );
  return results;
};
