'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _googleAuthLibrary = require('google-auth-library');

var _googleAuthLibrary2 = _interopRequireDefault(_googleAuthLibrary);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _getNewToken = require('./get-new-token');

var _getNewToken2 = _interopRequireDefault(_getNewToken);

var _exportGdoc = require('./export-gdoc');

var _exportGdoc2 = _interopRequireDefault(_exportGdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOKEN_PATH = _path2.default.resolve(process.cwd(), 'archie-token.json');

var authorize = function authorize(archie) {
  var clientSecret = archie.clientSecret;
  var clientId = archie.clientId;
  var redirectUrl = archie.redirectUrl;
  var auth = new _googleAuthLibrary2.default();
  var oauth = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  _fsExtra2.default.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      (0, _getNewToken2.default)(oauth, archie);
    } else {
      oauth.credentials = JSON.parse(token);
      (0, _exportGdoc2.default)(oauth, archie);
    }
  });
};

exports.default = authorize;