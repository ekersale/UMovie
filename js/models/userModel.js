/**
 * Created by kersal_e on 06/04/2016.
 */


var app = app || {};

(function() {
    app.userModel = Backbone.Model.extend({
        url: (function () {
            return app.baseUrl + "/users/" + this.id;
        }),

        initialize: (function (params) {
            this.id = params.id;
        }),

        defaults: (function () {
            return {
                id: -1
            };
        }),

        parse: (function(response) {
         return {
             urlPicture: 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(response.email),
             id: response.id,
             email: response.email,
             name: response.name,
             following: response.following
         };
        })
    });
})();