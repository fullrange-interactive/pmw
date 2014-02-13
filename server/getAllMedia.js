

/*
 * GET home page.
 */
exports.index = function(req, res){
    var walk    = require('walk');
    var files   = [];
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var media = url_parts.query['media'];
    var path;

    switch (media) {
        case 'images':
            path = 'public/gallery';
            break;
        case 'videos':
            path = 'public/videos';
            break;
        default:
            path = 'public/gallery';
    }
    // Walker options
    var walker = walk.walk(path, { followLinks: false});

    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        if(stat.name == ".DS_Store"){
            next();
            return;
        }
        files.push(root.replace("public","") + '/' + stat.name);
        next();
    });

    walker.on('end', function() {
        res.send(JSON.stringify(files));
    });
};