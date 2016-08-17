'use strict';
// This node application copies the files specified in the 'files' array to our CDN,
// changing any strings defined in the config section.
//
// Usage:
//   node cdnify.js (-v <version>) (-d)
//
// Options:
//   -v (string) Version (optional, package.json used if not provided).
//   -d (null)   Dry run (optional). Does everything but upload to the CDN.
//
// Dependencies:
//   process.env.AWS_ACCESS_KEY
//   process.env.AWS_SECRET_ACCESS_KEY
//   process.env.HTTP_PROXY

var args = require('minimist')(process.argv.slice(2), {'--':true,alias:{v:'version',d:'dryrun'}}),
    fs = require('fs-extra'),
    cdn = require('../predix-cdn/');

// #######################################################
// CONFIGURATION

var options = {
  name: 'predixdev/' + fs.readJsonSync('./package.json').name,
  version: args.v || fs.readJsonSync('./package.json').version,
  dryrun: args.d,
  update: false, // never change files that don't get uploaded.
  // Which files in there do we want to upload to the CDN?
  files: [
    'css/px-modal.css',
    'px-modal.html'
  ],
  // Which strings do we want to replace?
  // (predix-cdn will automatically replace polymer.html, es6-promise and webcomponents-lite)
  strings: [],
  // Which Px components do you depend on?
  px: ['px-theme'],
  // Ignore files in these directories
  excludeDir: [
    '.github',
    'bower_components',
    'node_modules',
    'sass',
    'scripts',
    'test'
  ]
};

// END CONFIGURATION
// #######################################################

// CDNify and upload the files in options.files
cdn.cdnify(options);
