'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _archieml = require('archieml');

var _archieml2 = _interopRequireDefault(_archieml);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _htmlEntities = require('html-entities');

var _htmlEntities2 = _interopRequireDefault(_htmlEntities);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Entities = _htmlEntities2.default.AllHtmlEntities;

var parseGDoc = function parseGDoc(dom, opts) {
  var tagHandlers = {
    base: function base(tag) {
      var str = '';
      tag.children.forEach(function (child) {
        var func = tagHandlers[child.name || child.type] || false;
        if (func) str += func(child);
      });
      return str;
    },
    text: function text(textTag) {
      return textTag.data;
    },
    span: function span(spanTag) {
      return tagHandlers.base(spanTag);
    },
    p: function p(pTag) {
      return tagHandlers.base(pTag) + '\n';
    },
    a: function a(aTag) {
      var href = aTag.attribs.href;
      if (href === undefined) return '';

      // extract real URLs from Google's tracking
      // from: http://www.google.com/url?q=http%3A%2F%2Fwww.nytimes.com...
      // to: http://www.nytimes.com...
      if (aTag.attribs.href && _url2.default.parse(aTag.attribs.href, true).query && _url2.default.parse(aTag.attribs.href, true).query.q) {
        href = _url2.default.parse(aTag.attribs.href, true).query.q;
      }

      var str = '<a href="' + href + '">';
      str += tagHandlers.base(aTag);
      str += '</a>';
      return str;
    },
    li: function li(tag) {
      return '* ' + tagHandlers.base(tag) + '\n';
    }
  };

  ['ul', 'ol'].forEach(function (tag) {
    tagHandlers[tag] = tagHandlers.span;
  });
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (tag) {
    tagHandlers[tag] = tagHandlers.p;
  });

  try {
    var body = dom[0].children[1];
    var parsedText = tagHandlers.base(body);

    // Convert html entities into the characters as they exist in the google doc
    var entities = new Entities();
    parsedText = entities.decode(parsedText);

    // Remove smart quotes from inside tags
    parsedText = parsedText.replace(/<[^<>]*>/g, function (match) {
      return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
    });

    var archieData = _archieml2.default.load(parsedText);
    _fsExtra2.default.writeJSON(opts.exportPath, archieData);
    return archieData;
  } catch (e) {
    _logging2.default.error(_chalk2.default.bgRed('Error accessing Google Doc'), 'Are you sure you\'ve shared it? :', e);
  }
  return null;
};

exports.default = parseGDoc;