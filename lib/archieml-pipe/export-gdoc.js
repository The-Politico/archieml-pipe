'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _googleapis = require('googleapis');

var _googleapis2 = _interopRequireDefault(_googleapis);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _htmlparser = require('htmlparser2');

var _htmlparser2 = _interopRequireDefault(_htmlparser);

var _parseGdoc = require('./parse-gdoc');

var _parseGdoc2 = _interopRequireDefault(_parseGdoc);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportDoc = function exportDoc(auth, opts) {
  var drive = _googleapis2.default.drive({
    version: 'v2',
    auth: auth
  });
  drive.files.get({ fileId: opts.googleDocId }, function (er, doc) {
    if (er) {
      _logging2.default.error(_chalk2.default.bgRed('Error accessing gdoc:'), er);
      return;
    }
    var exportLink = doc.exportLinks['text/html'];
    auth._makeRequest({ // eslint-disable-line no-underscore-dangle
      method: 'GET',
      uri: exportLink
    }, function (err, body) {
      if (err) {
        _logging2.default.error(_chalk2.default.bgRed('Error downloading googledoc:'), err);
        return;
      }
      var handler = new _htmlparser2.default.DomHandler(function (error, dom) {
        if (error) {
          _logging2.default.error(_chalk2.default.bgRed('Error parsing googledoc:'), error);
          return;
        }
        (0, _parseGdoc2.default)(dom, opts);
      });
      var parser = new _htmlparser2.default.Parser(handler);
      parser.write(body);
      parser.done();
    });
  });
};

exports.default = exportDoc;