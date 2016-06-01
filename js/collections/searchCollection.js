/**
 * Created by William Goillot on 04/04/2016.
 */

var app = app || {};

(function() {
    app.searchCollection = Backbone.Collection.extend({
        model: app.searchModel,
        url: function () {
            return app.baseUrl + "/search" + this.category + "?q=" + this.searchWord;
        },

        defaults: (function () {
            return {
                category : '',
                searchWord : '',
                genre : []
            }
        }),

        parse: (function (response) {
            this.genre = [];

            if (response.results != undefined) {
                for (var i = 0; i < response.results.length; ++i) {
                    if (this.genre.indexOf(response.results[i].primaryGenreName) == -1)
                        this.genre.push(response.results[i].primaryGenreName);
                }
                return (response.results);
            }
            else
                return (response);
        })

    });
})();