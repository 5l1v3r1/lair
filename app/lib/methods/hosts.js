/* globals Meteor check AuthorizeChange Matchers Hosts IPUtils _ Models Services WebDirectories Issues */
Meteor.methods({
  createHost: createHost,
  removeHost: removeHost,
  setHostStatus: setHostStatus,
  setHostStatusMessage: setHostStatusMessage,
  setOs: setOs,
  addHostname: addHostname,
  removeHostname: removeHostname,
  addHostTag: addHostTag,
  removeHostTag: removeHostTag,
  disableHostFlag: disableHostFlag,
  enableHostFlag: enableHostFlag,
  addHostNote: addHostNote,
  removeHostNote: removeHostNote,
  setHostNoteContent: setHostNoteContent,
  addWebDirectory: addWebDirectory,
  removeWebDirectory: removeWebDirectory,
  enableWebDirectoryFlag: enableWebDirectoryFlag,
  disableWebDirectoryFlag: disableWebDirectoryFlag
})

function createHost (id, ip, mac) {
  check(id, Matchers.isObjectId)
  check(ip, Matchers.isIPv4)
  check(mac, Matchers.isMAC)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  if (Hosts.findOne({
    ipv4: ip,
    projectId: id
  })) {
    throw new Meteor.Error(400, 'Host with that IP already exists')
  }
  var host = _.extend(Models.host(), {
    projectId: id,
    ipv4: ip,
    longIpv4Addr: IPUtils.ip2Long(ip),
    mac: mac,
    lastModifiedBy: Meteor.user().emails[0].address
  })
  return Hosts.insert(host)
}

function removeHost (id, hostId) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  Services.remove({
    projectId: id,
    hostId: hostId
  })
  WebDirectories.remove({
    projectId: id,
    hostId: hostId
  })
  var host = Hosts.findOne({
    _id: hostId,
    projectId: id
  })
  if (!host) {
    throw new Meteor.Error(404, 'Not Found')
  }
  Issues.update({
    projectId: id
  }, {
    $pull: {
      hosts: {
        ipv4: host.ipv4
      }
    },
    $set: {
      lastModifiedBy: Meteor.user().emails[0].address
    }
  }, {
    multi: true
  })
  Hosts.remove({
    projectId: id,
    _id: hostId
  })
}

function setOs (id, hostId, tool, fingerprint, weight) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(tool, Matchers.isNonEmptyString)
  check(fingerprint, Matchers.isNonEmptyString)
  check(weight, Number)
  if (weight < 0) {
    weight = 0
  }
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  var os = _.extend(Models.os(), {
    tool: tool,
    fingerprint: fingerprint,
    weight: weight
  })
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $set: {
      os: os
    }
  })
}

function addHostname (id, hostId, hostname) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(hostname, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $addToSet: {
      hostnames: hostname
    },
    $set: {
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function removeHostname (id, hostId, hostname) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(hostname, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $pull: {
      hostnames: hostname
    },
    $set: {
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}
function setHostStatusMessage (id, hostId, status) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(status, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $set: {
      statusMessage: status,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function setHostStatus (id, hostId, status) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(status, Matchers.isValidStatus)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $set: {
      status: status,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function addHostTag (id, hostId, tag) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(tag, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $addToSet: {
      tags: tag
    },
    $set: {
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function removeHostTag (id, hostId, tag) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(tag, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $pull: {
      tags: tag
    },
    $set: {
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function enableHostFlag (id, hostId) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $set: {
      isFlagged: true,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function disableHostFlag (id, hostId) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $set: {
      isFlagged: false,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function addHostNote (id, hostId, title, content) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(title, Matchers.isNonEmptyString)
  check(content, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  var note = _.extend(Models.note(), {
    title: title,
    content: content,
    lastModifiedBy: Meteor.user().emails[0].address
  })

  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $push: {
      notes: note
    },
    $set: {
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function removeHostNote (id, hostId, title) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(title, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId
  }, {
    $pull: {
      notes: {
        title: title
      }
    },
    $set: {
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function setHostNoteContent (id, hostId, title, content) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(title, Matchers.isNonEmptyString)
  check(content, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Hosts.update({
    projectId: id,
    _id: hostId,
    'notes.title': title
  }, {
    $set: {
      'notes.$.content': content,
      'notes.$.lastModifiedBy': Meteor.user().emails[0].address,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function addWebDirectory (id, hostId, path, port, responseCode) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(port, Matchers.isPort)
  check(path, Matchers.isNonEmptyString)
  check(responseCode, Matchers.isResponseCode)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  var existing = WebDirectories.find({
    'projectId': id,
    'hostId': hostId,
    'path': path,
    'port': port,
    'responseCode': responseCode
  }).count()
  if (existing !== 0) {
    throw new Meteor.Error('400', 'Path exists already, ignoring')
  }
  var web = _.extend(Models.webDirectory(), {
    projectId: id,
    hostId: hostId,
    path: path,
    port: port,
    responseCode: responseCode,
    lastModifiedBy: Meteor.user().emails[0].address
  })
  return WebDirectories.insert(web)
}

function removeWebDirectory (id, webId) {
  check(id, Matchers.isObjectId)
  check(webId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return WebDirectories.remove({projectId: id, _id: webId})
}

function enableWebDirectoryFlag (id, webId) {
  check(id, Matchers.isObjectId)
  check(webId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return WebDirectories.update({
    projectId: id,
    _id: webId
  }, {
    $set: {
      isFlagged: true,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function disableWebDirectoryFlag (id, webId) {
  check(id, Matchers.isObjectId)
  check(webId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return WebDirectories.update({
    projectId: id,
    _id: webId
  }, {
    $set: {
      isFlagged: false,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}
