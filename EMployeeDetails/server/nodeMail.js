/**
 * Created by Grandhi on 27-07-2016.
 */


var nodemailer = require('nodemailer');
// var smtpTransport = require("nodemailer-smtp-transport");

var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: "infratab.grandhis@gmail.com",
    pass: "subbu@3545"
  }
});

// var transporter = nodemailer.createTransport("SMTP",{
//   service: "Gmail",
//   auth: {
//     user: "infratab.grandhis@gmail.com",
//     pass: "subbu@3545"
//   }
// });
// setup e-mail data with unicode symbols
var mailOptions = {
  from: 'infratab.grandhis@gmail.com', // sender address
  to: 'infratab.grandhis@gmail.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world 🐴', // plaintext body
  html: '<b>Hello world 🐴</b>' // html body
};

smtpTransport.sendMail(mailOptions, function(error, info){
  if(error){
    return console.log(error);
  }
  console.log('Message sent: ' + info.response);
});
