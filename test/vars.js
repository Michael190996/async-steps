import AsyncSteps from '../src/components/AsyncSteps';

describe('Проверка модуля vars', () => {
  it('object', (done) => {
    const steps = [{
      module: 'vars',
      params: {
        init: {
          test: true
        }
      }
    }];

    const as = new AsyncSteps(steps);

    as.init()
      .then((response) => {
        if (response.vars.test   === true) {
          done();
        } else {
          done('Result is not true');
        }
      }).catch(err => done(err));
  });

  it('array', (done) => {
    const steps = [{
      module: 'vars',
      params: {
        init: [{
          test: true
        }]
      }
    }];

    const as = new AsyncSteps(steps);

    as.init()
      .then((response) => {
        if (response.vars.test === true) {
          done();
        } else {
          done('Result is not true');
        }
      }).catch(err => done(err));
  });
});