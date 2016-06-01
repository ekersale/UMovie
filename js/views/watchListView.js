/**
 * Created by kersal_e on 10/03/2016.
 */

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

var app = app || {};

(function() {
    app.watchListView = Backbone.View.extend({
        el: $("#SubPage"),

        initialize: (function (params) {
            this.template = _.template(app.tpl.templates.listWatchLists);
            this.collection = params.collection;
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.listenTo(this.collection, 'destroy', this.render);
            this.collection.fetch({
                error : function(e) {
                    console.log(e);
                }
            });
            this.render();
        }),

        events: {
            'click .watchListSelect': 'displayWatchList',
            'click #CreateWatchList' : 'addWatchList',
            'click #Rename' : 'renameWatchList',
            'click #RemoveWatchList' : 'removeWatchList'
        },

        removeWatchList : (function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($("#removeElement").find(":selected").attr('data-id') != undefined) {
                var model = this.collection.get($("#removeElement").find(":selected").attr('data-id'));
                model.destroy({
                    headers: {
                        Authorization: app.getCookie("token")
                    },
                    success : (function() {
                        $('#SuccessModal').modal('show');
                    }),
                    error: (function(e) {
                        $('#ErrorModal').modal('show');
                    })
                })
            }
        }),

        renameWatchList : (function(e) {
            e.preventDefault();
            e.stopPropagation();
            $("#NewWatchListName").css("border","none");
            if ($("#NewWatchListName").val() == "") {
                $("#NewWatchListName").css("border","2px dotted red");
                return;
            }
            if ($(".WatchListElementsMenu").find(":selected").attr('value') == "") {
                return;
            }
            var model = this.collection.get($(".WatchListElementsMenu").find(":selected").attr('data-id'));
            if (model == undefined) {
                $('#ErrorModal').modal('show');
                $("#NewWatchListName").val('');
                return;
            }
            model.save({name: $("#NewWatchListName").val()}, {
                success : (function() {
                    $('#SuccessModal').modal('show');
                    $("#NewWatchListName").val('');
                }),
                error: (function(e) {
                    $('#ErrorModal').modal('show');
                    $("#NewWatchListName").val('');
                })
            });
            console.log(model);
        }),

        addWatchList : (function(e) {
            e.preventDefault();
            e.stopPropagation();
            $("#CreateWatchListName").css("border","none");
            if ($("#CreateWatchListName").val() == "") {
                $("#CreateWatchListName").css("border","2px dotted red");
                return;
            }
            this.collection.create({
                owner: app.getCookie("email"),
                name: $("#CreateWatchListName").val() }, {
                url: app.baseUrl + "/watchlists",
                method: 'POST',
                success: (function() {
                    $('#SuccessModal').modal('show');
                    $("#CreateWatchListName").val('')
                }),
                error: (function (e) {
                    $('#ErrorModal').modal('show');
                    $("#CreateWatchListName").val('');
                })
            })
        }),

        displayWatchList: (function(event) {
            event.preventDefault();
            var ID = $(event.target).closest('div.watchListSelect').attr("data-myValue");
            Backbone.history.navigate("watchlist/" + ID, {trigger: true});
        }),

        render: (function () {
            this.$el.html(this.template({
                collection: this.collection.toJSON()
            }));
            var mycollection = this.collection;
            try {
                $("#ListContainer").children().each(function (i, elm) {
                var model = $(this).attr("data-myValue");
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
            }
            catch (e) {

            }
        })
    });

    app.watchListSelectView = Backbone.View.extend({
        el: $("#SubPage"),

        initialize: function (params) {
            this.template = _.template(app.tpl.templates.watchList);
            this.collection = params.collection;
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.listenTo(this.collection, 'destroy', this.render);
            that = this;
            this.collection.fetch({
                success:(function() {
                    that.render();
                })
            });
            this.render();
        },

        events: {
            'click .deleteButton': 'deleteItemToList'
        },

        deleteItemToList: (function (e) {
            e.preventDefault();
            e.stopPropagation();
            var movieID = $(e.target).closest('.deleteButton').attr("data-myValue");

            var modelToRemove = this.collection.get(movieID);
            if (modelToRemove != undefined) {
                modelToRemove.destroy({
                    headers: {
                        Authorization: app.getCookie("token")
                    }
                });
                e.stopImmediatePropagation();
            }
        }),

        render: (function () {
            var movies = this.collection.models;

            this.$el.html(this.template({
                collection: movies,
                name : this.collection,
                owner : app.getCookie("userID")
            }));
        })
    });
})();