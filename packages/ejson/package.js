Package.describe({
  summary: "Extended and Extensible JSON library",
  version: '1.0.13'
});

Package.onUse(function (api) {
  api.use(['ecmascript', 'underscore', 'base64']);
  api.export('EJSON');
  api.export('EJSONTest', { testOnly: true });
  api.addFiles('stringify.js');
  api.mainModule('ejson.js');
});

Package.onTest(function (api) {
  api.use('ejson', ['client', 'server']);
  api.use(['ecmascript', 'tinytest', 'underscore']);
  api.addFiles('custom_models_for_tests.js');
  api.addFiles('ejson_test.js');
});
