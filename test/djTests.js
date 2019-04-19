import DJ from '../lib/DJ.js';

const djTests = {
  'basic test' (test) {
    test.expect(7);

    const sf = DJ.Stringifier();
    const sfJS = DJ.Stringifier({mode: 'JavaScript'});

    test.strictEqual('null', sf.walkJSONObject(null));
    test.strictEqual('true', sf.walkJSONObject(true));
    test.strictEqual('400000', sf.walkJSONObject(4e5));
    test.strictEqual('"abc"', sf.walkJSONObject('abc'));
    test.strictEqual(
      '["childItem","childWith\\"Dbl\\"Quotes"]',
      sf.walkJSONObject(['childItem', 'childWith"Dbl"Quotes'])
    );

    test.strictEqual(
      '{"a":null,"b":true,"c":3,"d":["childItem","childWith\\"Dbl\\"Quotes"],"e":{"nested":true},"f":null}',
      sf.walkJSONObject({
        a: null, b: true, c: 3,
        d: ['childItem', 'childWith"Dbl"Quotes'],
        e: {nested: true}, f: Infinity
      })
    );

    test.strictEqual(
      '{"a":null,"b":true,"c":3,"d":["childItem","childWith\\"Dbl\\"Quotes"],"e":{"nested":true},"f":Infinity,"g":undefined,"h":function () {}}',
      sfJS.walkJSONObject({
        a: null, b: true, c: 3,
        d: ['childItem', 'childWith"Dbl"Quotes'],
        e: {nested: true}, f: Infinity, g: undefined, h () {}
      })
    );

    test.done();
  }
};

export default djTests;
