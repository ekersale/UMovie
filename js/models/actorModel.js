/**
 * Created by kersal_e on 02/03/2016.
 */

var app = app || {};

(function() {
    app.actorModel = Backbone.Model.extend({
        url: (function () {
            return app.baseUrl + "/actors/" + this.id;
        }),

        initialize: (function (params) {
            this.id = params.id;
            this.tokenAPIGoogle = params.tokenAPIGoogle;
            this.tokenGSEGoogle = params.tokenGSEGoogle;
            this.collection = params.collection;
        }),

        defaults: (function () {
            return {
                id: -1,
                posterUrl: '',
                artistImdbLink: ''
            };
        }),

        parse: (function (response) {
            this.getPoster(response.results[0]);
            return response.results[0];

        }),

        getPoster: (function (rep) {
            if (rep == undefined)
                return;
            delete $.ajaxSettings.headers["Authorization"]; // Remove header before call
            return $.ajax({
                method: "GET",
                url: "https://www.googleapis.com/customsearch/v1?key=" + this.tokenAPIGoogle + "&cx=" + this.tokenGSEGoogle + "" + "&q=" + rep.artistName.replace(/ /g, "+") + "&searchType=image&fileType=jpg&imgSize=medium&alt=json",
                dataType: 'json',
                async: false,
                success: function (response) {
                    rep.posterUrl = response.items[0].link;
                    if (response.items[0].displayLink == "www.imdb.com")
                        rep.artistImdbLink = response.items[0].image.contextLink;
                    Backbone.$.ajaxSetup({
                        headers: { 'Authorization': app.getCookie("token") }
                    });
                },
                error: function (error) {
                    Backbone.$.ajaxSetup({
                        headers: { 'Authorization': app.getCookie("token") }
                    });
                }
            });
        })
    });
})();