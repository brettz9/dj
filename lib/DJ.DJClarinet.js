/*globals DJ, ObjectArrayDelegator */
/*jslint todo:true*/
/**
* This class uses the abstract ObjectArrayDelegator for object/array delegating so as to work with the terminal methods here
*/
var require, DJ, ObjectArrayDelegator, module;
(function () {'use strict';

if (require) {
    DJ = require('./DJ');
    ObjectArrayDelegator = require('./DJ.ObjectArrayDelegator');
}

DJ.createAndExport({name: 'DJClarinet', module: module, inherits: ObjectArrayDelegator, constructs (options) {
        this.closed = false;
        this.opt = options;
        // todo: line, column, position
        this.super(options);
    }, methods: {

    // JSON terminal handler methods

    // These four methods can be overridden without affecting the logic of the objectHandler and arrayHandler to utilize
    //   reporting of the object as a whole
    beginObjectHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onopenobject(Object.keys(value)[0]);
    },
    endObjectHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.oncloseobject();
    },
    beginArrayHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onopenarray();
    },
    endArrayHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onclosearray();
    },

    // JSON terminal key handler methods

    objectKeyHandler (key, parentObject, parentKey, parentObjectArrayBool, iterCt) {
        return this.onkey(key);
    },
    arrayKeyHandler (key, parentObject, parentKey, parentObjectArrayBool) {
        return;
    },

    // JSON terminal primitive handler methods

    nullHandler (parentObject, parentKey, parentObjectArrayBool) {
        return this.onvalue(null);
    },
    booleanHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onvalue(value);
    },
    numberHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onvalue(value);
    },
    stringHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onvalue(value);
    },

    walkJSONString () {
        this.super.apply(this, arguments);
        this.onend();
    },
    // For Clarinet only
    write (input) {
        this.walkJSONString(input);
        return this;
    },
    close () {
        return this;
    },
    resume () {
        return this;
    }
}});

}());
