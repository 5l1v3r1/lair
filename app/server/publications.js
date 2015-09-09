/* globals Meteor Projects Hosts Services Issues Settings People Credentials AuthInterfaces Netblocks WebDirectories */

function authorizeProjectSub (id, userId) {
  var count = Projects.find({
    _id: id,
    $or: [{owner: userId}, {contributors: userId}]
  }).count()
  return count > 0
}

Meteor.publish('projectListing', function () {
  return Projects.find({
    $or: [{
      owner: this.userId
    }, {
      contributors: this.userId
    }]
  }, {
    fields: {
      name: 1,
      owner: 1,
      contributors: 1,
      createdAt: 1,
      industry: 1,
      description: 1
    }
  })
})

Meteor.publish('project', function (id) {
  if (!this.userId) {
    return []
  }
  return Projects.find({
    _id: id,
    $or: [{
      owner: this.userId
    }, {
      contributors: this.userId
    }]
  })
})

Meteor.publish('people', function (id) {
  if (!this.userId) {
    return []
  }
  if (!authorizeProjectSub(id, this.userId)) {
    return []
  }
  return People.find({
    projectId: id
  })
})

Meteor.publish('authInterfaces', function (id) {
  if (!this.userId) {
    return []
  }
  if (!authorizeProjectSub(id, this.userId)) {
    return []
  }
  return AuthInterfaces.find({
    projectId: id
  })
})

Meteor.publish('netblocks', function (id) {
  if (!this.userId) {
    return []
  }
  if (!authorizeProjectSub(id, this.userId)) {
    return []
  }
  return Netblocks.find({
    projectId: id
  })
})

Meteor.publish('hosts', function (id) {
  if (!this.userId) {
    return []
  }
  if (!authorizeProjectSub(id, this.userId)) {
    return []
  }
  return Hosts.find({
    projectId: id
  })
})

Meteor.publish('services', function (id) {
  if (!this.userId) {
    return []
  }
  if (!authorizeProjectSub(id, this.userId)) {
    return []
  }
  return Services.find({
    projectId: id
  })
})

Meteor.publish('issues', function (id) {
  if (!this.userId) {
    return []
  }
  if (!authorizeProjectSub(id, this.userId)) {
    return []
  }
  return Issues.find({
    projectId: id
  })
})

Meteor.publish('credentials', function (id) {
  if (!this.userId) {
    return []
  }
  if (!authorizeProjectSub(id, this.userId)) {
    return []
  }
  return Credentials.find({
    projectId: id
  })
})

Meteor.publish('web', function (id) {
  if (!this.userId) {
    return []
  }
  if (!authorizeProjectSub(id, this.userId)) {
    return []
  }
  return WebDirectories.find({
    projectId: id
  })
})

Meteor.publish('directory', function () {
  if (!this.userId) {
    return []
  }
  return Meteor.users.find({}, {
    fields: {
      emails: 1,
      profile: 1,
      isAdmin: 1
    }
  })
})

Meteor.publish('settings', function () {
  if (!this.userId) {
    return []
  }
  return Settings.find({})
})
