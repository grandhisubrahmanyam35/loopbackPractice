/**
 * Created by Grandhi on 29-07-2016.
 */

var loopback=require('loopback'),
    path=require('path'),
    utils=require('../middleware/utils')();

function sendEmailToUser( ctx,model,next) {
  var Person=ctx.req.app.models.Person,
      userName=ctx.req.app.dataSources.EmailDs.settings.transports[0].auth.user,
      url=ctx.req.protocol+"://"+ctx.req.hostname+":"+ctx.req.app.get('port')+"/confirmEmail?",
      options = {
        type:'email',
        from:userName,
        to: model.email, // list of receivers
        subject: 'Thanks for Registering', // Subject line,
        "verifyHref":url,
        "email":model.email,
        "template":path.join(__dirname, '../views/verificationEmail.ejs'),
        "generateVerificationToken":function (model,cb) {
          var token=utils.createJwt({"email":model.email},'applaud');
          cb(null,token);
        }
      };
  model.verify(options,function (err,response) {
    if (err){
      ctx.res.render('error');
    }else{
     ctx.res.render('msg',{"msg":"successfully signup is done,please check your mail and activate ur account"});
    }
  });
};

module.exports = function(Model) {
  'use strict';
  Model.afterRemote('create',function (ctx,Model,next) {
    sendEmailToUser(ctx,Model,next);
  });
};
