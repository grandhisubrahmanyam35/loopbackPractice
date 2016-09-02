var loopback = require('loopback');
var boot = require('loopback-boot');
var path=require('path'),
  bodyParser=require('body-parser');

var app = module.exports = loopback();

// configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(loopback.context());

// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

app.af

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
app.set('NODE_ENV',process.argv[2]);
var options={
  "env":process.argv[2],
  "appRootDir":__dirname,
  "appConfigRootDir":path.join(__dirname,'/appconfig'),
  "dsRootDir":path.join(__dirname,'/dsconfig')
};
boot(app, options, function(err) {
  if (err) throw err;
  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
