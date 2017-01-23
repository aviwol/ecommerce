import amazon from 'amazon-product-api';

const client = amazon.createClient({
  awsId: process.env.ACCOUNT_ID,
  awsSecret: process.env.ACCESS_TOKEN,
});

client.itemSearch({ keywords: 'Pulp fiction', searchIndex: 'DVD' })
  .then(results => console.log("RESULTS", JSON.stringinfy(results)))
  .catch(err => console.log("ERROR", JSON.stringify(err)));
