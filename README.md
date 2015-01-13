# dj

***This project is not yet functional, particularly for Node!***

Descend-through JavaScript or JSON objects in a declarative manner (and optionally compatible with the Clarinet API, though potentially more granular, e.g., with distinct handlers for different scalar value types, and possessing methods available by default in a more readable CamelCase form).

Note that *dj* is not intended as a streaming string parser, though `walkJSONString()` is provided for descending through whole JSON strings. [Clarinet](https://github.com/dscape/clarinet) is more likely the better choice for such cases.

# Some use cases

1. Converting JavaScript structures to JSON
1. SAX-like parsing over XML/XHTML-as-JSON solutions like [Jamilih](https://github.com/brettz9/jamilih) or [JsonML](http://www.jsonml.org/)
1. XSL-like transformations of JSON (or XML-as-JSON), e.g., to [JHTML](https://github.com/brettz9/jhtml)
1. Alternative JSON.stringify() implementations
1. Template transformations (with the option of whether to ultimately replace original content), e.g., whether with output in Jamilih or JsonML JSON (or JS objects with event handlers) or as string or DOM output (see [JTLT](https://github.com/brettz9/jtlt/) project).

# Installation

```
npm install dj-json
```

# Usage

Node:

```
var DJ = require('dj-json');
```

Browser:

```html
<script src="dj/index.js"></script>
```

# Project name

Unlike musicians who use [oboes](http://oboejs.com/) or [clarinets](https://github.com/dscape/clarinet/) to pipe their breaths of data (piecemeal) from an ongoing streaming source (someone's lungs), D.J.'s may create new works using another complete work as the source of their data (i.e., records). They may play an entire record from start to finish or scratch and selectively sample from such a solid complete source record which is akin to what *dj* does in starting with complete JavaScript or JSON objects as the data source.

# Design goals and considerations

1. Accurate, easy to use, small, fast, memory-efficient, universal in coverage, clean code
1. Convenient (e.g., with overridable methods) but not auto-creating likely useful polyfills like
    Object.keys(), Object.getOwnPropertyNames(), JSON, etc. Might reconsider
    optionally auto-exporting them, or adding as handler arguments, in the future, but not planning for now.
1. Context-aware (handlers to include parent objects as well as values or JSONPaths)
1. Customizable: Ability to override/customize any functionality and allow custom types but without need for reimplementing iteration routines
1. Offer optional support of regular JavaScript objects (including those potentially representing XML/HTML with events)
1. Allow pull or auto-push reporting
1. Configuration vis-a-vis Clarinet/sax-js options:
    1. Decided for now against trim/normalize options as in Clarinet as seemed not very useful, though could be
        allowed easily in stringHandler
    1. lowercase and xmlns seem too XML-specific
    1. position has analogue in JSONPath goal
1. Decided against causing conversion to string and feeding into Clarinet (or `JSON.parse(obj, reviver);`) as use cases
    of beginning with JSON rather than merely converting to it were too great (toward JS as main environment or even content-type).
1. Decided against Clarinet handler names as considered ugly relative to CamelCase (despite JS-event-style-familiarity) though
providing a Clarinet adapter
1. Decided against passing Object.keys (or other exports of Object properties like getOwnPropertyNames)
    to beginObjectHandler/beginArrayHandler (and corresponding end methods) as auto-iteration of
    keys/values ought to address most use cases for obtaining all keys and user can do it themselves
    if needed. We did pass length of array to begin and endArrayHandler, however.
1. Have module support standard export formats
1. Demonstrate functionality by implementing JSON.stringify though provide empty version

# Todos

1. Complete existing code!
    1. Ensure works with Node
1. Provide demo which overrides add() to do its own non-string concatenation work
1. Pull as well as automatic cycling
1. Adapt (as with SAX) to allow DOM TreeWalker-style traversal along with XSL-style iteration
1. JSONPath
    1. Allow JSONPath on supplied data object
    1. Reimplement as JSONPath dependency (calling it by default with `$` and `$..*`)?
        1. Provide JSONPaths to methods?
1. TreeWalker/NodeIterator equivalents?
1. Add array-extra methods along with functional join?
1. Infinity, NaN, String, Number, Date, etc.
1. Add depth level property (which could be used, e.g., by a JSON.stringify implementation)
    1. Implement self-sufficient JSON.stringify
        1. Finish array/object (call delegateHandlersByType inside keyValueHandler or in object/arrayHandler?;
            change keyValueHandlers to return commas, etc.)
        1. Avoid functions/undefined/prototype completely, and converting nonfinite to null
        1. Support replacer and space arguments in our stringifier and remove JSON.stringify dependency for strings
1. Add valueHandler option for generically handling values (as in Clarinet)
1. Allow asynchronous value-adding (e.g., to parse with `setTimeout` to avoid performance problems)

# Related ideas/todos

1. Add getXPath() for DOM node prototype (modify [this](https://developer.mozilla.org/en-US/docs/Using_XPath#getXPathForElement) and avoid 2nd argument via `ownerDocument`)
1. Report current XPaths to SAX and follow SAX API for objects (slightly more linear than climbing through children manually)?
