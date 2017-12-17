"use strict"

let assert = require('assert');
let app = require('../site/bidPriceUpdates');

describe('Verify Sorting', function() {

  it('BidPrices Should be sorted based on lastChangeBid', function() {

    let arrayToSorted = [{
      "name": "gbpusd",
      "bestBid": 302.34234324,
      "bestAsk": 107.25199883791178,
      "openBid": 107.22827132623534,
      "openAsk": 109.78172867376465,
      "lastChangeAsk": -4.862314256927661,
      "lastChangeBid": 7.8769211401569663
    }, {
      "name": "gfgf",
      "bestBid": 202.34234324,
      "bestAsk": 107.25199883791178,
      "openBid": 107.22827132623534,
      "openAsk": 109.78172867376465,
      "lastChangeAsk": -4.862314256927661,
      "lastChangeBid": 5.8769211401569663
    }, {
      "name": "sadsad",
      "bestBid": 122.34234324,
      "bestAsk": 107.25199883791178,
      "openBid": 107.22827132623534,
      "openAsk": 109.78172867376465,
      "lastChangeAsk": -4.862314256927661,
      "lastChangeBid": 2.8769211401569663
    }];

    let arrayManuallySorted = [{
      "name": "sadsad",
      "bestBid": 122.34234324,
      "bestAsk": 107.25199883791178,
      "openBid": 107.22827132623534,
      "openAsk": 109.78172867376465,
      "lastChangeAsk": -4.862314256927661,
      "lastChangeBid": 2.8769211401569663
    }, {
      "name": "gfgf",
      "bestBid": 202.34234324,
      "bestAsk": 107.25199883791178,
      "openBid": 107.22827132623534,
      "openAsk": 109.78172867376465,
      "lastChangeAsk": -4.862314256927661,
      "lastChangeBid": 5.8769211401569663
    }, {
      "name": "gbpusd",
      "bestBid": 302.34234324,
      "bestAsk": 107.25199883791178,
      "openBid": 107.22827132623534,
      "openAsk": 109.78172867376465,
      "lastChangeAsk": -4.862314256927661,
      "lastChangeBid": 7.8769211401569663
    }];

    arrayToSorted.sort(app._test.sortBestBidPrice);
    assert.equal(JSON.stringify(arrayToSorted), JSON.stringify(arrayManuallySorted));
  });

});
