'use strict';

// There will be continuos data for bidUpdates
// bidUpdatesData array will store bidupdates data.

let bidUpdatesData = [];
let sparkLineArray = [];
let sparkLineCountArray = [];
let startSparkLine = false;
let counter = 0;

// update sparkLine array to display last 30 seconds data
setInterval(function () {
  counter += 1;
  updateSparkData();
}, 10000);

// update sparkline data
function updateSparkData() {

  for (let i = 0; i < bidUpdatesData.length; i++) {
    let sparkLength = sparkLineArray[i].length;
    let totalSparkValues = 0;
    let sparkValueToAdd = 0;

    let sparkLineCountArrayLength =  sparkLineCountArray[i].length;

    if (sparkLineCountArrayLength >= 1) {
      for (let j = 0; j < sparkLineCountArrayLength; j++) {
        totalSparkValues = totalSparkValues + sparkLineCountArray[i][j];
        sparkValueToAdd = sparkLength - totalSparkValues;
      }
    }else {
      sparkValueToAdd = sparkLength;
    }

    sparkLineCountArray[i].push(sparkValueToAdd);
  }

  if (counter >= 3) {
    startSparkLine = true;
    drawSparkLine();
  }

}

function drawSparkLine() {
  for (let i = 0; i < bidUpdatesData.length; i++) {
    sparkLineArray[i].splice(0, sparkLineCountArray[i][0]);
    sparkLineCountArray[i].splice(0, 1);
    let sparksSpan = document.getElementById('streamSpan' + i);
    Sparkline.draw(sparksSpan, sparkLineArray[i]);
  }
}

/**
   * Add birPrice Update data in Table
   * @param {Object}  priceResult
   **/

exports.addValuesToTable = function (priceResult) {

    let parsedPrice = JSON.parse(priceResult.body);

    parsedPrice.sparkArray = [];

    // Calculate midprice
    let midPrice = (parsedPrice.bestAsk + parsedPrice.bestBid) / 2;

    // Get the index number of object in array
    let indexNumber = isElementPresent(parsedPrice.name);

    // If element is already present in the array
    if (indexNumber >= 0) {
      sparkLineArray[indexNumber].push(midPrice);

      parsedPrice.sparkArray = sparkLineArray[indexNumber];

      bidUpdatesData[indexNumber] = parsedPrice;
    }

    // if element is not present in the array then push it into array
    else {
      // create sparkLineArray for currency
      sparkLineArray[bidUpdatesData.length] = [];
      sparkLineArray[bidUpdatesData.length].push(midPrice);

      parsedPrice.sparkArray = sparkLineArray[bidUpdatesData.length];

      // create sparkLineCountArray for currency
      sparkLineCountArray[bidUpdatesData.length] = [];

      bidUpdatesData.push(parsedPrice);
    }

    // Call sort function to sort bidPriceData
    // Data will be sorted in ascending order based on value of lastChangeBid
    bidUpdatesData.sort(sortBestBidPrice);

    // Render all the bidUpdates in table

    let tablecontents = '';
    tablecontents = '<table>';

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

    for (let i = 0; i < bidUpdatesData.length; i++)
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

    tablecontents += '</table>';
    document.getElementById('bidUpdates').innerHTML = tablecontents;

    // update sparkline data
    if (startSparkLine)
    {
      for (let i = 0; i < bidUpdatesData.length; i++) {
        let sparksSpan = document.getElementById('streamSpan' + i);
        Sparkline.draw(sparksSpan, bidUpdatesData[i].sparkArray);
      }
    }
  };

/**
   * Change status of stomp server
   */
exports.shutDownServer = function () {
    document.getElementById('myonoffswitch').checked = false;
  };

/**
 * Sort array of bidprice updates.
 * @param {Object}  bidPriceArray
 * @return {Object} Sorted array will be returned
 */
function sortBestBidPrice(a, b) {
  return a.lastChangeBid - b.lastChangeBid;
}

// export sortBestBidPrice
exports.sortBestBidPrice = sortBestBidPrice;

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
