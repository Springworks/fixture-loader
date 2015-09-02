import { create as createFixtureLoader } from '../src';

describe('create', () => {

  describe('with a string path', () => {

    it('should return a fixture loader', () => {
      const fl = createFixtureLoader('.');
      fl.should.have.keys([
        'getParsedJSON',
        'getString'
      ]);
    });

  });

  describe('with multiple path components', () => {

    it('should return a fixture loader', () => {
      const fl = createFixtureLoader(__dirname, '..');
      fl.should.have.keys([
        'getParsedJSON',
        'getString'
      ]);
    });

  });

});

describe('getParsedJSON', () => {
  const fl = createFixtureLoader(__dirname, '..');

  describe('with a path to a JSON file', () => {

    it('should return the parsed JSON file', () => {
      const pkg = fl.getParsedJSON('.', 'package');
      pkg.should.be.an.Object();
      pkg.name.should.eql('fixture-loader');
    });

    it('should return a new object every time', () => {
      const a = fl.getParsedJSON('.', 'package');
      const b = fl.getParsedJSON('.', 'package');
      (a === b).should.be.false();
    });

  });
  describe('with a path to a file that does not exist', () => {

    it('should throw an error', () => {
      fl.getParsedJSON.bind(null, '.', 'does-not-exist').should.throw(/ENOENT/);
    });

  });

});

describe('getString', () => {
  const fl = createFixtureLoader(__dirname, '..');

  describe('with a path to a file', () => {

    it('should return the string contents', () => {
      const pkg = fl.getString('.', 'package.json');
      pkg.should.be.a.String();
      pkg.should.startWith('{');
    });

  });

  describe('with a path to a file that does not exist', () => {

    it('should throw an error', () => {
      fl.getString.bind(null, '.', 'does-not-exist').should.throw();
    });

  });

});
