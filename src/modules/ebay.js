import ebay from 'ebay-api';

const ebayMap = (item) => ({
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
});

function searchEbay(query){
  const { item, max_price, free_shipping } = query;
  const ebayResults = {};

  if (!item) {
    return Promise.resolve({ sucess: false, error: 'No search item' });
  }

  const settings = {
      searchIndex : [item],
      maxPrice: max_price,
      freeShipping: free_shipping,
  };

  const params = {
    keywords: settings.searchIndex,
    outputSelector: ['AspectHistogram'],
    paginationInput: {
      entriesPerPage: 10,
    },
    itemFilter: [
      { name: 'FreeShippingOnly', value: settings.freeShipping },
      { name: 'MaxPrice', value: settings.maxPrice },
    ],
  };

  return new Promise((resolve, reject) => {
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
    if (response && response.searchResult) {
      ebayResults.count = response.searchResult['$'].count;
      ebayResults.items = response.searchResult.item.map(ebayMap);
      return { ebay: ebayResults, success: true };
    }
    return { sucess: false, error: 'No data returned' };
  });
}

export default searchEbay;
