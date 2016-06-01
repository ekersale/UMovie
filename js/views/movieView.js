
var app = app || {};

(function() {
    app.movieView = Backbone.View.extend({
        el: $("#SubPage"),

        initialize: function (params) {
            this.template = _.template(app.tpl.templates.movie);
            this.model = params.model;
            this.model.bind('change', _.bind(this.render, this));
            this.collection = params.collection;
            this.listenTo(this.collection, 'add', this.render);
            var self = this;
            this.model.fetch({
                success: (function () {
                    getPreviewEpisode(self.model.attributes.trackName);
                }),
                error: (function (e) {
                    console.log(' Service request failure: ' + e.message);
                })
            });
            this.collection.fetch();

        },

        events: {
            'click #AddWatchList': 'addToWatchList'
        },


        render: function () {
            if (this.model == undefined)
                return;
            var length = this.model.attributes.trackTimeMillis;
            var hours = length / (1000 * 60 * 60);
            var min = (length / (1000 * 60)) - (60 * parseInt(hours));
            this.model.attributes.trackLength = Math.floor(hours) + " h " + Math.floor(min);
            var display = {
                movie: this.model.attributes,
                watchlist: this.collection.models
            }
            this.$el.html(this.template(display));
            return this;
        },

        addToWatchList: function (e) {
            e.preventDefault();
            var url = app.baseUrl + '/watchlists/' + $('#WatchListElements').find(":selected").attr('value') + '/movies';
            var col = this.collection.get($('#WatchListElements').find(":selected").attr('value'));
            col.collection.create(this.model, {
                type: 'POST',
                url: url,
                success: (function () {
                    $('#modalWatchList').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    $('#SuccessModal').modal('show');
                }),
                error: (function (e) {
                    $('#modalWatchList').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    $('#ErrorModal').modal('show');
                })
            })
        }
    });
})();