/* globals Meteor Matchers AuthorizeChange _ Models check Services */
Meteor.methods({
  createService: createService,
  removeService: removeService,
  disableServiceFlag: disableServiceFlag,
  enableServiceFlag: enableServiceFlag,
  setServiceStatus: setServiceStatus,
  addServiceNote: addServiceNote,
  removeServiceNote: removeServiceNote,
  setServiceNoteContent: setServiceNoteContent
})

function createService (id, hostId, port, protocol, service, product) {
  check(id, Matchers.isObjectId)
  check(port, Matchers.isPort)
  check(protocol, Matchers.isNonEmptyString)
  check(service, String)
  check(product, String)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  if (Services.findOne({
    projectId: id,
    hostId: hostId,
    port: port,
    protocol: protocol
  })) {
    throw new Meteor.Error(400, 'Service with that port alrady exists for this host')
  }
  var p = _.extend(Models.service(), {
    projectId: id,
    hostId: hostId,
    port: port,
    protocol: protocol,
    service: service,
    product: product,
    lastModifiedBy: Meteor.user().emails[0].address
  })
  return Services.insert(p)
}

// TODO: remove issues.
function removeService (id, hostId, serviceId) {
  check(id, Matchers.isObjectId)
  check(hostId, Matchers.isObjectId)
  check(serviceId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Services.remove({
    projectId: id,
    _id: serviceId
  })
}

function setServiceStatus (id, serviceId, status) {
  check(id, Matchers.isObjectId)
  check(serviceId, Matchers.isObjectId)
  check(status, Matchers.isValidStatus)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Services.update({
    projectId: id,
    _id: serviceId
  }, {
    $set: {
      status: status,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function disableServiceFlag (id, serviceId) {
  check(id, Matchers.isObjectId)
  check(serviceId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Services.update({
    projectId: id,
    _id: serviceId
  }, {
    $set: {
      isFlagged: false,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function enableServiceFlag (id, serviceId) {
  check(id, Matchers.isObjectId)
  check(serviceId, Matchers.isObjectId)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Services.update({
    projectId: id,
    _id: serviceId
  }, {
    $set: {
      isFlagged: true,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function addServiceNote (id, serviceId, title, content) {
  check(id, Matchers.isObjectId)
  check(serviceId, Matchers.isObjectId)
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

  return Services.update({
    projectId: id,
    _id: serviceId
  }, {
    $push: {
      notes: note
    },
    $set: {
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}

function removeServiceNote (id, serviceId, title) {
  check(id, Matchers.isObjectId)
  check(serviceId, Matchers.isObjectId)
  check(title, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }
  return Services.update({
    projectId: id,
    _id: serviceId
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

function setServiceNoteContent (id, serviceId, title, content) {
  check(id, Matchers.isObjectId)
  check(serviceId, Matchers.isObjectId)
  check(title, Matchers.isNonEmptyString)
  check(content, Matchers.isNonEmptyString)
  if (!AuthorizeChange(id, this.userId)) {
    throw new Meteor.Error(403, 'Access Denied')
  }

  return Services.update({
    projectId: id,
    _id: serviceId,
    'notes.title': title
  }, {
    $set: {
      'notes.$.content': content,
      'notes.$.lastModifiedBy': Meteor.user().emails[0].address,
      lastModifiedBy: Meteor.user().emails[0].address
    }
  })
}
