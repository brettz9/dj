import {testCase} from 'nodeunit';
import dj from '../lib/DJ.js';
import ClarinetAdapter from '../lib/DJ.clarinet.js';

const json = {
  "store": {
    "book": { "category": "reference",
      "author": "Nigel Rees",
      "title": "Sayings of the Century",
      "price": [8.95, 8.94, 8.93]
    },
    "books": [
      { "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": [8.95, 8.94, 8.93]
      }
    ]
  }
};

const tests = testCase({
  simple (test) {
    test.expect(1);
    let expected;
    const result = dj();
    test.deepEqual(expected, result);
    test.done();
  },
  clarinet (test) {
    test.expect(1);

    const clarinet = require('clarinet');
    const parser = clarinet.parser();

    function addMethods (parser) {
      parser.onerror = function (e) {
        // an error happened. e is the error.
      };
      parser.onvalue = function (v) {
        // got some value.  v is the value. can be string, double, bool, or null.
      };
      parser.onopenobject = function (key) {
        // opened an object. key is the first key.
      };
      parser.onkey = function (key) {
        // got a key in an object.
      };
      parser.oncloseobject = function () {
        // closed an object.
      };
      parser.onopenarray = function () {
        // opened an array.
      };
      parser.onclosearray = function () {
        // closed an array.
      };
      parser.onend = function () {
        // parser stream is done, and ready to have more stuff written to it.
      };
    }
    addMethods(parser);

    parser.write('{"foo": "bar"}').close();

    let expected;
    const djParser = new ClarinetAdapter();

    addMethods(djParser);

    djParser.write('{"foo": "bar"}').close();

    let result;
    test.deepEqual(expected, result);
    test.done();
  }
});

export default tests;
