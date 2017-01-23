import ebay from '../modules/ebay';

function search(req, res) {
  const ret = {};

  ebay(req.query)
    .then((data) => {
      if (data.error) {
        ret.error = data.error;
        ret.success = false;
      } else if (data.success) {
        ret.ebay = data.ebay;
        ret.success = true;
      } else {
        ret.error = 'No data returned';
        ret.success = false;
      }
    })
    .then(() => res.json(ret))
    .catch((error) => console.log('...ERROR'));
}

export default search;
