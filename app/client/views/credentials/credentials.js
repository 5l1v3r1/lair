/* globals Template Meteor $ */
Template.credentials.events({
  'click #remove-credentials': function () {
    var inputs = $('.credential-checked')
    var credentialIds = []
    inputs.each(function () {
      if ($(this).is(':checked')) {
        credentialIds.push($(this).attr('id'))
      }
    })

    for (var i = 0; i < credentialIds.length; i++) {
      var id = credentialIds[i]
      Meteor.call('removeCredential', this.projectId, id)
    }
  }
})
