/**
 * Created by kersal_e on 06/04/2016.
 */

var app = app || {};

(function($) {
    app.profileView = Backbone.View.extend({
        el: $("#SubPage"),

        initialize: (function (params) {
            this.template =  _.template(app.tpl.templates.profile);
            this.model = params.model;
            this.id = params.id;
            this.personnalCollection = new app.userCollection(null, {
                id : app.getCookie("userID")
            });
            this.model.bind('change', _.bind(this.render, this));
            this.listenTo(this.personnalCollection, 'add change destroy remove', this.render);
            this.collection = params.collection;
            this.listenTo(this.collection, 'add remove destroy', this.render);
            this.collection.fetch();
            var that = this;
            this.model.fetch();
            this.personnalCollection.fetch({
                success : (function() {
                    that.render();
                })
            });
        }),

        events : {
            'click .btn-pref .btn': "clickTab",
            'click .follow': "redirectUser",
            'click .watchListSelect' : "redirectWatchListDetail",
            'click #suscribe' : "followUser",
            'click #unsuscribe' : "unsuscribeUser"
        },

        unsuscribeUser : (function(e) {
            e.preventDefault();
            e.stopPropagation();
            var model = this.personnalCollection.get(this.id);
            model.destroy({
                url : app.baseUrl + "/follow/" + model.id,
                error: (function() {
                    $('#ErrorModal').modal('show');
                })
            });
            e.stopImmediatePropagation();
        }),

        followUser : (function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.personnalCollection.create(this.model, {
                url : app.baseUrl + "/follow",
                method: "POST",
                contentType: 'application/json',
                error: (function() {
                    $('#ErrorModal').modal('show');
                })
            });

            e.stopImmediatePropagation();
        }),

        redirectWatchListDetail : (function(event) {
            event.preventDefault();
            event.stopPropagation();
            var ID = $(event.target).closest('div.watchListSelect').attr("data-id");
            Backbone.history.navigate("watchlist/" + ID, {trigger: true});
            event.stopImmediatePropagation();
        }),

        redirectUser : (function(event) {
            event.preventDefault();
            event.stopPropagation();
            Backbone.history.navigate("profile/" + $(event.target).attr("data-id"), {trigger: true});
            event.stopImmediatePropagation();
        }),

        clickTab : (function (event) {
            event.preventDefault();
            if (event.target.localName == "button") {
                $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
                $(event.target).removeClass("btn-default").addClass("btn-primary");
            }
            else {
                $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
                $(event.target).parent().removeClass("btn-default").addClass("btn-primary");
            }
        }),

        render: (function () {
            var bool = true;
            if (this.personnalCollection.id != this.model.attributes.id) {
                for (var i = 0; i < this.personnalCollection.models.length; ++i) {
                    if (this.personnalCollection.models[i].id == this.model.attributes.id)
                        bool = false;
                }
            }
            else {
                bool = -1;
            }
            if (this.model.id != this.id) {
                this.model.id = this.id;
                this.model.fetch();
                return;
            }
            this.$el.html(this.template({
                model : this.model.attributes,
                collection : this.collection.models,
                personnalCollection: this.personnalCollection,
                bool : bool
            }));

            var mycollection = this.collection;
            $("#tab1").children().each(function (i, elm) {
                var model = $(this).attr("data-id");
                var canvas = $(this).children().first().children().first();
                var context = canvas[0].getContext('2d');
                var movies = mycollection.get(model).attributes.movies;
                if (movies.length == 0) {
                    var sources = {
                        img1: 'http://img15.hostingpics.net/pics/235865134.png'
                    }
                    loadImages(sources, function (images) {
                        context.drawImage(images.img1, 0, 0);
                    });
                }
                if (movies.length == 1) {
                    var sources = {
                        img1: movies[0].artworkUrl100,
                        img2: 'http://img15.hostingpics.net/pics/2313584367.png',
                        img3: 'http://img15.hostingpics.net/pics/2313584367.png',
                        img4: 'http://img15.hostingpics.net/pics/2313584367.png'
                    }
                    loadImages(sources, function (images) {
                        context.drawImage(images.img1, 0, 0);
                        context.drawImage(images.img2, 67, 0);
                        context.drawImage(images.img3, 0, 100);
                        context.drawImage(images.img4, 67, 100);
                    });
                }
                if (movies.length == 2) {
                    var sources = {
                        img1: movies[0].artworkUrl100,
                        img2: movies[1].artworkUrl100,
                        img3: 'http://img15.hostingpics.net/pics/2313584367.png',
                        img4: 'http://img15.hostingpics.net/pics/2313584367.png'
                    }
                    loadImages(sources, function (images) {
                        context.drawImage(images.img1, 0, 0);
                        context.drawImage(images.img2, 67, 0);
                        context.drawImage(images.img3, 0, 100);
                        context.drawImage(images.img4, 67, 100);
                    });
                }
                if (movies.length == 3) {
                    var sources = {
                        img1: movies[0].artworkUrl100,
                        img2: movies[1].artworkUrl100,
                        img3: movies[2].artworkUrl100,
                        img4: 'http://img15.hostingpics.net/pics/2313584367.png'
                    }
                    loadImages(sources, function (images) {
                        context.drawImage(images.img1, 0, 0);
                        context.drawImage(images.img2, 67, 0);
                        context.drawImage(images.img3, 0, 100);
                        context.drawImage(images.img4, 67, 100);
                    });
                }
                if (movies.length > 3) {
                    var sources = {
                        img1: movies[0].artworkUrl100,
                        img2: movies[1].artworkUrl100,
                        img3: movies[2].artworkUrl100,
                        img4: movies[3].artworkUrl100
                    }
                    loadImages(sources, function (images) {
                        context.drawImage(images.img1, 0, 0);
                        context.drawImage(images.img2, 67, 0);
                        context.drawImage(images.img3, 0, 100);
                        context.drawImage(images.img4, 67, 100);
                    });
                }
            });
        })
    });
})(jQuery);