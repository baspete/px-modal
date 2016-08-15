'use strict';
// This node application copies the files specified in the 'files' array to our CDN,
// changing any strings defined in the config section.
//
// Usage:
//   node cdnify.js -v <version> (-d)
//
// Options:
//   -v (string) Version. Required.
//   -d (null)   Dry run. Does everything but upload to the CDN. Optional
//
// Dependencies:
//   process.env.AWS_ACCESS_KEY
//   process.env.AWS_SECRET_ACCESS_KEY
//   process.env.HTTP_PROXY

var argv = require('minimist')(process.argv.slice(2)), // get options passed to this program
    fs = require('fs-extra'),
    cdn = require('../predix-cdn/');

// #######################################################
// CONFIGURATION

    // Get the app name from package.json. This must be unique!
var appName = fs.readJsonSync('./package.json').name,
    version = argv.v, // -v
    dryrun = argv.d;  // -d

var options = {
  name: 'predixdev/' + appName,
  // Options passed when calling this program
  version: version,
  dryrun: dryrun,
  // Where do we read files from?
  root: './dist/public/',
  // Which files in 'root' do we want to upload to the CDN?
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
