import { join } from 'path';
import { readFileSync } from 'fs';
import { parseString as parseXMLString } from 'xml2js';
import assert from 'assert';

const cache = Object.create(null);

export function create(...fixture_base_path) {
  const base_path = join(...fixture_base_path);

  return {
    getParsedJSON(fixture_path, file_basename) {
      const json_filename = `${file_basename}.json`;
      return JSON.parse(getCachedFileContents(base_path, fixture_path, json_filename));
    },

    getString(fixture_path, filename) {
      return getCachedFileContents(base_path, fixture_path, filename);
    },

    getParsedXML(fixture_path, file_basename, callback) {
      assert(callback, 'Callback must be provided');
      const xml_filename = `${file_basename}.xml`;
      const file_contents = getCachedFileContents(base_path, fixture_path, xml_filename);
      return parseXMLString(file_contents, callback);
    }
  };
}

function getCachedFileContents(base_path, fixture_path, filename) {
  const file_path = join(base_path, fixture_path, filename);
  if (file_path in cache) {
    return cache[file_path];
  }
  const contents = readFileSync(file_path, { encoding: 'utf8' });
  cache[file_path] = contents;
  return contents;
}
