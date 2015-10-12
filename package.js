Package.describe({
  name: 'storyteller:fictionaltime',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Create your own linear fictional time.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/AdwinTrave/meteor-fictionaltime',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('meteor');
  api.use('ecmascript');
  //consider using:
  //api.use('momentjs:moment');
  api.addFiles('fictionaltime-class.js');

  //export out the fictionaltime
  api.export("FictionalTime");
})

Package.onTest(function(api) {
  api.use('meteor');
  api.use('ecmascript');
  api.use('tinytest');
  api.use('storyteller:fictionaltime');
  api.addFiles('fictionaltime-tests.js');
})
