/**
 * Created by kersal_e on 17/02/2016.
 */

var app = app || {};

(function() {
    app.TVShowView = Backbone.View.extend({
        el: $("#SubPage"),

        initialize: function (params) {
            _.bindAll(this, "searchEpisode");
            this.template = _.template(app.tpl.templates.tvShow);
            this.model = params.model;
            this.model.bind('change', _.bind(this.render, this));
            this.collection = params.collection;
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo($("#searchBox"), 'change', function() {
                console.log("test");
            });
            var self = this;
            this.model.fetch({
                success: (function () {
                    getPreviewSeason(self.model.attributes.collectionName, self.model);
                })
            });
            this.collection.fetch();
        },

        render: (function () {
            this.$el.html(this.template({
                search: '',
                model: this.model.attributes,
                collection: this.collection.models
            }));
            var input = $('#searchBox');
            input.focus().val(input.val());
        }),

        renderSelected : (function(models, search) {
            if ($("#searchBox").val().length <= 0) {
                this.render();
                return;
            }
            this.$el.html(this.template({
                search: search,
                model: this.model.attributes,
                collection: models
            }));
            var input = $('#searchBox');
            input.focus().val(input.val());
        }),

        events: {
            'click .EpisodeDetails': 'openModalEpisode',
            'input input': 'searchEpisode',
            'click #clearSearch': 'clearSearch'
        },

        clearSearch : (function() {
            $("#searchBox").val('');
            this.render();
        }),

        searchEpisode : (function(event) {
            var search = $("#searchBox").val();
            if (search != undefined) {
                search = search.toLowerCase();
                var items = this.collection.filter(function(model) {
                    if (model.attributes.trackNumber == search) {
                        return model;
                    }
                    if (model.attributes.trackName.toLowerCase().indexOf(search) != -1) {
                        return model
                    }
                });
                this.renderSelected(items, search);
            }
        }),

        openModalEpisode: (function (e) {
            e.preventDefault();
            var episodeID = $(e.target).attr("data-myValue");
            for (var i = 0; i < this.collection.models.length; ++i) {
                var episodeSelected = this.collection.models[i];
                if (episodeSelected.id == episodeID) {
                    $(".logoModifWatchList").attr("src", episodeSelected.attributes.artworkUrl100);
                    $("#TVShowName").html(episodeSelected.attributes.artistName);
                    $("#SeasonName").html(episodeSelected.attributes.collectionName);
                    $("#EpisodeName").html(episodeSelected.attributes.trackName);
                    $("#Description").html(episodeSelected.attributes.shortDescription);
                    var length = episodeSelected.attributes.trackTimeMillis;
                    var hours = length / (1000 * 60 * 60);
                    var min = (length / (1000 * 60)) - (60 * parseInt(hours));
                    var duration = Math.floor(hours) + " h " + Math.floor(min) + " min";
                    $("#DureeEpisode").html(duration);
                    getPreviewEpisode(episodeSelected.attributes.artistName + " " + episodeSelected.attributes.trackName);
                    $("#EpisodeInfoModal").modal("show");
                }
            }
        })
    });
})();