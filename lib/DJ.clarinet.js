/*globals DJ, ObjectArrayDelegator */
/**
* This class uses the abstract ObjectArrayDelegator for object/array delegating so as to work with the terminal methods here
*/
(function () {'use strict';

DJ.createAndExport({name: 'DJClarinet', inherits: ObjectArrayDelegator, methods: {

    // JSON terminal handler methods

    // These four methods can be overridden without affecting the logic of the objectHandler and arrayHandler to utilize
    //   reporting of the object as a whole
    beginObjectHandler: function beginObjectHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onopenobject(Object.keys(value)[0]);
    },
    endObjectHandler: function endObjectHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.oncloseobject();
    },
    beginArrayHandler: function beginArrayHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onopenarray();
    },
    endArrayHandler: function endArrayHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onclosearray();
    },

    // JSON terminal key handler methods

    objectKeyHandler: function (key, parentObject, parentKey, parentObjectArrayBool, iterCt) {
        return this.onkey(key);
    },
    arrayKeyHandler: function (key, parentObject, parentKey, parentObjectArrayBool) {
        return;
    },

    // JSON terminal primitive handler methods

    nullHandler: function nullHandler (parentObject, parentKey, parentObjectArrayBool) {
        return this.onvalue(null);
    },
    booleanHandler: function booleanHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onvalue(value);
    },
    numberHandler: function numberHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onvalue(value);
    },
    stringHandler: function stringHandler (value, parentObject, parentKey, parentObjectArrayBool) {
        return this.onvalue(value);
    }
}});

}());
