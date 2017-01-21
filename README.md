[![Build Status](https://travis-ci.org/Springworks/node-fixture-loader.svg?branch=master)](https://travis-ci.org/Springworks/node-fixture-loader)

# fixture-loader

[![Greenkeeper badge](https://badges.greenkeeper.io/Springworks/node-fixture-loader.svg)](https://greenkeeper.io/)

Load fixture files from a specified dir.


## API


### `create(...fixture_base_path)`

Create a loader with the base path specified a joining `fixture_base_path`.
The `create` function returns an object with the methods listed below.

```js
import { create as createFixtureLoader } from 'fixture-loader';

const fixture_loader = createFixtureLoader(__dirname, 'path/to/fixtures');

const parsed_json = fixture_loader.loadParsedJson(...);
```


### `loadParsedJson(fixture_path, file_basename)`

Loads and parses a JSON file. Extension `.json` is appended to `file_basename`.
File loading is done synchronously.

```js
const base_path = '/dev/null';
const fixture_loader = loader.create(base_path);

// Loads file: /dev/null/path/relative/to/base_path/basename.json
const parsed_json = fixture_loader.loadParsedJson('/path/relative/to/base_path', 'basename');
```


### `loadString(fixture_path, filename)`

Loads a file and returns its string contents. File loading is done synchronously.

```js
const base_path = '/dev/null';
const fixture_loader = loader.create(base_path);

// Loads file: /dev/null/path/relative/to/base_path/file.xml
const parsed_json = fixture_loader.loadString('/path/relative/to/base_path', 'file.xml');
```


### `loadParsedXml(fixture_path, file_basename, callback)`

Loads and parses an XML file. Extension `.xml` is appended to `file_basename`. 
Requires a `callback` since XML parsing is done async (using [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)).

```js
const base_path = '/dev/null';
const fixture_loader = loader.create(base_path);

// Loads file: /dev/null/path/relative/to/base_path/basename.xml
const parsed_json = fixture_loader.loadParsedXml('/path/relative/to/base_path', 'basename', (err, parsed_xml) => {
  // parsed_xml is a javascript object
});
```
