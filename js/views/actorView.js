/**
 * Created by kersal_e on 02/03/2016.
 */

var app = app || {};

(function($) {
     app.actorView = Backbone.View.extend({
        el: $("#SubPage"),

        initialize: function (params) {
            this.template =  _.template(app.tpl.templates.actor);
                this.model = params.model;
            this.model.bind('change', _.bind(this.render, this));
            this.listenTo(this.model.collection, 'add', this.render);
            this.model.fetch({
                error: (function (e, error) {
                    console.log(e);
                })
            });
            this.model.collection.fetch({
                error: (function (e) {
                    console.log(e);
                })
            });
        },

        render: function () {
            if (this.model == undefined)
                return;
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
})(jQuery);