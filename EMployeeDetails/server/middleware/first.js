/**
 * Created by Grandhi on 22-07-2016.
 */

var loopback=require('loopback');

function first(req,res,next) {
  next();
}

function rootAPI(req,res,next) {
  console.log(loopback);
  next();
}

function second(req,res,next) {
  console.log("This is second middileware");
  res.send("This is route Test");
}

module.exports={
  first:function () {
    return first;
  },
  second:function () {
    return second;
  },
  rootAPI:function () {
    return rootAPI;
  }
}
