/**
 * Created by kersal_e on 29/03/2016.
 */
var app = app || {};

(function() {
    app.episodesCollection = Backbone.Collection.extend({
        model: app.episodeModel,

        initialize : function(model, params) {
            this.id = params.id;
            this.previewUrl = '';
        },

        url:  function() {
            return app.baseUrl + "/tvshows/seasons/" + this.id + "/episodes";
        },

        parse: function(response) {
            return (response.results);
        },

        default : {
            previewUrl: ''
        }
    });
})();