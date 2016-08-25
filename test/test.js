import { create as createFixtureLoader } from '../src';

describe('test/test.js', () => {

  describe('with a string path', () => {

    it('should return a fixture loader', () => {
      const loader = createFixtureLoader('.');
      loader.should.have.keys(
        'loadParsedJson',
        'loadString',
        'loadParsedXml');
    });

  });

  describe('with multiple path components', () => {

    it('should return a fixture loader', () => {
      const loader = createFixtureLoader(__dirname, 'fixtures');
      loader.should.have.keys(
        'loadParsedJson',
        'loadString',
        'loadParsedXml');
    });

  });

});

describe('loadParsedJson', () => {
  const loader = createFixtureLoader(__dirname, 'fixtures');

  describe('with a path to a JSON file', () => {

    it('should return the parsed JSON file', () => {
      const json_file = loader.loadParsedJson('.', 'file');
      json_file.should.eql({
        foo: {
          bar: 'baz',
        },
      });
    });

    it('should return a new object every time', () => {
      const a = loader.loadParsedJson('.', 'file');
      const b = loader.loadParsedJson('.', 'file');
      (a === b).should.be.false();
    });

  });

  describe('with a path to a file that does not exist', () => {

    it('should throw an error', () => {
      loader.loadParsedJson.bind(null, '.', 'does-not-exist').should.throw(/ENOENT/);
    });

  });

  describe('omitting fixture_path', () => {

    it('should fail assertion', () => {
      loader.loadParsedJson.bind(null, null, 'basename').should.throw(/fixture_path must be provided to fixture-loader/);
    });

  });

  describe('omitting file_basename', () => {

    it('should fail assertion', () => {
      loader.loadParsedJson.bind(null, 'path').should.throw(/file_basename must be provided to fixture-loader/);
    });

  });

});

describe('loadString', () => {
  const loader = createFixtureLoader(__dirname, 'fixtures');

  describe('with a path to a file', () => {

    it('should return the string contents', () => {
      const pkg = loader.loadString('.', 'file.json');
      pkg.should.be.a.String();
      pkg.should.startWith('{');
    });

  });

  describe('with a path to a file that does not exist', () => {

    it('should throw an error', () => {
      loader.loadString.bind(null, '.', 'does-not-exist').should.throw();
    });

  });

  describe('omitting fixture_path', () => {

    it('should fail assertion', () => {
      loader.loadString.bind(null, null, 'filename').should.throw(/fixture_path must be provided to fixture-loader/);
    });

  });

  describe('omitting filename', () => {

    it('should fail assertion', () => {
      loader.loadString.bind(null, '/path/to/fixture', null).should.throw(/filename must be provided to fixture-loader/);
    });

  });

});

describe('loadParsedXml', () => {
  const loader = createFixtureLoader(__dirname, 'fixtures');

  describe('with path to an XML file and callback', () => {

    it('should callback with XML contents parsed to Javascript object', () => {
      loader.loadParsedXml('.', 'file', (err, xml_file) => {
        should.not.exist(err);
        xml_file.should.be.instanceOf(Object);
        xml_file.should.eql({
          foo: {
            bar: ['bar'],
          },
        });
      });
    });

  });

  describe('omitting fixture_path', () => {

    it('should fail assertion', () => {
      loader.loadParsedXml.bind(null, null, 'basename', () => {}).should.throw(/fixture_path must be provided to fixture-loader/);
    });

  });

  describe('omitting file_basename', () => {

    it('should fail assertion', () => {
      loader.loadParsedXml.bind(null, 'path', null, () => {}).should.throw(/file_basename must be provided to fixture-loader/);
    });

  });

  describe('omitting callback', () => {

    it('should fail assertion', () => {
      (function() {
        loader.loadParsedXml('.', 'file');
      }).should.throw('Callback must be provided');
    });

  });

});
