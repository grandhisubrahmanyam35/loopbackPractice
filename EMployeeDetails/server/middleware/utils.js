/**
 * Created by Grandhi on 25-08-2016.
 */

var jwt=require('jsonwebtoken');

function createJwt(payload,secreatKey,options) {
  //expires is in seconds format or may string format
  options=options || {};
  options.expiresIn=options.expiresIn || 600;
  return jwt.sign(payload,secreatKey,options);
}

module.exports=function () {
  return {
    createJwt:createJwt
  }
}
