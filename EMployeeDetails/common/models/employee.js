var loopback=require('loopback'),
    path=require('path');

module.exports = function(Employee) {

    //validation
  // Employee.validatesLengthOf('name',{'max':4,"message":{max:"name too big"}});
    //remote methods
  Employee.greets = function(msg,meg2,req, cb) {
      //current context
    // console.log(loopback.getCurrentContext());
    cb(null, req.query,req.body);
  };
  Employee.remoteMethod(
    'greets',
    {
      accepts: [{arg: 'msg', type: 'string',http: {source: 'body'}},{arg: 'msg2', type: 'string',required:false},{arg: 'req', type: 'object', 'http': {source: 'req'}}],
      isStatic:true,
      http:{verb:'GET'},
      description:"Test it",
      returns: [{arg: 'query', type: 'object'},{arg: 'bodsdy', type: 'object'}]
    }
  );

    //events
  Employee.on('changed',function (mins) {
      // console.log(mins);
  });


  var tenantsConfig={
    "A":'tenantA.ejs',
    "B":"tenantB.ejs"
  };

    //model hooks
  Employee.afterSave=function (next) {
    console.log(this);
    next();
  };

    //Remote hooks
  Employee.afterRemote('create',function(context, user, next) {
    var template=loopback.template(path.join(__dirname,'../../server/views/',tenantsConfig[user.templateName.toUpperCase()]))({name:"Grandhi"});
      var options = {
      to: user.email, // list of receivers
      subject: 'Verification mail', // Subject line
      html: template
    };
    //sending an email
    Employee.app.models.Email.send(options, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', user.email);
    });
    next();
  })
};
