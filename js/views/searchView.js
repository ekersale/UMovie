/**
 * Created by William Goillot on 04/04/2016.
 */

var app = app || {};

(function($) {
     app.searchView = Backbone.View.extend({
        el: $("#SubPage"),

        initialize: (function (params) {
            this.template =  _.template(app.tpl.templates.search);
            this.model = params.model;
            this.model.bind('change', _.bind(this.render, this));
            this.collection = params.collection;
            this.watchLists = params.watchLists;
            this.listenTo(this.collection, 'add remove', this.render);
            this.searchWord = '';
            this.category = '';
            this.first = true;
            this.selectID = 0;
            this.watchLists.fetch();
            this.render();
            this.toDisplay = [];
            this.autoComleteCollection = new app.searchCollection();
        }),


        render: (function () {
            this.$el.html(this.template({
                results:this.collection,
                watchlist: this.watchLists.models,
                filter:  this.toDisplay
            }));
            $('input#searchBar').val(this.searchWord);
            $("input[type=radio]").val([this.category]);

            this.first = false;
            that = this;
            $( ".types-genre" ).each(function(  ) {
                if (that.toDisplay.indexOf(this.value) != -1) {
                    $(this).prop("checked", true);
                }
            });
            return this;
        }),

         events: {
             'click span.input-group-addon': 'clickSearch',
             'click div.search-result': 'clickResultSearch',
             'click button#MovieAddToWatchList': 'clickAddWatchList',
             'click #AddWatchListConfirm': 'addMovieToWatchList',
             'click .FollowUser' : 'clickFollowUser',
             'click .types-genre': 'genreFilter',
             'input input#searchBar': 'updateInput'
         },

         genreFilter : (function(e) {
             if ($(e.target).is(':checked')) {
                 if (this.toDisplay.indexOf(e.target.defaultValue) == -1) {
                     this.toDisplay.push(e.target.defaultValue);
                 }
             }
             if (!$(e.target).is(':checked')) {
                 if (this.toDisplay.indexOf(e.target.defaultValue) != -1) {
                     this.toDisplay.splice(this.toDisplay.indexOf(e.target.defaultValue), 1);
                 }
             }
             this.render();
         }),

         updateInput : (function(e) {
             this.autoComleteCollection.category = $('input[type=radio]:checked').val();
             this.autoComleteCollection.searchWord = $('input#searchBar').val();
             that = this;
             this.autoComleteCollection.fetch({
                 success: (function() {
                     var table = [];
                     var resnumb = 0;
                     for (var i = 0; i < that.autoComleteCollection.models.length && resnumb < 8; ++i) {
                         if (that.autoComleteCollection.models[i].attributes.name != undefined) {
                             table.push(that.autoComleteCollection.models[i].attributes.name);
                             resnumb++;
                         }
                         else if (that.autoComleteCollection.models[i].name != undefined) {
                             table.push(that.autoComleteCollection.models[i].attributes.name);
                             resnumb++;
                         }
                     }
                     $( "input#searchBar" ).autocomplete({
                         source: table
                     });
                 }),
                 error : (function(e) {
                     console.log(e);
                 })
             });
         }),

         clickFollowUser : (function(e) {
             e.preventDefault();
             e.stopPropagation();
             var ID = $(e.target).closest('div.search-result').attr("data-id");
             var selfCollection = new app.userCollection(null, {
                id : app.getCookie("userID")
             });
             selfCollection.fetch({
                 headers: {
                     Authorization: app.getCookie("token")
                 },
                 success : (function() {
                     var userModel = new app.userModel({
                         id : ID
                     });
                     userModel.fetch({
                         headers: {
                             Authorization: app.getCookie("token")
                         },
                         success: (function() {
                             selfCollection.create(userModel, {
                                 url : app.baseUrl + "/follow",
                                 method: "POST",
                                 contentType: 'application/json',
                                 headers: {
                                     Authorization: app.getCookie("token")
                                 },
                                 success: (function() {
                                   $("#SuccessModal").modal("show");
                                 })
                             })
                         })
                     });
                 })
             });
         }),

         clickAddWatchList: (function(e) {
             e.preventDefault();
             this.selectID = $(e.target).closest('div.search-result').attr("data-id");
         }),

         clickResultSearch: (function(e) {
             e.preventDefault();
             if (e.target.id == "FollowUser")
                return;
             if(!$(e.target).is('button#MovieAddToWatchList')) {
                 var ID = $(e.target).closest('div.search-result').attr("data-id");
                 var type = $(e.target).closest('div.search-result').attr("data-type");
                 if (type == 'movies' || type == 'actors' || type == 'tvshow' || type == 'profile')
                     Backbone.history.navigate(type + "/" + ID, {trigger: true});
             }
         }),

         addMovieToWatchList: (function (e) {
             e.preventDefault();
             e.stopPropagation();
             var url = app.baseUrl + '/watchlists/' + $('#WatchListMovieElements').find(":selected").attr('value') + '/movies';
             var col = this.watchLists.get($('#WatchListMovieElements').find(":selected").attr('value'));
             var that = this;
             var model = new app.movieModel({ id: that.selectID});
             model.fetch({
                 success: (function() {
                     for (var i = 0; i < col.attributes.movies.length; ++i) {
                         if (col.attributes.movies[i].trackId == model.attributes.trackId)
                            return;
                     }
                     col.collection.create(model, {
                         type: 'POST',
                         url: url,
                         success: (function () {
                             $('#SuccessModal').modal('show');
                         }),
                         error: (function (e) {
                             $('#ErrorModal').modal('show');
                         })
                     })
                     e.stopImmediatePropagation();
                 })
             });

         }),

         clickSearch: (function() {
             this.category = $('input[type=radio]:checked').val();
             this.searchWord = $('input#searchBar').val();
             this.collection.category = this.category;
             this.collection.searchWord = this.searchWord;
             this.first = true;
             that = this;
             this.collection.each(function(model) {
                 that.collection.remove(model);
             });
             this.render();
             this.collection.fetch({
                 success: (function() {
                     if (that.collection.models.length == 0 && that.searchWord.length > 0)
                         $('div.no-result').text("No result for " + that.searchWord);
                     else
                         $('div.no-result').text("");
                 })
             });

         })
    });
})(jQuery);