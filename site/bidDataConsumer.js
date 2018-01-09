"use strict"

let bidPriceUpdate = require('./bidPriceUpdates.js');
//url of stomp server
let urlServer;
let topics;
urlServer = "ws://localhost:8011/stomp";
topics = "/fx/prices";
let client = Stomp.client(urlServer);
client.connect("", "", connectCallBack, errorCallback);

// This will be called back when connection will be established
function connectCallBack(data) {
  document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
  client.subscribe(topics, messageCallback);
}

// This will be called back when there will be error
function errorCallback(error) {
  document.getElementById('stomp-status').innerHTML = "Whoops! Lost connection to a stomp server";
  // Change status of stomp server
  bidPriceUpdate.shutDownServer();
}
// This will get the data and will pass this to addValuesToTable where it will render data
function messageCallback(priceResult) {
  // validate data received from priceResult
  if (priceResult.body !== undefined && priceResult.body.length > 0) {
    // manage message returned
    bidPriceUpdate.addValuesToTable(priceResult);
  }
}
