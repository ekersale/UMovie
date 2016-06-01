function init() {
    gapi.client.setApiKey("AIzaSyDaA8QXOWSotnibFqTD95HSV__Q1qDqFzo");
    gapi.client.load("youtube", "v3", function () {

    });
}

function getPreviewEpisode(searchKey) {
    var request = gapi.client.youtube.search.list({
        part: "snippet",
        q: searchKey,
        maxResults: 6
    });
    request.execute(function(response) {
        $("#PreviewVideo").attr("src", "http://youtube.com/embed/" + response.items[0].id.videoId);
    });
}

function getPreviewSeason(searchKey, model) {
    var request = gapi.client.youtube.search.list({
        part: "snippet",
        q: searchKey,
        maxResults: 6
    });
    request.execute(function(response) {
        model.attributes.previewUrl = response.items[0].id.videoId;
        model.trigger('change', model);
        int
    });
}

var app = app || {};

$(document).ready(function () {

    var credentials = {
        tokenAPIGoogle : 'AIzaSyDaA8QXOWSotnibFqTD95HSV__Q1qDqFzo',
        tokenGSEGoogle : '007948393330712958796:hsfonupujgw'

    }

    app.baseUrl = "https://umovie.herokuapp.com";

    Backbone.$.ajaxSetup({
        headers: { 'Authorization': app.getCookie("token") }
    });

    $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        if (jqxhr.status >= 500) {
           $("#ErrorServerModal").modal("show");
        }
        else {
            $('#ErrorModal').modal('show');
        }
    });

    (function($) {
        app.AppRouter = Backbone.Router.extend({

            // Ajouter une route ici
            routes: {
                "login": "connexionPage",
                "movies/:id": "movieDetails",
                "tvshow/:id": "tvShowDetails",
                "actors/:id": "actorDetails",
                "watchlist": "watchListsDetails",
                "watchlist/:id": "watchList",
                "search": "searchPage",
                "profile/:id": "profileDetails"
            },

            initialize: (function () {
                app.loadMenu();
                // TODO render Header / Footer
            }),

            tvShowDetails: (function (id) {
                $.cookie("RootAfterCo", "tvshow/" + id, { expires : 0.001 });
                if (app.checkLogin() == true) {
                    new app.TVShowView({
                        model : new app.tvShowModel({
                            id: id
                        }),
                        collection : new app.episodesCollection(null, {
                            id: id
                        })
                    });

                }
            }),

            connexionPage: (function() {
                $('#ConnexionModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $("#ConnexionModal").modal("show");
            }),

            actorDetails: (function (id) {
                $.cookie("RootAfterCo", "actors/" + id, { expires : 0.001 });
                if (app.checkLogin() == true) {
                    new app.actorView({
                        model : new app.actorModel({
                            id: id,
                            collection: new app.MovieCollection(null, {
                                id: id
                            }),
                            tokenAPIGoogle: credentials.tokenAPIGoogle,
                            tokenGSEGoogle: credentials.tokenGSEGoogle
                        })
                    });
                }
            }),

            watchList: (function (id) {
                $.cookie("RootAfterCo", "watchlist/" + id, { expires : 0.001 });
                if (app.checkLogin() == true && id != "undefined") {
                    new app.watchListSelectView({
                        collection: new app.watchListCollectionSelect(null, {
                            id: id
                        })
                    });
                }
            }),

            watchListsDetails: (function () {
                $.cookie("RootAfterCo", "watchlist", { expires : 0.001 });
                if (app.checkLogin() == true) {
                    new app.watchListView({
                        collection: new app.watchListCollection(null, {
                            id : app.getCookie('userID')
                        })
                    });
                }
            }),

            searchPage: (function () {
                $.cookie("RootAfterCo","search", { expires : 0.001 });
                if (app.checkLogin() == true) {
                    new app.searchView({
                        model : new app.searchModel(),
                        collection : new app.searchCollection(),
                        watchLists : new app.watchListCollection(null, {
                            id : app.getCookie('userID')
                        })
                    });
                }
            }),

            profileDetails: (function(id) {
                $.cookie("RootAfterCo","profile/" + id, { expires : 0.001 });
                if (app.checkLogin() == true) {
                    new app.profileView({
                        id : id,
                        collection: new app.watchListCollection(null,{
                            id: id
                        }),
                        model : new app.userModel({
                            id : id
                        })
                    });
                }
            }),

            // Callback pour la route /movies/:id
            movieDetails: (function (id) {
                $.cookie("RootAfterCo","movies/" + id, { expires : 0.001 });
                if (app.checkLogin() == true) {
                    new app.movieView({
                        model : new app.movieModel({ id: id}),
                        collection : new app.watchListCollection(null, {
                            id: app.getCookie("userID")
                        })
                    });
                }
            })
        });
    })(jQuery);

    $(function() {
        app.tpl.loadTemplates(['movie', 'tvShow', 'actor', 'listWatchLists', 'search', 'watchList', 'profile', 'menu'], function () {
            new app.AppRouter();
            Backbone.history.start();
            new app.menuView({});
        });
    });

});