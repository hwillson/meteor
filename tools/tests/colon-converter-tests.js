var selftest = require('../selftest.js');
var Sandbox = selftest.Sandbox;
var files = require('../files.js');
var testUtils = require('../test-utils.js');
var utils = require('../utils.js');
var _ = require('underscore');
var tropohouse = require('../tropohouse.js');

var username = "test";
var password = "testtest";

/*
This file tests Windows compatibility code. The main problem we are solving
is that the Windows file system can't handle files with certain characters
such as colons in file paths.

Here is the solution we reached:
1. All packages published from Meteor 1.1 onwards will work the same way on
windows and posix. This means we will just not let you publish a package if
some of the file paths have colons.
2. For packages published before 1.1:
  On mac/linux: downloaded and used as-is
  On Windows: downloaded and converted to contain only valid file paths.
    The result is that some old packages might not work on Windows because of
    bad file paths. Unfortunately, this is unavoidable since we have no way
    of automatically converting those packages to work. In this case, users
    should fix and republish their packages with Meteor 1.1 or above.

We need to test three things:

1. You can't publish a package whose built tarball has colons in the file paths.
2. On mac/linux, a downloaded package that has colons in the file paths is saved
as-is, with no modifications
3. On Windows, a downloaded package that has colons in the file paths is
converted to have no colons, and the metadata files are converted properly as
well.
*/

// Tests step 1: publishing tarball with colons

// Returns a random package name.
var randomizedPackageName = function (username, start) {
  // We often use package names in long, wrapped string output, so having them
  // be a consistent length is very useful.
  var startStr = start ? start + "-" : "";
  return username + ":" + startStr + utils.randomToken().substring(0, 6);
};

selftest.define("can't publish package with colons", ["net", "test-package-server"], function () {
  var s = new Sandbox();

  testUtils.login(s, username, password);
  var packageName = randomizedPackageName(username, "package-with-colons");
  s.createPackage(packageName, "package-with-colons");

  s.cd(packageName, function () {
    var run = s.run("publish", "--create");

    run.matchErr("invalid characters");

    // This error can basically only occur on files from npm
    run.matchErr("./npm/node_modules");
  });
});

// Tests step 2: old packages downloaded as-is

// This test is only for unixy platforms
if (process.platform !== "win32") {
  selftest.define("package with colons is unpacked as-is on unix", function () {
    // First, create a tarball of the built package
    var tarballPath = files.pathJoin(files.convertToStandardPath(__dirname),
      "built-packages", "has-colons.tgz");
    var tarball = files.readFile(tarballPath);

    var extractPath = files.mkdtemp();
    utils.execFileSync("tar",
      ["-xzf", tarballPath, "-C", extractPath, "--strip", "1"]);

    // Next, unpack it using our tropohouse code
    var targetDirectory = tropohouse._extractAndConvert(tarball);

    // Now, compare all of the filepaths and file contents
    var startingTreeHash = files.treeHash(extractPath);
    var finalTreeHash = files.treeHash(targetDirectory);

    selftest.expectEqual(finalTreeHash, startingTreeHash);
  });
}

// Tests step 3: check if old packages are converted properly to have no weird
// paths for Windows

