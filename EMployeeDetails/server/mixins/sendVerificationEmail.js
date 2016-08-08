/**
 * Created by Grandhi on 29-07-2016.
 */

var jwt=require('jsonwebtoken'),
    loopback=require('loopback'),
    path=require('path');

function createJwt(payload,secreatKey) {
  return jwt.sign(payload,secreatKey,{"expiresIn":60})
}

function sendEmailToUser( ctx,model,next) {
  var Person=ctx.req.app.models.Person,
      url=ctx.req.protocol+"://"+ctx.req.hostname+":"+ctx.req.app.get('port')+"/confirmEmail?",
      options = {
        type:'email',
        from:"grandhi.subrahmanyam@applaudsolutions.com",
        to: model.email, // list of receivers
        subject: 'Thanks for Registering', // Subject line,
        "verifyHref":url,
        "email":model.email,
        "template":path.join(__dirname, '../views/verificationEmail.ejs'),
        "generateVerificationToken":function (model,cb) {
          var token=createJwt({"email":model.email},'applaud');
          cb(null,token);
        }
      };
  model.verify(options,function (err,response) {
    if (err) return next(err);
    ctx.res.status(200).send({
      "msg":"successfully sent an email"
    });
  });
};

module.exports = function(Model) {
  'use strict';
  Model.afterRemote('create',function (ctx,Model,next) {
    sendEmailToUser(ctx,Model,next);
  });
};
