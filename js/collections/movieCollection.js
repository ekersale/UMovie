/**
 * Created by kersal_e on 03/03/2016.
 */

var app = app || {};

(function() {
    app.MovieCollection = Backbone.Collection.extend({
        model: app.movieModelContent,

        url:  (function() {
            return app.baseUrl + "/actors/" + this.id + "/movies";
        }),

        initialize : (function(model, params) {
            this.id = params.id;
        }),

        defaults: {
            id: -1
        },

        parse: (function(response) {
            console.log(response.results);
            return response.results;
        })
    });
})();