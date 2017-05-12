'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _authorize = require('./authorize');

var _authorize2 = _interopRequireDefault(_authorize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prompt = function prompt(exportPath) {
  var questions = [{
    name: 'docId',
    message: 'What\'s your Google doc ID?'
  }, {
    name: 'clientId',
    message: 'What\'s your Google app client ID?'
  }, {
    name: 'secretKey',
    message: 'What\'s your Google app client secret key?'
  }];

  var archieConfig = _path2.default.resolve(process.cwd(), 'archie.json');
  var archie = void 0;

  if (!_fsExtra2.default.existsSync(archieConfig)) {
    _inquirer2.default.prompt(questions).then(function (answers) {
      _fsExtra2.default.writeJsonSync(archieConfig, {
        docId: answers.docId,
        clientId: answers.clientId,
        clientSecret: answers.secretKey,
        redirectUrl: 'http://localhost:6006'
      });
      archie = _fsExtra2.default.readJsonSync(archieConfig);
      archie.exportPath = exportPath;
      (0, _authorize2.default)(archie);
    });
  } else {
    archie = _fsExtra2.default.readJsonSync(archieConfig);
    archie.exportPath = exportPath;
    (0, _authorize2.default)(archie);
  }
};

exports.default = prompt;