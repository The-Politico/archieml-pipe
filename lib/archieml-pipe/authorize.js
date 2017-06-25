'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _googleAuthLibrary = require('google-auth-library');

var _googleAuthLibrary2 = _interopRequireDefault(_googleAuthLibrary);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _getNewToken = require('./get-new-token');

var _getNewToken2 = _interopRequireDefault(_getNewToken);

var _exportGdoc = require('./export-gdoc');

var _exportGdoc2 = _interopRequireDefault(_exportGdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authorize = function authorize(opts) {
  var auth = new _googleAuthLibrary2.default();
  var oauth = new auth.OAuth2(opts.googleClientId, opts.googleClientSecret, 'http://localhost:' + opts.redirectPort);

  // Check if we have previously stored a token.
  _fsExtra2.default.readFile(opts.tokenPath, function (err, token) {
    if (err) {
      (0, _getNewToken2.default)(oauth, opts);
    } else {
      oauth.credentials = JSON.parse(token);
      (0, _exportGdoc2.default)(oauth, opts);
    }
  });
};

exports.default = authorize;