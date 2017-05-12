'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

var _storeToken = require('./store-token');

var _storeToken2 = _interopRequireDefault(_storeToken);

var _exportGdoc = require('./export-gdoc');

var _exportGdoc2 = _interopRequireDefault(_exportGdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getNewToken = function getNewToken(auth, archie) {
  var oauth = auth;
  var authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly'],
    approval_prompt: 'force'
  });

  var hostname = 'localhost';
  var port = 6006;
  var server = _http2.default.createServer(function (req, res) {
    var queryObject = _url2.default.parse(req.url, true).query;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    // Note the extra "#" is important below. Gets stripped in queryObject.
    res.end('\n      <h1\n        style="padding:10px 20px;\n              display: inline-block;\n              margin: 20px auto;\n              text-align: left;\n              background:#eee;\n              color:#3b5998;\n              font-family:monospace;"\n      >\n      ' + queryObject.code + '#\n      </h1>\n    ');
  });

  server.listen(port, hostname);

  console.log('Authorize this app by visiting this url: ', authUrl);
  (0, _open2.default)(authUrl);
  var questions = [{
    name: 'code',
    message: 'Enter the code you receive from Google here:'
  }];

  _inquirer2.default.prompt(questions).then(function (answers) {
    var code = answers.code;
    server.close();
    oauth.getToken(code, function (err, token) {
      if (err) {
        _logging2.default.log('error', 'Error while trying to retrieve access token: ' + err);
        return;
      }
      oauth.credentials = token;
      (0, _storeToken2.default)(token);
      (0, _exportGdoc2.default)(oauth, archie);
    });
  });
};

exports.default = getNewToken;