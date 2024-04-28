Package.describe({
  name: 'storyteller:fictionaltime',
  version: '0.5.0',
  // Brief, one-line summary of the package.
  summary: 'Create your own linear fictional time.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/StorytellerCZ/meteor-fictionaltime',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom(['1.12.1', '2.3.1', '2.8.1', '3.0-rc.0']);
  api.use(['ecmascript', 'typescript']);
  api.use('logging');
  api.use('zodern:types@1.0.13');

  //export out the fictionaltime
  api.mainModule('./fictionaltime.ts');
})

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('storyteller:fictionaltime');
  api.addFiles('fictionaltime-tests.ts');
})
