User = require('../model/user')

exports.index = function(req, res){
  if ( req.body.email ){
    User.signup(req.body.username, req.body.email, req.body.password, function (err, user){
      if ( err ) 
        throw err;
      req.login(user, function(err){
        if ( err ) 
          throw err;
        res.redirect("/");
        return;
      });
      return;
    });
    return;
  }
  if ( req.query.id ){
    res.send("nothing");
    return;
  }else{
    if ( !req.isAuthenticated() ){
      res.render("signup");
    }else{
      res.redirect("/");
    }
  }
};