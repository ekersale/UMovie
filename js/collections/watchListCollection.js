/**
 * Created by kersal_e on 10/03/2016.
 */

var app = app || {};

(function() {
    app.watchListCollection = Backbone.Collection.extend({
        model: app.movieModelContent,

        initialize : (function(model, param) {
            this.id = param.id;
        }),

        url: (function () {
            return app.baseUrl + "/watchlists";
        }),
        parse: (function (response) {
            var model = [];
            for (var i = 0; i < response.length; ++i) {
                try {
                    if (response[i].owner.id == this.id) {
                        model.push(response[i]);
                    }
                }
                catch (error) {
                }
            }
            return model;
        })
    });
})();

(function() {
    app.watchListCollectionSelect = Backbone.Collection.extend({
        model: app.movieWatchListView,

        defaults: {
            id: -1,
            name : undefined
        },

        initialize: (function (model, params) {
            this.id = params.id;
        }),

        parse: (function (response) {
            this.name = response.name;
            this.owner = response.owner;
            for (var i = 0; i < response.movies.length; ++i) {
                var length = response.movies[i].trackTimeMillis;
                var hours = length / (1000 * 60 * 60);
                var min = (length / (1000 * 60)) - (60 * parseInt(hours));
                response.movies[i].trackLength = Math.floor(hours) + " h " + Math.floor(min);
                response.movies[i].id = response.movies[i].trackId;
                response.movies[i].collectionID = response.id;
            }
            return response.movies;
        }),

        url: (function () {
            return app.baseUrl + "/watchlists/" + this.id;
        })
    });
})();