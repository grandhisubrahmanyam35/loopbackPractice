var jwt=require('jsonwebtoken');

module.exports=function (app) {
  app.get('/confirmEmail',function (req,res,next) {
      var Person=app.models.Person;
      var payload=jwt.verify(req.query.token,'applaud',function (err,result) {
        if (err) return res.send(err);
        Person.find({email:result.email},function (error,models) {
          if (error) return res.send(error);
          if(models.length==0){
            res.status(404).send("This specific user not available")
          }else{
            var userModel=models[0];
            userModel.verificationToken = null;
            userModel.emailVerified = true;
            userModel.save(function(er) {
              if (er) return res.send(er);
              res.send("email successfully confirmed");
            });
          }
        })
      });

  });
}
