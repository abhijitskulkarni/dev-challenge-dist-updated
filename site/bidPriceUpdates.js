"use strict"

// There will be continuos data for bidUpdates
// This array will store latest 20 bidupdates because data will keep on increasing
// which may cause browser to freeze up  
let bidUpdatesData = [];

/**
 * Add Price data in Table
 * @param {Object}  priceResult
 */
function addValuesToTable(priceResult) {

  // Following is table where bidData will be rendered
  let table = document.getElementById("bidUpdates");

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
    bidUpdatesData.forEach(function(priceObjectBody, index) {

      // This will be used for drawing sparkline
      const sparks = document.createElement('span');

      // Create row dynamically 
      let table = document.getElementById("bidUpdates");
      let row = table.insertRow(1);
      let cell0 = row.insertCell(0);
      let cell1 = row.insertCell(1);
      let cell2 = row.insertCell(2);
      let cell3 = row.insertCell(3);
      let cell4 = row.insertCell(4);
      let cell5 = row.insertCell(5);
      let cell6 = row.insertCell(6);
      let cell7 = row.insertCell(7);

      // add data in columns
      cell0.innerHTML = priceObjectBody.name;
      cell1.innerHTML = priceObjectBody.bestBid.toFixed(3);
      cell2.innerHTML = priceObjectBody.bestAsk.toFixed(3);
      cell3.innerHTML = priceObjectBody.openBid.toFixed(3);
      cell4.innerHTML = priceObjectBody.openAsk.toFixed(3);
      cell5.innerHTML = priceObjectBody.lastChangeAsk.toFixed(3);
      cell6.innerHTML = priceObjectBody.lastChangeBid.toFixed(3);
      cell7.appendChild(sparks);

      // draw sparkline
      Sparkline.draw(sparks, priceObjectBody.sparkArray);

      let lengthOfRows = table.rows.length;
      // delete last row of table 
      if (lengthOfRows > 13) {
        table.deleteRow(lengthOfRows - 1);
      }
    });

}

/**
 * Sort array of bidprice updates.
 * @param {Object}  bidPriceArray
 * @return {Object} Sorted array will be returned
 */
function sortBestBidPrice(a,b) {

  return b.lastChangeBid - a.lastChangeBid;
}

/**
 * Check if element exists in the Array
 * @param {object}  arrayObject
 * @return {Number} Index
 */
function isElementPresent(name) {

  let Index;
  for (let i = 0; i < bidUpdatesData.length; i++) {
    if (bidUpdatesData[i].name == name) {
      Index = i;
      break;
    }
  }

  return Index;
}

/**
 * Change status of stomp server
 */
function serverIsOff() {
  document.getElementById("myonoffswitch").checked = false;
}

// This is required for unit test.
exports._test = {
  sortBestBidPrice: sortBestBidPrice
}
