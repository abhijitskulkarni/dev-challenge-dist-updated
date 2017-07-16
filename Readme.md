# Realtime Bid Updates

## Prerequisites for running project
- Node.js
    - This application requires [Node.js](https://nodejs.org/)  to run.
## Steps to run project 

###### Download the project or clone using below commands
After downloading/cloning then install the dependencies and devDependencies and start the server.

```sh
$ git clone https://github.com/abhijitskulkarni/dev-challenge-dist-updated.git
$ cd dev-challenge-dist-updated
$ npm install  
$ npm start
```
navigate to http://localhost:8011/ you should see table with data updates.

### Run unit test
- One test case is written to check if sorting function is working properly or not.
  Sorting is done is descending order.

To Run the tests. Follow below commands 
```sh
$ cd dev-challenge-dist-updated
$ npm test  
```

### Architecture
- File bidDataConsumer.js (under site directory) is a model which is responsible to fetch data from /fx/prices. Whenever it will receive data it will be passed to view to render that data.
- File bidPriceUpdates.js (under site directory) is responsible to generate view on    index.html.

### Notes
- Store latest 20 bidupdates in the array because data will keep on increasing which      may cause browser to freeze up
- To Draw sparkLine last 10 elements are used so that UI wont be disturbed
- Data is sorted in Descending order of lastChangeBid column
- For initial 30 seconds you wont see any sparkline. 