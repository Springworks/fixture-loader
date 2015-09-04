import { create as createFixtureLoader } from '../src';

describe('create', () => {

  describe('with a string path', () => {

    it('should return a fixture loader', () => {
      const loader = createFixtureLoader('.');
      loader.should.have.keys([
        'loadParsedJson',
        'loadString',
        'loadParsedXml'
      ]);
    });

  });

  describe('with multiple path components', () => {

    it('should return a fixture loader', () => {
      const loader = createFixtureLoader(__dirname, '..');
      loader.should.have.keys([
        'loadParsedJson',
        'loadString',
        'loadParsedXml'
      ]);
    });

  });

});

describe('loadParsedJson', () => {
  const loader = createFixtureLoader(__dirname, '..');

  describe('with a path to a JSON file', () => {

    it('should return the parsed JSON file', () => {
      const pkg = loader.loadParsedJson('.', 'package');
      pkg.should.be.an.Object();
      pkg.name.should.eql('fixture-loader');
    });

    it('should return a new object every time', () => {
      const a = loader.loadParsedJson('.', 'package');
      const b = loader.loadParsedJson('.', 'package');
      (a === b).should.be.false();
    });

  });
  describe('with a path to a file that does not exist', () => {

    it('should throw an error', () => {
      loader.loadParsedJson.bind(null, '.', 'does-not-exist').should.throw(/ENOENT/);
    });

  });

});

describe('loadString', () => {
  const loader = createFixtureLoader(__dirname, '..');

  describe('with a path to a file', () => {

    it('should return the string contents', () => {
      const pkg = loader.loadString('.', 'package.json');
      pkg.should.be.a.String();
      pkg.should.startWith('{');
    });

  });

  describe('with a path to a file that does not exist', () => {

    it('should throw an error', () => {
      loader.loadString.bind(null, '.', 'does-not-exist').should.throw();
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
            bar: ['bar']
          }
        });
      });
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
