var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose")
var PasswordHash = require("password-hash")

var UserSchema = mongoose.Schema({
	username: String,
	email: String,
	password: String,
	isAdmin: Boolean
});

var User = mongoose.model("User", UserSchema);

User.strategy = new LocalStrategy({
	usernameField:'username',
	passwordField:'password'
},function (username, password, done){
	User.findOne({ username : username},function(err,user){
		if( err ) { 
			return done(err); 
		}
		
		if( !user ){
			return done(null, false, { message: 'Incorrect user.' });
		}
		console.log(password + " " + user.password );
		if ( !PasswordHash.verify(password, user.password) ){
			console.log("wrong pass");
			return done(null, false, {message: 'Incorrect password.'});
		}
		
		return done(null, user);
    });
});

User.serializeUser = function (user, done){
	done(null, user.id);
};

User.deserializeUser = function (id, done){
	User.findById(id, function (err, user){
		if ( err ){
			done();
		}
		done(null, user);		
	})
};

User.signup = function (username, email, password, done)
{
	var User = this;
	var hash = PasswordHash.generate(password);
	User.create({
		username: username,
		password: hash,
		email: email
	}, function (err, user){
		if ( err ) throw err;
		done(null, user);
	});
}

User.isAuthenticated = function (req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports = User;
