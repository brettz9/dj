# dj

Descend-through JavaScript or JSON objects in a declarative manner (and optionally compatible with the Clarinet API, though potentially more granular, e.g., with distinct handlers for different scalar value types, and possessing methods available by default in a more readable CamelCase form).

***This project is not yet functional!***

# Usage

Node:

```
var DJ = require('dj-json');
```

Browser:

```html
<script src="dj/index.js"></script>
```

# Naming

Unlike musicians who use [oboes](http://oboejs.com/) or [clarinets](https://github.com/dscape/clarinet/) to pipe their breaths of data (piecemeal) from an ongoing streaming source (someone's lungs), D.J.'s may create new works using another complete work as the source of their data (i.e., records). They may play an entire record from start to finish or scratch and selectively sample from such a solid complete source record which is akin to what *dj* does in starting with complete JavaScript or JSON objects as the data source.

# Todos

1. Complete existing code!
    1. Ensure works with Node
1. Allow JSONPath?
