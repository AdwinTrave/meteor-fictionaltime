Package.describe({
  name: 'storyteller:fictionaltime',
  version: '0.3.0',
  // Brief, one-line summary of the package.
  summary: 'Create your own linear fictional time.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/StorytellerCZ/meteor-fictionaltime',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.9');
  api.use('ecmascript');
  api.use('logging');

  //export out the fictionaltime
  api.mainModule('./fictionaltime.js');
})

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('storyteller:fictionaltime');
  api.addFiles('fictionaltime-tests.js');
})
