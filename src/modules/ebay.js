import ebay from 'ebay-api';

function searchEbay(req, res){
  const settings = {
      'SEARCH_INDEX' : [req.params.item],
      'MAX_PRICE': req.params.max_price,
      'FREE_SHIPPING': req.params.free_shipping
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

  ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsByKeywords',
    appId: process.env.EBAY_APP_ID,
    params: params,
    parser: ebay.parseResponseJson,
  }, (error, itemsResponse) => {
    if (error) throw error;
    var items = itemsResponse.searchResult.item;
    res.send(JSON.stringify(items));
  });
}

module.exports = {
  'searchEbay': searchEbay
}
