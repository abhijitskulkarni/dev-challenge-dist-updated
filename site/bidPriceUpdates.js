"use strict"

// There will be continuos data for bidUpdates
// This array will store latest 20 bidupdates because data will keep on increasing
// which may cause browser to freeze up
let bidUpdatesData = [];
let sparkLineArray = [];
var sparkLineCountArray = [];
let startSparkLine = false;

// create 12 arrays for currencies sparkLine
for (var i = 0; i <12; i++) {
  // sparkLineArray[i] = [new Date().getTime()];

  sparkLineArray[i] = [];
  sparkLineCountArray[i] = [];
}

let counter = 0;

setInterval(function() {
  counter += 1;
  updateSparkData();

},10000);

//update sparkline data for 30 sec
function updateSparkData() {

  for (var i = 0; i < bidUpdatesData.length; i++) {
    var sparkLength = sparkLineArray[i].length;
    var totalSparkValues = 0, sparkValueToAdd = 0;

    if(sparkLineCountArray[i].length > 1){
          for(var j = 0; j < sparkLineCountArray[i].length; j++){
          totalSparkValues = totalSparkValues + sparkLineCountArray[i][j];
          sparkValueToAdd = sparkLength - totalSparkValues;
          }
    } else {
      sparkValueToAdd = sparkLength;
    }
    sparkLineCountArray[i].push(sparkValueToAdd);
  }

  if(counter >= 3){
    // startSparkLine = true;
drawSparkLine(sparkLineCountArray);
  }

}

function drawSparkLine(sparkLineCountArray) {
  for (var i = 0; i < bidUpdatesData.length; i++) {
    //sparkLineArray[i].splice(0, sparkLineCountArray[i][0]);
    let sparksSpan = document.getElementById('streamSpan' + i);
    Sparkline.draw(sparksSpan, sparkLineArray[i]);
  }
}

function bidPriceUpdate() {

  /**
   * Add Price data in Table
   * @param {Object}  priceResult
   */
  this.addValuesToTable = function(priceResult) {

    let parsedPrice = JSON.parse(priceResult.body);

    parsedPrice.sparkArray = [];

    // calculate midprice
    let midPrice = (parsedPrice.bestAsk + parsedPrice.bestBid) /2;

    // get the index number of object in array
    let indexNumber = isElementPresent(parsedPrice.name);

    // if element is already present in the array
    if (indexNumber >= 0) {
      sparkLineArray[indexNumber].push(midPrice);

      parsedPrice.sparkArray = sparkLineArray[indexNumber];

      bidUpdatesData[indexNumber] = parsedPrice;
    }
    // if element is not present in the array then push it into array
    else {
      sparkLineArray[bidUpdatesData.length].push(midPrice);

      parsedPrice.sparkArray = sparkLineArray[bidUpdatesData.length];

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
       //
       // if (startSparkLine) {
       //   drawSparkLine();
       // }

       // if (counter > 6 ) {
       //     for (var i = 0; i < bidUpdatesData.length; i++) {
       //       let sparksSpan = document.getElementById('streamSpan' + i);
       //       let createdTimeStampSparkLine = sparkLineArray[i] [0];
       //       let currentTime = new Date().getTime();
       //       let differenceinSeconds = (currentTime - createdTimeStampSparkLine) /1000;
       //
       //       if (differenceinSeconds >= 30) {
       //         sparkLineArray[i].splice(0,4);
       //         sparkLineArray[i] [0] = new Date().getTime();
       //       }
       //       Sparkline.draw(sparksSpan, sparkLineArray[i].slice(1));
         // }
       //}

       // for (var i = 0; i < bidUpdatesData.length; i++) {
       //   let sparksSpan = document.getElementById('streamSpan' + i);
       //   Sparkline.draw(sparksSpan, bidUpdatesData[i].sparkArray);
       // }
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
