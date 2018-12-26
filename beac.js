// const noble = require('noble');
const express = require('express');
const hbs = require('hbs');
const _ = require('lodash');
const fs = require('fs');
const BeaconScanner = require('node-beacon-scanner');
const noble = require('noble');
const scanner = new BeaconScanner({'noble': noble});
const port = process.env.PORT || 3000;
var app = express();
app.set('view engine', "hbs");
var values = [];

hbs.registerPartials(__dirname + '/views/partials')
try{
noble.on('stateChange', (state) => {
  if (state === "poweredOff") {
    scanner.stopScan();
  } else if (state === "poweredOn") {
    scanner.startScan()
  }
});
}
catch(e){

}

// Set an Event handler for becons
scanner.onadvertisement = (ad) => {
  var beacons_data = ad.iBeacon;
  var uuid = beacons_data.uuid;
  var major = beacons_data.major;
  var minor = beacons_data.minor;
  values.push({uuid, major, minor});
};

// Start scanning
scanner.startScan().then(() => {
  console.log('Started to scan.')  ;
}).catch((error) => {
  console.error(error);
});
app.get("/", (req, res) =>{
  res.render("home.hbs");
});
//
app.post("/beacon", (req, res) =>{
  setTimeout(function(){
    if(values.length == 0){
      res.render("error.hbs", {error:"Turn on Bluetooth"})
    }
    else{
      res.render("main.hbs", {data:_.uniqBy(values, "major")})
    }

},10000);
});

app.listen(port, () => {
  console.log(`Serve is up at localhost:${port}`);
});
