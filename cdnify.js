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
//   cdnconfig.json
//   process.env.AWS_ACCESS_KEY
//   process.env.AWS_SECRET_ACCESS_KEY
//   process.env.HTTP_PROXY

var s3 = require('s3'),
    fs = require('fs-extra'),
    argv = require('minimist')(process.argv.slice(2)),
    cdnizerFactory = require('cdnizer'),
    version = argv.v, // flag is '-v'
    dryrun = argv.d; // skips upload

// #######################################################
// END CONFIGURATION

// Get the app name from package.json
// This will determine the path to these assets on the CDN
const appName = 'predixdev/' + fs.readJsonSync('./package.json').name;

// Get the config for this component
const config = fs.readJsonSync('./cdnconfig.json');

// S3/CloudFront properties
const endpoint = 'dzlpbrbc7yvq0.cloudfront.net',
      bucket = 'apmcdn';

// Which components/libraries are you using?
// See https://github.com/OverZealous/cdnizer for options here
const cdnizer = cdnizerFactory({
  defaultCDNBase: '//' + endpoint + '/' + appName,
  allowMin: false,
  files: config.strings
});

// Which fonts are you using (you probably don't need to change this)
// Note the regex here. It matches:
// - zero or more '../'
// - zero or more 'bower_components/'
// - an empty string
const fonts = {
  ge: {
    path: /(|(\.\.\/|bower_components\/)*)px-typography-design\/type\//g,
    cdn: '//' + endpoint + '/px/fonts/1.0.0/'
  },
  fa: {
    path: /(|(\.\.\/|bower_components\/)*)font-awesome\//g,
    cdn: '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/'
  }
};

// END CONFIGURATION
// #######################################################

// #######################################################
// FILE PROCESSING

function replaceStrings(content){
  // Get rid of '..' relative paths
  // ie: replace any number of '../' with a single '/'
  // We do this because cdnizer doesn't understand '../'
  content = content.replace(/(\.\.\/)/g, '/');
  // Use public CDNs for open-source libraries & fonts
  content = content.replace(fonts.fa.path, fonts.fa.cdn);
  // Replace GE fonts
  content = content.replace(fonts.ge.path, fonts.ge.cdn);
  // Replace component/library URLs
  content = cdnizer(content);
  // OK, we're done here
  return content;
}

// #######################################################
// S3 UPLOADER SETUP
// See https://www.npmjs.com/package/s3

const s3Client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    httpOptions: {
      proxy: process.env.HTTP_PROXY
    }
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
});

const params = {
  localDir: './cdn/', // which files to send to CDN
  deleteRemoved: true,
  s3Params: {
    Bucket: bucket,
    Prefix: appName + '/' + version + '/',
    'CacheControl': 'max-age=31536000, no-transform, public', // 1y
    // other options supported by putObject, except Body and ContentLength.
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  }
};

// #######################################################
// INIT

if(version){
  // Empty the /cdn directory
  fs.emptyDirSync('./cdn/');
  // Change Template Strings to point to CDN assets
  for(let file in config.files){
    let content = fs.readFileSync(config.files[file], 'utf8');
    content = replaceStrings(content);
    fs.outputFileSync('./cdn/' + config.files[file], content);
  }
  // Upload files to S3 Bucket
  if(!dryrun){
    s3Client.uploadDir(params).on('error', function(err) {
      console.error('unable to upload build:', err);
    }).on('end', function() {
      console.log('uploaded', this.filesFound, 'files to', endpoint + '/' + appName + '/' + version + '/');
    });
  }
} else {
  console.log('Please specify a version using the -v option');
}
