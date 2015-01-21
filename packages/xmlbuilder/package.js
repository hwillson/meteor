Package.describe({
  summary: "An XML builder for node.js similar to java-xmlbuilder.",
  version: '2.4.5-winr.2,
  documentation: null
});

Npm.depends({
  'xmlbuilder': '2.4.4'
});

Package.onUse(function (api) {
  api.addFiles(['xmlbuilder.js'], 'server');

  api.export('XmlBuilder', 'server');
});
