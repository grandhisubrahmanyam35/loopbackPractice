var jwt=require('jsonwebtoken'),
    _=require('underscore'),
    twoFactor=require('../middleware/twoFactor')(),
    utils=require('../middleware/utils')();

module.exports=function (app) {
  //
  // console.log(_.unique(_.keys(app.models)));

  app.get('/login',function (req,res,next) {
    res.render('login',{"email":"grandhi.subrahmanyam@applaudsolutions.com","password":"123456"})
  });

  app.get('/signup',function (req,res,next) {
    res.render('signup',{"email":"grandhi.subrahmanyam@applaudsolutions.com","password":"123456"})
  });

  app.get('/loginFailure', function(req, res, next) {
    res.send('Failed to authenticate');
  });

  app.get('/loginSuccess', function(req, res, next) {
    // res.redirect('/home');
    var settingsModel=app.models.Settings,
        parsedCookie=JSON.parse(req.user);
    settingsModel.findOne({"email":parsedCookie.email},function (err,model) {
      if(err)return res.send("something went wrong");
      if(model){
        res.render('twoFactorVerify',{"two_factor_secret":model.two_factor_secret,"email":model.email});
      }else{
        res.redirect('/home');
      }
    });
  });

  app.get('/home',function(req, res, next) {
    res.render('home',{"email":JSON.parse(req.user).email})
  });

  app.get("/resetPasswordRequest",function (req,res,next) {
    res.render("resetRequest",{"msg":""});
  });

  app.post("/resetPasswordRequest",function (req,res,next) {
    var userModel=app.models.Person,
      emailModel=app.models.Email,
      userName=app.dataSources.EmailDs.settings.transports[0].auth.user,
      mail=req.body.email;
    userModel.find({where:{email:mail}},function (error,user) {
      if(error){
        res.render("resetRequest",{"msg":"something went wrong, please try again"});
      }else if(user.length!==0){
        var options={},
          tocken=utils.createJwt({"email":user.email},'applaud'),
          url=req.protocol+"://"+req.hostname+":"+req.app.get('port')+"/reset-password?tocken="+tocken;
        options.to=user[0].email;
        options.from=userName;
        options.subject="Reset Password";
        options.priority="high";
        options.html='Click <a href="' + url + '">here</a> to reset your password';
        emailModel.send(options,function(err) {
          if (err){
            res.render("resetRequest",{"msg":"something went wrong, please try again"});
          }else{
            res.render("msg",{"msg":"please check ur mail"});
          }
        })
      }else{
        res.render("resetRequest",{"msg":"please enter valid email"});
      }
    });
  });

  //show password reset form
  app.get('/reset-password', function(req, res, next) {
    if (!req.query.tocken) return res.sendStatus(401);
    res.render('password-reset', {
      tocken: req.query.tocken
    });
  });

  app.post('/reset-password', function(req, res, next) {
    var Person=app.models.Person;
    if (!req.query.tocken) return res.sendStatus(401);
    jwt.verify(req.query.tocken,'applaud',function (err,result) {
      if (err) return res.send(err);
      Person.find({email:result.email},function (error,models) {
        if (error) return res.send(error);
        if(models.length==0){
          res.render('msg',{"msg":"This specific user not available"});
        }else{
          var userModel=models[0];
          userModel.updateAttribute('password', req.body.password, function(err, user) {
            if (err) return res.sendStatus(404);
            console.log('> password reset processed successfully');
            res.render('resetPassword', {
              title: 'Password reset success',
              content: 'Your password has been reset successfully',
              redirectTo: '/',
              redirectToLinkText: 'Log in'
            });
          });
        }
      })
    });

  });

  app.get('/logout',function (req,res,next) {
    req.logOut();
    res.redirect('/');
  });

  app.get('/two_factor_enabled',twoFactor.createSecreat);

  app.post('/two_factor_verify',twoFactor.verifyTocken);

  app.get('/confirmEmail',function (req,res,next) {
      var Person=app.models.Person;
      var payload=jwt.verify(req.query.token,'applaud',function (err,result) {
        if (err) return res.send(err);
        Person.find({email:result.email},function (error,models) {
          if (error) return res.send(error);
          if(models.length==0){
            res.render('msg',{"msg":"This specific user not available"});
          }else{
            var userModel=models[0];
            userModel.verificationToken = null;
            userModel.emailVerified = true;
            userModel.save(function(er) {
              if (err){
                res.render('msg',{"msg":"something went wrong"});
              }else{
                res.redirect('/');
              }
            });
          }
        })
      });

  });
}
