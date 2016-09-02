var passport = require('passport'),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    config = require('../providers.json');
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth20').Strategy,
    thridPartyConfig=require('../thirdParty.json');

module.exports=function (app) {

  // Passport configurators..
  // var loopbackPassport = require('loopback-component-passport');
  // var PassportConfigurator = loopbackPassport.PassportConfigurator;
  // var passportConfigurator = new PassportConfigurator(app);

  //session object
  var store = new MongoDBStore(
    {
      uri: 'mongodb://localhost:27017/Employee',
      collection: 'Sessions'
    });

  // Catch errors
  store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
  });

  app.use(session({
    secret: 'Applaud',
    resave: false,
    saveUninitialized: true,
    cookie: {
      "maxAge":1200000000,
      "Secure":true
    },
    "store":store,
    "name":"applaud-session"
  }));

  // passportConfigurator.init();
  // passportConfigurator.setupModels({
  //   "userModel": app.models.person,
  //   "userIdentityModel": app.models.UserIdentity,
  //   "userCredentialModel": app.models.UserCredential
  // });
  // for (var s in config) {
  //   var c = config[s];
  //   c.session = c.session !== false;
  //   passportConfigurator.configureProvider(s, c);
  // }

  //initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  //local startegy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      var User=app.models.Person;
      User.findOne({"email":username},function (err,user) {
        user.hasPassword(password,function (error,resu) {
          if (error) { return done(error); }
          if (!resu) { return done(null, false); }
          return done(null,JSON.stringify(user));
        });
      });
    }
  ));
  app.post('/login',passport.authenticate('local', {
      successRedirect: '/loginSuccess',
      failureRedirect: '/loginFailure'
    }));

  //google startegy
  app.get('/auth/google',passport.authenticate('google', {scope:['profile', 'email'],accessType: 'offline', approvalPrompt: 'force'}));
  passport.use(new GoogleStrategy(thridPartyConfig.google,
    function(accessToken, refreshToken, profile, cb) {
      // console.log(accessToken);
      var User=app.models.Person;
      cb(null,profile);
    }
  ));
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      var userInfo=req.user;
      res.render('thirdParty',{name:userInfo.displayName,img:userInfo.photos[0].value});
    });
}
