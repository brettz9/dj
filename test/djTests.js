var DJ, Stringifier, exports;

var djTests = {
    'basic test': function (test) {
        test.expect(1);

        var sf = DJ.Stringifier();
        var sfJS = DJ.Stringifier({mode: 'JavaScript'});

        console.log(sf.walkJSONObject(null));
        console.log(sf.walkJSONObject(true));
        console.log(sf.walkJSONObject(4e5));
        console.log(sf.walkJSONObject('abc'));
        console.log(sf.walkJSONObject(['childItem', 'childWith"Dbl"Quotes']));

        console.log(
            sf.walkJSONObject({a: null, b: true, c: 3, d: ['childItem', 'childWith"Dbl"Quotes'], e: {nested: true}, f: Infinity})
        );

        console.log(
            sfJS.walkJSONObject({a: null, b: true, c: 3, d: ['childItem', 'childWith"Dbl"Quotes'], e: {nested: true}, f: Infinity, g: undefined, h: function () {}})
        );

        var expected = '';

        var result;

        test.deepEqual(expected, result);
        test.done();
    }
};

if (typeof exports !== 'undefined') {
    DJ = require('../lib/DJ');
    module.exports = djTests;
}
