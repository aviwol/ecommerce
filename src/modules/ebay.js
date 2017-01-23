import ebay from 'ebay-api';

function searchEbay(req, res){
  const settings = {
      'SEARCH_INDEX' : [req.query.item],
      'MAX_PRICE': req.query.max_price,
      'FREE_SHIPPING': req.query.free_shipping
  }

  const params = {
    keywords: settings['SEARCH_INDEX'],
    outputSelector: ['AspectHistogram'],
    paginationInput: {
      entriesPerPage: 10
    },
    itemFilter: [
      { name: 'FreeShippingOnly', value: settings['FREE_SHIPPING'] },
      { name: 'MaxPrice', value: settings['MAX_PRICE'] }
    ],
  };

  const getItems = new Promise((resolve, reject) => {
    ebay.xmlRequest({
      serviceName: 'Finding',
      opType: 'findItemsByKeywords',
      appId: process.env.EBAY_APP_ID,
      params: params,
    }, (error, response) => {
      if (error) {
        return reject(error);
      }
      return resolve(response);
    });
  })
  .then((response) => {
    const ret = {
      ebay: {},
    };
    if (response && response.searchResult) {
      ret.ebay.count = response.searchResult['$'].count
      ret.ebay.items = response.searchResult.item.map((item) => ({
        id: item.id,
        title: item.title,
        galleryURL: item.galleryURL,
        viewItemURL: item.viewItemURL,
        location: item.location,
        condition: item.condition.conditionDisplayName || null,
        isBuyNow: item.listingInfo.buyItNowAvailable === 'true',
        lifespan: {
          start: item.listingInfo.startTime,
          end: item.listingInfo.endTime,
        },
        shipping: {
          type: item.shippingInfo.shippingType,
          locations: item.shippingInfo.shipToLocations,
          cost: item.shippingInfo.shippingServiceCost.amount,
        },
        price: item.sellingStatus.currentPrice.amount,
        currency: item.sellingStatus.currentPrice.currencyId,
      }));
      ret.success = true;
      res.json(ret);
    } else {
      res.json({ sucess: false, error: 'No data returned' });
    }
  })
  .catch((error) => console.log('...ERROR'));
}

module.exports = {
  'searchEbay': searchEbay
}
