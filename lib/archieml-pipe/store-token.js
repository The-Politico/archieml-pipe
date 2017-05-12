'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOKEN_PATH = _path2.default.resolve(process.cwd(), 'archie-token.json');

var storeToken = function storeToken(token) {
  _fsExtra2.default.writeFile(TOKEN_PATH, JSON.stringify(token));
};

exports.default = storeToken;