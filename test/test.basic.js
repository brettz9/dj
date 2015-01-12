/*global require, module*/
/*jslint vars:true*/
(function () {'use strict';

var dj = require('../lib/DJ'),
    testCase = require('nodeunit').testCase,
    clarinetAdapter = require('../lib/DJ.clarinet');

var json = {
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

module.exports = testCase({
    'simple': function (test) {
        test.expect(1);
        var expected;
        var result = dj();
        test.deepEqual(expected, result);
        test.done();
    },
    'clarinet': function (test) {
        test.expect(1);

        var clarinet = require('clarinet');
        var parser = clarinet.parser();

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
        
        var expected;
        var djParser = clarinetAdapter.DJClarinet;
        
        addMethods(djParser);
        
        djParser.write('{"foo": "bar"}').close();
        
        var result;
        test.deepEqual(expected, result);
        test.done();
    }
});

}());
