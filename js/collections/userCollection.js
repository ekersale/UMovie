/**
 * Created by kersal_e on 09/04/2016.
 */

var app = app || {};

(function() {
    app.userCollection = Backbone.Collection.extend({
        model: app.userModel,

        defaults: {
            id: -1
        },

        initialize: (function (model, params) {
            this.id = params.id;
            this.name = '';
            this.email = '';
        }),

        parse: (function (response) {
            this.email = response.email;
            this.name = response.name;
            this.id = response.id;
            return response.following;
        }),

        url: (function () {
            return app.baseUrl + "/users/" + this.id;
        })
    });
})();