var express = require("express");
var app = express();
var data= require('../stores.json');
var bodyParser=require('body-parser');
var expressValidator=require('express-validator');
var validation=require('./validation');
var validationLocation=require('./validation_location');

var bytes=require('bytes');
app.use(bodyParser.json({limit:bytes('2mb')}));
app.use(bodyParser.urlencoded({limit:bytes('2mb'),extended:true}));
app.use(expressValidator());
var fs = require('fs');
function deg2Rad(deg) {
  return deg * Math.PI / 180;
}

function pythagorasEquirectangular(lat1, lon1, lat2, lon2) {
  lat1 = deg2Rad(lat1);
  lat2 = deg2Rad(lat2);
  lon1 = deg2Rad(lon1);
  lon2 = deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}
app.get("/stores", function(req, res) {
  var stores = data;
  //TODO load data from file stores.json
  var store_name=null;
  if(req.query.store_name!=undefined&&req.query.store_name!=""){
    store_name=req.query.store_name;
    stores=data.filter(function(element){
      if(element.name.indexOf(store_name)>-1){
        return element;
      }
      return null;
    },store_name);
  }
  if(stores.length==0){
    return res.status(400).json();
  }
  return res.send(stores);
});
app.post("/stores/nearest",function(req,res){
  var error={};
  req.checkBody(validationLocation);
  var errors=req.validationErrors();
  if(errors){
    return res.status(400).json({errors:errors});
  }
  var mindif = 9999999;
  var closest;

  for (let index = 0; index < data.length; ++index) {
    var dif = pythagorasEquirectangular(req.body.latitude, req.body.longitude, data[index].latitude, data[index].longitude);
    if (dif < mindif) {
      closest = index;
      mindif = dif;
    }
  }
  return res.status(200).send(data[closest]);
});
app.get("/stores/:id",function(req,res){
  store_id=req.params.id;
  stores=data.filter(function(element){
    if(element.id==store_id){
      return element;
    }
  },store_id);
  if(stores.length==0){
    return res.status(400).json();
  }
  return res.send(stores[0]);
});

// for post data
app.post("/stores",function(req,res){
  var error={};
  req.checkBody(validation);
  var errors=req.validationErrors();
  if(errors){
    return res.status(400).json({errors:errors});
  }
  var result=req.body;
  result.id=data[(data.length-1)].id+1;
  data.push(result);
  fs.writeFile("stores.json", JSON.stringify(data), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
  return res.status(201).send(result);
});


app.put("/stores/:id",function(req,res){
  var error={};
  req.checkBody(validation);
  var errors=req.validationErrors();
  store_id=req.params.id;
  // to find element
  var status=false;
  status=data.filter(function(element){
    if(element.id==store_id){
      return true;
    }
  },store_id);
  if(status==false){
    return res.status(400).json();
  }
  if(errors){
    return res.status(400).json({errors:errors});
  }
  update_data=req.body;
  var store_result=data.filter(function(element){
    if(element.id==store_id){
      element.name=update_data.name;
      element.latitude=update_data.latitude;
      element.longitude=update_data.longitude;
    }
    return element;
  },store_id,update_data);
  fs.writeFile("stores.json", JSON.stringify(store_result), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });
  result=store_result.filter(function(element){
    if(element.id==store_id){
      return true;
    }
  },store_id);
  return res.send(result[0]);
});
app.delete('/stores/:id',function(req,res){
  store_id=req.params.id;
  var not_deleted=data.filter(function(element){
    if(element.id!=store_id){
      return element;
    }
  },store_id);
  if(not_deleted.length==data.length){
    return res.status(400).json();
  }
  fs.writeFile("stores.json", JSON.stringify(not_deleted), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  });

  return res.json({message:"success"});
});

app.listen(3000);
module.exports = app; // for testing
