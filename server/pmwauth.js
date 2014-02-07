var passport = require("passport")
var LocalStrategy = require("passport-local").Strategy;
var mongoose = require("mongoose")

exports.schema = mongoose.Schema({
	username: String,
	salt: String,
	hash: String
});

exports.strategy = new LocalStrategy(function (username,password,done){
	Users.findOne({ username : username},function(err,user){
		if(err) { 
			return done(err); 
		}
		
		if(!user){
			return done(null, false, { message: 'Incorrect username.' });
		}

		hash(password, user.salt, function (err, hash) {
			if (err) { 
				return done(err); 
			}
			if (hash == user.hash) 
				return done(null, user);
			done(null, false, { message: 'Incorrect password.' });
		});
    });)
});

exports.serializeUser = function (user, done){
	done(null, user.id);
};

exports.deserializeUser = function (id, done){
	Users.findById(id, function (err, user){
		if ( err ){
			done();
		}
		done(null, user);		
	})
};