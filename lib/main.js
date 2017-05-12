'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prompt = require('./archieml-pipe/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var main = function main(exportPath) {
  (0, _prompt2.default)(exportPath);
};

exports.default = main;