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

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

var _exportGdoc = require('./export-gdoc');

var _exportGdoc2 = _interopRequireDefault(_exportGdoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getNewToken = function getNewToken(auth, opts) {
  var oauth = auth;
  var authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly'],
    approval_prompt: 'force'
  });

  var hostname = 'localhost';
  var server = _http2.default.createServer(function (req, res) {
    var queryObject = _url2.default.parse(req.url, true).query;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    // Note the extra "#" is important below. Gets stripped in queryObject.
    res.end('\n      <h1\n        style="padding:10px 20px;\n              display: inline-block;\n              margin: 20px auto;\n              text-align: left;\n              background:#eee;\n              color:#3b5998;\n              font-family:monospace;"\n      >\n      ' + queryObject.code + '#\n      </h1>\n    ');
  });

  server.listen(opts.redirectPort, hostname);

  _logging2.default.info('Authorize this app by visiting this url: ', _chalk2.default.magenta(authUrl));
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
        _logging2.default.error(_chalk2.default.bgRed('Error while trying to retrieve access token:'), err);
        return;
      }
      oauth.credentials = token;
      _fsExtra2.default.writeFile(opts.tokenPath, JSON.stringify(token));
      (0, _exportGdoc2.default)(oauth, opts);
    });
  });
};

exports.default = getNewToken;