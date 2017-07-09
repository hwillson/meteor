Package.describe({
  summary: "Extended and Extensible JSON library",
  version: '1.0.13'
});

Package.onUse(function (api) {
  api.use(['ecmascript', 'underscore', 'base64']);
  api.mainModule('ejson.js');
  api.export('EJSON');
});

Package.onTest(function (api) {
  api.use(['ecmascript', 'tinytest', 'underscore']);
  api.use('ejson');
  api.mainFile('ejson_tests.js');
});
