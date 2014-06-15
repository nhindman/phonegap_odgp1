define(function(require, exports, module) {

  var BASE_URL = 'https://burning-fire-4148.firebaseio.com';
  module.exports.chatRef = new Firebase(BASE_URL);
  var error = null;
  module.exports.user = null;
  module.exports.ready = null;
  
  module.exports.auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
     if (error) {
          // an error occurred while attempting login
          console.log(error);
          if(module.exports.ready != null) module.exports.ready(false);
        } else if (user) {
          // user authenticated with Firebase
          module.exports.user = user;
          window.user = user;
          console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
          if(module.exports.ready != null) module.exports.ready(true);
        } else {
          console.log('user logged out');
          module.exports.user = null
          // user is logged out
        }
  });
});