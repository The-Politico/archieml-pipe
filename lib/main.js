'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _authorize = require('./archieml-pipe/authorize');

var _authorize2 = _interopRequireDefault(_authorize);

var _logging = require('./archieml-pipe/logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  googleDocId: null,
  googleClientId: null,
  googleClientSecret: null,
  redirectPort: '6006',
  exportPath: _path2.default.resolve(process.cwd(), 'data.json'),
  tokenPath: _path2.default.resolve(process.cwd(), 'archie-token.json')
};

var main = function main(customOptions) {
  var opts = Object.assign(defaults, customOptions);
  if (!opts.googleDocId || !opts.googleClientId || !opts.googleClientSecret) {
    _logging2.default.error(_chalk2.default.bgRed('Missing Google connection info.'));
    return;
  }
  (0, _authorize2.default)(opts);
};

exports.default = main;