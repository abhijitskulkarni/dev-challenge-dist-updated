"use strict"

// There will be continuos data for bidUpdates
// This array will store latest 20 bidupdates because data will keep on increasing
// which may cause browser to freeze up
let bidUpdatesData = [];

function bidPriceUpdate() {

  /**
   * Add Price data in Table
   * @param {Object}  priceResult
   */
  this.addValuesToTable = function(priceResult) {

    let parsedPrice = JSON.parse(priceResult.body);

    // get the index number of object in array
    let indexNumber = isElementPresent(parsedPrice.name);

    // if element is already present in the array
    if (indexNumber >= 0) {
      bidUpdatesData[indexNumber] = parsedPrice;
    }
    // if element is not present in the array then push it into array
    else {
      bidUpdatesData.push(parsedPrice);
    }

    // Call sort function to sort bidPriceData
    // Data will be sorted in ascending order based on value of lastChangeBid
    bidUpdatesData.sort(sortBestBidPrice);

    // Render all the bidUpdates in table

      var tablecontents = "";
      tablecontents = "<table>";

      tablecontents += `<tr>
            <th>Name</th>
            <th>BestBid</th>
            <th>BestAsk</th>
            <th>OpenBid</th>
            <th>OpenAsk</th>
            <th>LastChangeAsk</th>
            <th>LastChangeBid</th>
            <th>SparkLine</th>
        </tr>`;

      for (var i = 0; i < bidUpdatesData.length; i ++)
       {
         const sparksSpan = document.createElement('span');

          tablecontents += `
          <tr>
            <td>${bidUpdatesData[i].name}</td>
            <td>${bidUpdatesData[i].bestBid.toFixed(3)}</td>
            <td>${bidUpdatesData[i].bestAsk.toFixed(3)}</td>
            <td>${bidUpdatesData[i].openBid.toFixed(3)}</td>
            <td>${bidUpdatesData[i].openAsk.toFixed(3)}</td>
            <td>${bidUpdatesData[i].lastChangeAsk.toFixed(3)}</td>
            <td>${bidUpdatesData[i].lastChangeBid.toFixed(3)}</td>
            <td>
              <span id='streamSpan${i}'></span>
            </td>
          </tr>`;
       }
       tablecontents += "</table>";
       document.getElementById("bidUpdates").innerHTML = tablecontents;

       for (var i = 0; i < bidUpdatesData.length; i++) {
         let sparksSpan = document.getElementById('streamSpan' + i);
         Sparkline.draw(sparksSpan, bidUpdatesData[i].sparkArray);
       }
  }

  /**
   * Change status of stomp server
   */
  this.shutDownServer = function() {
    document.getElementById("myonoffswitch").checked = false;
  }
}

/**
 * Sort array of bidprice updates.
 * @param {Object}  bidPriceArray
 * @return {Object} Sorted array will be returned
 */
function sortBestBidPrice(a, b) {
  return a.lastChangeBid - b.lastChangeBid;
}

/**
 * Check if element exists in the Array
 * @param {string}  name of the currency
 * @return {Number} Index of currency.
 */
function isElementPresent(name) {

  let Index = -1; // If element is not found return -1
  for (let i = 0; i < bidUpdatesData.length; i++) {
    if (bidUpdatesData[i].name == name) {
      Index = i;
      break;
    }
  }

  return Index;
}
// This is required for unit test.
exports._test = {
  sortBestBidPrice: sortBestBidPrice
}

module.exports = bidPriceUpdate;
