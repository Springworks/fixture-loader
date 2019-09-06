const assert = require('assert');
const { create } = require('.');

describe('re-export', () => {

  it('should re-export the create function from @springworks/fixture-loader', () => {
    const loader = create('.');
    assert(typeof loader.loadParsedJson === 'function', 'Expected loadParsedJson to be a function.');
    assert(typeof loader.loadString === 'function', 'Expected loadString to be a function.');
  });

});
