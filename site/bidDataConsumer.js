"use strict"

//url of stomp server
let urlServer;
let topics;
urlServer = "ws://localhost:8011/stomp";
topics = "/fx/prices";
let client = Stomp.client(urlServer);
client.connect("", "", connectCallBack, errorCallback);

let bidPriceUpdateObject = new bidPriceUpdate();

// This will be called back when connection will be established
function connectCallBack(data) {
  client.subscribe(topics, messageCallback);
}

// This will be called back when there will be error
function errorCallback(error) {
  // Change status of stomp server
  bidPriceUpdateObject.shutDownServer();
}
// This will get the data and will pass this to addValuesToTable where it will render data
function messageCallback(priceResult) {
  // manage message returned
  bidPriceUpdateObject.addValuesToTable(priceResult);
}