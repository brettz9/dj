var define, exports, module;
(function (undef) {'use strict';

// PRIVATE STATIC UTILITIES

/**
* Make a shallow or deep copy of an object
* @private
* @constant
* @param {Object} obj Object to copy
* @param {Boolean} [deep] Whether or not to make a deep copy. Defaults to false
* @returns {Object} Copied object
*/
function _copyObject (obj, deep) {
    var prop, copyObj = {};
    for (prop in obj) {
        if (deep && obj[prop] && typeof obj[prop] === 'object') {
            copyObj[prop] = _copyObject(obj[prop]);
        }
        else {
            copyObj[prop] = obj[prop];
        }
    }
    return copyObj;
}


// GENERIC JSON/JS CONSTRUCTOR

/**
* @constructor
* @param {Object} options See setDefaultOptions() function body for some possibilities
* @requires DJ.interface.js (or another such interface file)
* @todo Fix docs of options
* @todo Support object + JSONPath as first argument for iteration within a larger tree
*/
function DJ (options) {
    if (!(this instanceof DJ)) {
        return new DJ(options);
    }

    this.setDefaultOptions(options);
}

// OPTIONS
DJ.prototype.setDefaultOptions = function setDefaultOptions (options) {
    options = options || {};
    this.options = options;

    // Todo: to make properties read-only, etc., use https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperties

    // CUSTOM PROPERTIES
    this.ret = '';
    this.mode = options.mode || 'JSON'; // Whether to support full JavaScript objects (with functions, undefined, nonfiniteNumbers) or JSON; will not distinguish object literals from other objects, but neither does JSON.stringify which ignores prototype and drops functions/undefined and converts nonfinite to null

    this.distinguishKeysValues = options.distinguishKeysValues || false;

    this.iterateArrays = options.iterateArrays !== undef ? options.iterateArrays : true;
    this.iterateObjects = options.iterateObjects !== undef ? options.iterateObjects : true;

    this.iterateObjectPrototype = options.iterateObjectPrototype || false;
    this.iterateArrayPrototype = options.iterateArrayPrototype || false;

    this.alterDefaultHandlers(options); // This must be called after options are set
};

/**
* Rather than use the strategy design pattern, we'll override our prototype selectively
*/
DJ.prototype.alterDefaultHandlers = function alterDefaultHandlers (options) {
    if (this.distinguishKeysValues) {
        this.keyValueHandler = this.keyValueDistinguishedHandler;
    }
    if (options.delegateHandlers) {
        this.delegateHandlers = options.delegateHandlers;
    }
};

// PUBLIC METHODS TO INITIATE PARSING

/**
* For strings, one may wish to use Clarinet <https://github.com/dscape/clarinet> to
*   avoid extra overhead or parsing twice
* @param {String} str The JSON string to be walked (after complete conversion to an object)
* @param {Object|Array} [parentObject] The parent object or array containing the string (not required)
* @param {String} [parentKey] The parent object or array's key (not required)
* @param {Boolean} [parentObjectArrayBool] Whether the parent object is an array (not another object) (not required)
*/
DJ.prototype.walkJSONString = function walkJSONString (str, parentObject, parentKey, parentObjectArrayBool) {
    return this.walkJSONObject(JSON.parse(str), parentObject, parentKey, parentObjectArrayBool);
};

/**
*
* @param {Object} obj The JSON object to walk
* @param {Object|Array} [parentObject] The parent object or array containing the string (not required)
* @param {String} [parentKey] The parent object or array's key (not required)
* @param {Boolean} [parentObjectArrayBool] Whether the parent object is an array (not another object) (not required)
* @property {string|any} ret The intermediate return value (if any) from beginHandler and delegateHandlersByType delegation
* @returns {string|any} The final return value including beginHandler and delegateHandlersByType delegation plus any endHandler additions; one may build one's own intermediate values, but "ret" should be set to return the value
*/
DJ.prototype.walkJSONObject = function walkJSONObject (obj, parentObject, parentKey, parentObjectArrayBool) {
    this.root = obj;
    var parObj = parentObject || this.options.parentObject,
        parKey = parentKey || this.options.parentKey,
        parObjArrBool = parentObjectArrayBool || this.options.parentObjectArrayBool || (parObj && this.isArrayType(parObj));
    this.add(this.beginHandler(obj, parObj, parKey, parObjArrBool));
    this.add(this.delegateHandlersByType(obj, parObj, parKey, parObjArrBool));
    this.add(this.endHandler(obj, parObj, parKey, parObjArrBool));
    return this.ret;
};

// BEGIN AND END HANDLERS

DJ.prototype.add = function (val) {
    this.ret += val;
};

DJ.prototype.beginHandler = function endHandler (obj, parObj, parKey, parObjArrBool) {
    return '';
};

/**
* We just make available the passed in arguments
*/
DJ.prototype.endHandler = function endHandler (obj, parObj, parKey, parObjArrBool) {
    return '';
};

// HANDLER DELEGATION BY TYPE

// Todo: override this (or separate out and override secondary method) to delegate
//         objects/arrays separately but for others, pass type as arg, not within method name

DJ.prototype.delegateHandlersByType = function delegateHandlersByType (obj, parentObject, parentKey, parentObjectArrayBool) {
    var suffix = 'Handler',
        type = this.detectBasicType(obj, parentObject, parentKey, parentObjectArrayBool);

    switch (type) {
        case 'null': case 'undefined':
            return this.delegateHandlers(type + suffix, parentObject, parentKey, parentObjectArrayBool);
        case 'array': case 'object':
        case 'ignore': // Will delegate by default so that handler can log, etc.
            // Fall-through
        default:
            return this.delegateHandlers(type + suffix, parentObject, parentKey, parentObjectArrayBool, obj);
    }
};

/**
* Allows override to allow for immediate or delayed execution; should handle both null/undefined
* types (which require no first value argument since only one is possible) and other types
*/
DJ.prototype.delegateHandlers = function (type, parentObj, parentKey, parentObjectArrayBool, obj) {
    if (arguments.length === 5) {
        return this[type](obj, parentObj, parentKey, parentObjectArrayBool);
    }
    return this[type](parentObj, parentKey, parentObjectArrayBool);
};

// DETECT TYPES
DJ.prototype.detectBasicType = function detectBasicType (obj, parentObject, parentKey, parentObjectArrayBool) {
    var type = typeof obj,
        JSMode = this.mode === 'JavaScript';
    switch (type) {
        // JavaScript-only
        case 'number':
            if (!isFinite(obj)) {
                if (JSMode) {
                    return 'nonfiniteNumber';
                // Can return a custom type and add that handler to the object to convert to JSON
                }
                return this.typeErrorHandler('nonfiniteNumber', obj, parentObject, parentKey, parentObjectArrayBool);
            }
            return type;
        case 'function': case 'undefined':
            if (!JSMode) {
                // Can return a custom type and add that handler to the object to convert to JSON
                return this.typeErrorHandler(type, obj, parentObject, parentKey, parentObjectArrayBool);
            }
        case 'boolean': case 'string':
            return type;
        case 'object':
            return obj ?
                (this.isArrayType(obj) ?
                    'array' :
                    (JSMode ? this.detectObjectType(obj) : 'object')
                ) :
                'null';
    }
};

/**
* Could override to always return false if one wished to merge arrayHandler/objectHandler or, if in
*  JSMode, to merge detectObjectType and this isArrayType method. To merge arrayKeyValueHandler and
*  objectKeyValueHandler, see keyValueHandler.
*/
DJ.prototype.isArrayType = function isArrayType (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
* Allow overriding to detect Date, RegExp, or other types (which will in turn route to corresponding
*  names)
*/
DJ.prototype.detectObjectType = function detectObjectType (obj) {
    return 'object';
};

// ERROR HANDLING
/**
May throw or return type string (can be custom type if handler present)
*/
DJ.prototype.typeErrorHandler = function errorHandler (type, obj, parentObject, parentKey, parentObjectArrayBool) {
    switch (type) {
        // Could utilize commented out portions as below to allow JSON mode to still handle certain non-JSON types (though
        //  may be better to use JS mode in such a case)
        /*
        case 'function':
            return 'ignore';
            // return type;
        case 'undefined':
            return 'ignore';
            // return type;
            // Or maybe this:
            // return 'null';
        */
        case 'nonfiniteNumber': // We'll behave by default as does JSON.stringify
            return 'null';
        default:
            throw 'Values of type "' + type + '" are only allowed in JavaScript mode, not JSON.';
    }
};

// HANDLERS

/**
* Could override for logging; meant for allowing dropping of properties/methods, e.g., undefined/functions, as
*  done, for example, by JSON.stringify
*/
DJ.prototype.ignoreHandler = function ignoreHandler (obj, parentObj, parentKey, parentObjectArrayBool) {
};

// CLASS METHODS

// Todo: Could make convenience method to build constructor, add to prototype, and export class all together

DJ.createAndReturn = function createAndReturn (options) {
    var method,
        Constructor = options.constructs || DJ.createConstructor(options.inherits);
    for (method in options.methods) {
        Constructor.prototype[method] = (function (method) {
            return function () {
                options.methods.super = Constructor.prototype[method];
                return options.methods[method].apply(this, arguments);
            };
        }(method));
    }
    return Constructor;
};

DJ.createAndExport = function createAndExport (options) {
    var Constructor = DJ.createAndReturn(options);
    DJ.exportClass(Constructor, options.name, options.module);
    return Constructor;
};

DJ.createConstructor = function createConstructor (Inheritor, constructor) {
    Inheritor = Inheritor || DJ;
    var Constructor = constructor || function (options) {
        if (!(this instanceof Constructor)) {
            return new Constructor(options);
        }
        this.setDefaultOptions(options);
    };
    Constructor.prototype = new Inheritor();
    Constructor.prototype.super = function () {
        return new (Function.prototype.bind.apply(Inheritor, arguments));
    };
    return Constructor;
};
DJ.exportClass = function exportClass (clss, name, mod) {
    name = name || clss.name;
    if (define !== undef && define.amd) { // AMD might not allow us to do this dynamically
        define(name, function () {
            return clss;
        });
    }
    else if (mod) {
        mod.exports = clss;
    }
    else {
        window[name] = clss;
    }
};

// SPECIALIZED CONSTRUCTORS (JS)

/**
* @constructor
*/
function DJ_JS (options) {
    var newOpts = _copyObject(options); // We don't make a deep copy, as we only need to overwrite the mode
    newOpts.mode = 'JavaScript';
    return new DJ(newOpts);
}

// EXPORTS
if (module !== undef) {
    DJ.DJ_JS = DJ_JS;
    module.exports = DJ;
}
else {
    var exp = define !== undef && define.amd ? {} : window;
    exp.DJ = DJ;
    exp.DJ_JS = DJ_JS;

    if (define !== undef && define.amd) {
        define(exp);
    }
}

}());
