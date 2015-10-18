define(["app/app",
        "ember",
        "controllers/TimelineGenericController"], function(App, Ember) {
  "use strict";

  // Timeline on homepage
  App.TimelineHomeController = App.TimelineGenericController.extend({
    hiddenPosts: function() {
      var posts = this.get('model.posts')
      return posts.filter(function (post) { return post.get('isHidden') })
    }.property('model.posts.@each.isHidden'),

    hasHiddenPosts: function() {
      return this.get('hiddenPosts').length > 0
    }.property('hiddenPosts.@each')
  })
})
