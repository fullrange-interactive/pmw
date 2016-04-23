var SocialWall = rElem.extend({
    type: 'SocialWall',
    isReady: false, // If isReady is false on construction, then you need do call callback() when loading is finished (transition can start)
    load: function(callback) {
        this.createDom();

        // Access to the data passed on by the web editor
        console.log(this.data);

        if (this.data.light) {
            // "light" will be true if this relem is in "preview" mode
            // (slide browser)
        }

        // You can put anything you want in this div
        $(this.viewPort).html("<h1>Social wall</h1>");

        callback();
    }
});
