/**
 * Created by William Goillot on 04/04/2016.
 */

var app = app || {};

(function() {
    app.searchModel = Backbone.Model.extend({
        parse: function (response) {
            var icon = '';
            var category = '';
            var id = response.trackId;
            var name = (response.trackName == undefined) ? response.collectionName: response.trackName;
            var description = response.longDescription;
            var type = '';
            var picture = response.artworkUrl100;
            if (response.wrapperType == 'track' && response.kind == 'feature-movie') {
                icon = 'glyphicon glyphicon-film';
                category = 'Movie';
                type = 'movies';
            } else if (response.wrapperType == 'track' && response.kind == 'tv-episode') {
                icon = 'glyphicon glyphicon-facetime-video';
                category = 'Episode';
                type = 'tvshow';
                id = response.collectionId;
            } else if (response.wrapperType == 'collection') {
                icon = 'glyphicon glyphicon-th-large';
                category = response.collectionType;
                type = 'tvshow';
                id = response.collectionId;
            } else if (response.wrapperType == 'artist') {
                icon = 'glyphicon glyphicon-user';
                category = response.artistType;
                name = response.artistName;
                type = 'actors';
                id = response.artistId;
            } else {
                icon = 'glyphicon glyphicon-user';
                category = 'User';
                name = response.name;
                description = response.email;
                picture =  'http://www.gravatar.com/avatar/' + CryptoJS.MD5(response.email);
                type = 'profile';
                id = response.id;
            }
            return {
                glyphicon: icon,
                category: category,
                picture: picture,
                name: name,
                description: description,
                genre: response.primaryGenreName,
                id: id,
                type: type
            }
        }
    });
})();