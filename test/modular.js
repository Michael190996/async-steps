import assert from 'assert';
import Modular from '../dist/lib/Modular';

describe('Проверка класса Modular', () => {
  it('add:default', (done) => {
    const modular = new Modular();
    modular.add('test', () => true);

    done(assert.doesNotThrow(() => {
      return modular.modules.default.test();
    }));
  });

  it('add:prefix', (done) => {
    const modular = new Modular();
    modular.add('test', () => true, 'prefix');

    done(assert.doesNotThrow(() => {
      return modular.modules.prefix.test();
    }));
  });

  it('add:notFunction', (done) => {
    const modular = new Modular();

    done(assert.throws(() => {
      return modular.add('test', 'test');
    }));
  });

  it('add:duplicate:default', (done) => {
    const modular = new Modular();
    modular.add('test', () => true);

    done(assert.throws(() => {
      return modular.add('test', () => true);
    }));
  });

  it('add:duplicate:prefix', (done) => {
    const modular = new Modular();
    modular.add('test', () => true, 'prefix');

    done(assert.throws(() => {
      return modular.add('test', () => true, 'prefix');
    }));
  });

  it('check:default', (done) => {
    const modular = new Modular();
    modular.add('test', () => true);

    done(assert.ok(modular.check('test')))
  });

  it('check:prefix', (done) => {
    const modular = new Modular();
    modular.add('test', () => true, 'prefix');

    done(assert.ok(modular.check('test', 'prefix')))
  });

  it('start:default', (done) => {
    const modular = new Modular();
    modular.add('test', () => true);

    done(assert.ok(modular.start('test')));
  });

  it('start:prefix', (done) => {
    const modular = new Modular();
    modular.add('test', () => true, 'prefix');

    done(assert.ok(modular.start('test', 'prefix')));
  });

  it('start:default:args', (done) => {
    const modular = new Modular();
    modular.add('test', ({step}) => step);

    done(assert.ok(modular.start('test', undefined, {
      step: true
    })));
  });

  it('start:prefix:args', (done) => {
    const modular = new Modular();
    modular.add('test', ({step}) => step, 'prefix');

    done(assert.ok(modular.start('test', 'prefix', {
      step: true
    })));
  });
});