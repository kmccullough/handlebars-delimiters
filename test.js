/*!
 * handlebars-delimiters <https://github.com/jonschlinkert/handlebars-delimiters>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var assert = require('assert');
var handlebars = require('handlebars');
var delimiters = require('./');
var hbs;

var fixture = '{%= name %}{{ name }}{{{ name }}}<%= name %><% name %><<= name >><< name >>%{name}%{ name }[[ name ]]';

describe('custom handlebars delimiters', function() {
  beforeEach(function() {
    hbs = handlebars.create();
  });

  function testWith(fixture, expectation) {
    var actual = hbs.compile(fixture)({name: 'Jon Schlinkert'});
    assert.equal(actual, expectation);
  }

  it('should use default delimiters', function() {
    var actual = hbs.compile(fixture)({name: 'Jon Schlinkert'});
    testWith(fixture, '{%= name %}Jon SchlinkertJon Schlinkert<%= name %><% name %><<= name >><< name >>%{name}%{ name }[[ name ]]');
  });

  it('should use <%=...%>', function() {
    delimiters(hbs, ['<%=', '%>']);
    testWith(fixture, '{%= name %}{{ name }}{{{ name }}}Jon Schlinkert<% name %><<= name >><< name >>%{name}%{ name }[[ name ]]');
  });

  it('should use {%=...%}', function() {
    delimiters(hbs, ['{%=', '%}']);
    testWith(fixture, 'Jon Schlinkert{{ name }}{{{ name }}}<%= name %><% name %><<= name >><< name >>%{name}%{ name }[[ name ]]');
  });

  it('should use <%...%>', function() {
    delimiters(hbs, ['<%', '%>']);
    testWith(fixture, '{%= name %}{{ name }}{{{ name }}}<%= name %>Jon Schlinkert<<= name >><< name >>%{name}%{ name }[[ name ]]');
  });

  it('should use <<...>>', function() {
    delimiters(hbs, ['<<', '>>']);
    testWith(fixture, '{%= name %}{{ name }}{{{ name }}}<%= name %><% name %><<= name >>Jon Schlinkert%{name}%{ name }[[ name ]]');
  });

  it('should use <<=...>>', function() {
    delimiters(hbs, ['<<=', '>>']);
    testWith(fixture, '{%= name %}{{ name }}{{{ name }}}<%= name %><% name %>Jon Schlinkert<< name >>%{name}%{ name }[[ name ]]');
  });

  it('should use %{...} with or without spaces', function() {
    delimiters(hbs, ['%{', '}']);
    testWith(fixture, '{%= name %}{{ name }}{{{ name }}}<%= name %><% name %><<= name >><< name >>Jon SchlinkertJon Schlinkert[[ name ]]');
  });

  it('should use [[...]]', function() {
    delimiters(hbs, ['[[', ']]']);
    testWith(fixture, '{%= name %}{{ name }}{{{ name }}}<%= name %><% name %><<= name >><< name >>%{name}%{ name }Jon Schlinkert');
  });

  it('should handle no spaces in first occurence', function() {
    delimiters(hbs, ['%{', '}']);
    testWith("%{name}", 'Jon Schlinkert');
  });

  it('should handle spaces in first occurence', function() {
    delimiters(hbs, ['%{', '}']);
    testWith("%{ name }", 'Jon Schlinkert');
  });

  it('should handle RegExp delimiters', function() {
    delimiters(hbs, [/[A-M]/, /[N-Z]/]);
    var fixture = 'A name_B_name_C_name X_name_Y_name_Z_D name W';
    var expectation = '_name_Y_name_Z_Jon Schlinkert';
    testWith(fixture, expectation);
  });

  it('should not modify equal sign query from RegExp open delimiter', function() {
    delimiters(hbs, [/\[/, /]/]);
    var test = function() { testWith('[= name ]', ''); };
    assert.throws(test, Error, 'Error Thrown for equal sign in expression');
  });

  it('should sanitize non-html delimiters', function() {
    delimiters(hbs, ['<%', '%>', '<<%', '%>>']);
    var fixture = '<% html %>';
    var expectation = '&amp;lt;&amp;gt;';
    var actual = hbs.compile(fixture)({html: '&lt;&gt;'});
    assert.equal(actual, expectation);
  });

  it('should mark safe html delimiters', function() {
    delimiters(hbs, ['<%', '%>', '<<%', '%>>']);
    var fixture = '<<% html %>>';
    var expectation = '&lt;&gt;';
    var actual = hbs.compile(fixture)({html: '&lt;&gt;'});
    assert.equal(actual, expectation);
  });
});
