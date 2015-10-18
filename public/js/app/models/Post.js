define(["config",
        "moment",
        "lodash",
        "app/app"], function(config, moment, _, App) {
  "use strict";

  App.Post = DS.Model.extend({
    resourceUrl: config.host + '/v1/posts',

    body: DS.attr('string'),
    createdAt: DS.attr('number'),
    updatedAt: DS.attr('number'),
    omittedComments: DS.attr('number'),
    omittedLikes: DS.attr('number'),

    createdBy: DS.belongsTo('user'),
    attachments: DS.hasMany('attachment'),
    comments: DS.hasMany('comment'),
    likes: DS.hasMany('user'),
    groups: DS.hasMany('group'),
    postedTo: DS.hasMany('subscription'),

    isHidden: DS.attr('boolean'),

    timeline: DS.belongsTo('timeline'),

    anyFeeds: function() {
      return this.get('publicSubscriptions.length') > 0
    }.property('publicSubscriptions'),

    groupsOnly: function() {
      var feeds = this.get('postedTo').toArray()
      return _.filter(feeds, function(feed) {
        return feed.get('user.isGroup')
      }).length === feeds.length
    }.property('postedTo'),

    publicSubscriptions: function() {
      var subscriptions = _.filter(this.get('postedTo').toArray(), function(feed) {
        return feed.get('name') == 'Posts'
      })
      // this post has been sumitted to home feed
      if (subscriptions.length === 1 && subscriptions[0].get('user.isUser')) {
        subscriptions = []
      }
      return subscriptions
    }.property('postedTo'),

    createdAgo: function() {
      if (this.get('createdAt')) {
        return moment(this.get('createdAt')).fromNowOrNow()
      }
    }.property('createdAt'),

    createdAtISO: function() {
      if (this.get('createdAt')) {
        return moment(this.get('createdAt')).format()
      }
    }.property('createdAt'),

    like: function() {
      return Ember.$.ajax({
        url: this.resourceUrl + '/' + this.get('id') + '/like',
        type: 'post'
      })
    },

    unlike: function() {
      return Ember.$.ajax({
        url: this.resourceUrl + '/' + this.get('id') + '/unlike',
        type: 'post'
      })
    },

    hide: function() {
      return Ember.$.ajax({
        url: this.resourceUrl + '/' + this.get('id') + '/hide',
        type: 'post',
        context: this
      })
        .then(function(res) {
          this.set('isHidden', true)
        })
    },

    unhide: function() {
      return Ember.$.ajax({
        url: this.resourceUrl + '/' + this.get('id') + '/unhide',
        type: 'post',
        context: this
      })
        .then(function(res) {
          this.set('isHidden', false)
        })
    },

    canHide: function() {
      return !this.get('isHidden')
    }.property('isHidden'),

    canUnhide: function() {
      return this.get('isHidden')
    }.property('isHidden'),

    postedToFirstObject: function() {
      return this.get('postedTo.firstObject.user.username')
        || this.get('createdBy.username')
    }.property('postedTo', 'createdBy')
  })
})
