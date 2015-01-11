/*global require, module*/
/*jslint vars:true*/
(function () {'use strict';

var dj = require('../DJ'),
    testCase = require('nodeunit').testCase;

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
    }
});

}());
