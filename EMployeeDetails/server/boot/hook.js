/**
 * Created by Grandhi on 26-07-2016.
 */

module.exports = function(app) {
  // console.log(app);
  var remotes = app.remotes();
  // console.log(app.datasources.mongodb.connector);
  // modify all returned values
  remotes.after('**', function (ctx, next) {
    ctx.result = {
      data: ctx.result
    };
    next();
  });
};
