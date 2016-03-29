exports.index = function(req, res){
    if ( !req.isAuthenticated() ){
        res.render("login");
    }else{
        res.redirect("/");
    }
};