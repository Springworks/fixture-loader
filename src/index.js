import { join } from 'path';
import { readFileSync } from 'fs';

const cache = Object.create(null);

export function create(...fixture_base_path) {
  const base_path = join(...fixture_base_path);

  return {
    getParsedJSON(fixture_path) {
      return JSON.parse(getCachedFileContents(base_path, fixture_path));
    },
    getString(fixture_path) {
      return getCachedFileContents(base_path, fixture_path);
    }
  };
}

function getCachedFileContents(base_path, fixture_path) {
  const file_path = join(base_path, fixture_path);
  if (file_path in cache) {
    return cache[file_path];
  }
  const contents = readFileSync(file_path, { encoding: 'utf8' });
  cache[file_path] = contents;
  return contents;
}
