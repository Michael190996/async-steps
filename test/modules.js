import AsyncSteps from '../src';

describe('Проверка внешних модулей', () => {
  it('modules', (done) => {
    const steps = [{
      module: 'test',
      timeout: 1000,
      sync: true
    }, {
      module: 'test',
      prefix: 'prefix',
      timeout: 100,
      sync: true
    }, {
      module: 'test',
      prefix: 'main'
    }];

    const as = new AsyncSteps(steps);

    as.init()
      .then(() => done())
      .catch(err => done(err));
  });
});
