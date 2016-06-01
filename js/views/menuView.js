/**
 * Created by William Goillot on 04/04/2016.
 */

var app = app || {};

(function($) {
     app.menuView = Backbone.View.extend({
        el: $(".container-menu-top"),

        initialize: (function (params) {
            this.template =  _.template(app.tpl.templates.menu);
            this.render();
        }),

        render: (function () {
            this.$el.html(this.template());
            if (app.checkLogin() == true) {
                $('a#button-logout').show();
                $('img.img-gravatar-menu').attr("src","http://www.gravatar.com/avatar/" + CryptoJS.MD5(app.getCookie("email")));
                $('a#button-profile').text(" " + app.getCookie("username"));
            } else {
                $('a#button-profile').text(" Sign in");
                $('a#button-profile').attr("type", "button");
                $('a#button-profile').attr("data-toggle", "modal");
                $('a#button-profile').attr("data-target", "#ConnexionModal");
                $('a#button-logout').hide();
            }
            return this;
        }),

         events: {
             'click a#button-search': 'clickSearch',
             'click a#button-profile': 'clickProfile',
             'click a#button-logout': 'clickLogout',
             'click a#button-watchlist': 'clickWatchlist'
         },

         clickWatchlist: (function(e) {
             Backbone.history.navigate("watchlist", {trigger: true});
         }),

         clickSearch: (function(e) {
             Backbone.history.navigate("search", {trigger: true});
         }),

         clickProfile: (function(e) {
             var ID = app.getCookie("userID");
             Backbone.history.navigate("profile/" + ID, {trigger: true});
         }),

         clickLogout: (function(e) {
             e.preventDefault();
             if (app.checkCookie() == false)
                 return;
             $.ajax({
                 method: "GET",
                 url: app.baseUrl + "/logout",
                 contentType: 'application/x-www-form-urlencoded',
                 success: function(response) {
                     app.Offline();
                     window.location.href = "index.html";
                     app.eraseCookie("token");
                     app.eraseCookie("username");
                     app.eraseCookie("userID");
                 },
                 error: function(error) {
                     alert("An error occured on logout. Please try again.")
                     return;
                 }
             });
         })
    });
})(jQuery);