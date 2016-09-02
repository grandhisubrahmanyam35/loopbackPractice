/**
 * Created by Grandhi on 17-08-2016.
 */

var speakeasy=require('speakeasy');

function createSecreat(req,res,next) {
  var cookieDetails=req.user || {},
      parsedCookie=JSON.parse(cookieDetails),
      secret = speakeasy.generateSecret({"name":parsedCookie.email,length:10}),
      settingsModel=req.app.models.Settings;
  settingsModel.create({"email":parsedCookie.email,"two_factor_secret":secret.base32},function (err,result) {
    if(err){
      res.status(200).send("something went wrong");
    }else {
      res.render('twoFactorEnable',{"email":parsedCookie.email,"two_factor_secret":secret.base32});
    };
  });
}

function verifyTocken(req,res,next) {
  var verified = speakeasy.totp.verify({secret: req.body.two_factor_secret,encoding: 'base32',token: Number(req.body.token_input)}),
      settingsModel=req.app.models.Settings;
  settingsModel.findOne({"email":req.body.email},function (err,model) {
    if(err){
      res.send("model not defined");
    }else{
      if(verified){
        model.two_factor_enabled=true;
        model.save(function (error) {
          if(error){
            res.send("something went wrong");
          }else{
            res.redirect('/home');
          }
        });
      }else{
        res.send("token not matched");
      }
    }
  })

}

module.exports=function () {
  return {
    createSecreat:createSecreat,
    verifyTocken:verifyTocken
  }
}
