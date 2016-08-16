'use strict';
// This node application copies the files specified in the 'files' array to our CDN,
// changing any strings defined in the config section.
//
// Usage:
//   node cdnify.js -v <version> (-d -u)
//
// Options:
//   -v (string) Version. Required.
//   -u (null)   Update dist files with CDN strings. Optional
//   -d (null)   Dry run. Does everything but upload to the CDN. Optional
//
// Dependencies:
//   process.env.AWS_ACCESS_KEY
//   process.env.AWS_SECRET_ACCESS_KEY
//   process.env.HTTP_PROXY (optional - use if you're inside the 3. network)

var args = require('minimist')(process.argv.slice(2), {'--':true,alias:{v:'version',d:'dryrun',u:'update'}}),
    fs = require('fs-extra'),
    cdn = require('../predix-cdn/');

// #######################################################
// CONFIGURATION

// Get the app name from package.json. This must be unique!
var appName = fs.readJsonSync('./package.json').name,
    version = args.v, // -v or --version
    dryrun = args.d,  // -d or --dryrun
    update = args.u;  // -u or --update

var options = {
  name: 'predixdev/' + appName,
  // Options passed when calling this program
  version: version,
  dryrun: dryrun,
  update: update,
  // Which files in there do we want to upload to the CDN?
  files: [
    'css/px-modal.css',
    'px-modal.html'
  ],
  // Which strings do we want to replace?
  strings: [
    {
      file: '/polymer/polymer.html',
      package: 'polymer',
      cdn: '//polygit.org/polymer+:${version}/components/polymer/polymer.html'
    }
  ]
};

// END CONFIGURATION
// #######################################################

// CDNify everything in `root` and upload those files
cdn.cdnify(options);
