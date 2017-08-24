import { join } from 'path';
import { readFileSync } from 'fs';
import { parseString as parseXMLString } from 'xml2js';
import assert from 'assert';
import { merge } from 'lodash';

const cache = Object.create(null);

export class MissingFixtureError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MissingFixtureError';
  }
}

export function create(...fixture_base_path) {
  const base_path = join(...fixture_base_path);
  let shadow_cache = {};

  const getNextShadowedFixture = (fixture_path, file_basename) => {
    const json_filename = `${file_basename}.json`;
    const file_path = join(base_path, fixture_path, json_filename);
    if (shadow_cache[file_path] && shadow_cache[file_path].length > 0) {
      return shadow_cache[file_path].shift();
    }
    return undefined;
  };

  return {
    shadowPropertiesForJsonFixture(fixture_path, file_basename, fixtures) {
      assert(file_basename, 'file_basename must be provided to fixture-loader');
      assert(fixture_path, 'fixture_path must be provided to fixture-loader');
      assert(fixtures, 'fixtures must be provided');
      assert(Array.isArray(fixtures), 'fixtures must be an array');

      const json_filename = `${file_basename}.json`;
      const file_path = join(base_path, fixture_path, json_filename);
      shadow_cache[file_path] = fixtures;
    },
    clearShadowedProperties() {
      shadow_cache = {};
    },
    loadParsedJson(fixture_path, file_basename) {
      assert(file_basename, 'file_basename must be provided to fixture-loader');
      assert(fixture_path, 'fixture_path must be provided to fixture-loader');
      const json_filename = `${file_basename}.json`;
      const file_contents = getCachedFileContents(base_path, fixture_path, json_filename);
      const original_json = file_contents && JSON.parse(file_contents);
      const shadowed_obj = getNextShadowedFixture(fixture_path, file_basename);
      return merge(original_json, shadowed_obj);
    },
    loadString(fixture_path, filename) {
      return getCachedFileContents(base_path, fixture_path, filename);
    },

    loadParsedXml(fixture_path, file_basename, callback) {
      assert(file_basename, 'file_basename must be provided to fixture-loader');
      assert(callback, 'Callback must be provided');

      const xml_filename = `${file_basename}.xml`;
      const file_contents = getCachedFileContents(base_path, fixture_path, xml_filename);
      return parseXMLString(file_contents, callback);
    },
  };
}

function getCachedFileContents(base_path, fixture_path, filename) {
  assert(base_path, 'base_path must be provided to fixture-loader');
  assert(fixture_path, 'fixture_path must be provided to fixture-loader');
  assert(filename, 'filename must be provided to fixture-loader');

  const file_path = join(base_path, fixture_path, filename);
  if (file_path in cache) {
    return cache[file_path];
  }
  try {
    const contents = readFileSync(file_path, { encoding: 'utf8' });
    cache[file_path] = contents;
    return contents;
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      throw new MissingFixtureError(`Could not load ${file_path}`);
    }
    throw err;
  }
}
