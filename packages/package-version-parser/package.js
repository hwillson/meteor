Package.describe({
  summary: "Parses Meteor Smart Package version strings",
  version: "3.0.1-winr.2",
  documentation: null
});

Package.onUse(function (api) {
  api.export('PackageVersion');
  api.use('underscore');
  api.addFiles(['semver410.js',
                'package-version-parser.js']);
});

Package.onTest(function (api) {
  api.use('package-version-parser');
  api.use(['tinytest']);
  api.addFiles('package-version-parser-tests.js', 'server');
});
