const fs = require('fs');
const path = require('path');
const async = require('async');
const prompt = require('prompt');

const envParams = ['PORT', 'ACCOUNT_ID', 'ACCESS_TOKEN', 'EBAY_APP_ID'];

prompt.start();

async.waterfall([
  (callback) => prompt.get(envParams, callback),
  (results, callback) => {
    let envData = '';
    async.each(Object.keys(results), (result, callback) => {
      envData += `${result}=${results[result]}\n`;
      callback();
    }, (err) => callback(err, envData));
  },
  (envData, callback) => fs.writeFile(path.join(__dirname, '../.env'), envData, callback),
], err => (err ? console.log('ERROR: ', err) : console.log('Successfully created .env file 🔥🔥🔥')));
