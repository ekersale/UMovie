/**
 * Created by kersal_e on 16/02/2016.
 */

var app = app || {};

(function($) {
    'use strict';
    app.episodeModel = Backbone.Model.extend({
        initialize: function (params) {
            this.id = params.trackId;
        },

        defaults: function () {
            return {
                results: {}
            }
        }
    });
})(jQuery);

(function($) {
    'use strict';
    app.tvShowModel = Backbone.Model.extend({

        initialize: (function (options) {
            this.id = options.id;
        }),

        url: (function () {
            return app.baseUrl + "/tvshows/season/" + this.id;
        }),

        defaults: (function () {
            return {
                id: -1,
                previewUrl: ''
            }
        }),

        parse: (function (response) {
            return response.results[0];
        })
    });
})(jQuery);