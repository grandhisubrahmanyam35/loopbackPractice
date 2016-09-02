var jwt=require('jsonwebtoken'),
    _=require('underscore');

module.exports = function(Person) {
  //diabling specific default routes
  _.each(Person.settings.remoteMethodsList,function (iterator) {
    Person.disableRemoteMethod(iterator,true);
  });
};
