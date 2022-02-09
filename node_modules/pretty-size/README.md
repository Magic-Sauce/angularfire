[![Build Status](https://travis-ci.org/abdennour/pretty-size.svg?branch=master)](https://travis-ci.org/abdennour/pretty-size)
[![Coverage Status](https://coveralls.io/repos/github/abdennour/pretty-size/badge.svg?branch=master)](https://coveralls.io/github/abdennour/pretty-size?branch=master)

# Overview :

Display human readable file size .


# Install

```bash
npm install pretty-size --save;
```

# Example :

```js
const {prettySize} = require('pretty-size');
// import {prettySize} from 'pretty-size'; // ES6/ES7

prettySize(454434343)
  //'433.4 MiB'
prettySize(454434343,true)
  //'454.4 MB'
prettySize(134343,true)
  //'134.3 kB'
prettySize(1024*1024)
  //'1.0 MiB'
prettySize(1024*1024*1024*1024,true)
  //'1.1 TB'
prettySize(1024*1024*1024*1024,false)

```

# License:

MIT .
