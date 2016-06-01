var app = app || {};

(function() {
    app.movieModel = Backbone.Model.extend({
        url: (function () {
            return app.baseUrl + "/movies/" + this.id;
        }),

        defaults: (function () {
            return {
                id: -1
            };
        }),

        parse: (function (response) {
            try {
                return response.results[0];
            }
            catch (err) {
                return;
            }
        })
    });
})();

(function() {
    app.movieModelContent = Backbone.Model.extend({
        defaults: (function () {
            return {
                id: -1
            };
        })
    });
})();

(function() {
    app.movieWatchListView = Backbone.Model.extend({
        url : (function () {
            return app.baseUrl + "/watchlists/" + this.attributes.collectionID + "/movies/" + this.id;
        }),

        defaults: (function () {
            return {
                id: -1
            };
        })
    });
})();