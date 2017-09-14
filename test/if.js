import AsyncSteps from '../src/components/AsyncSteps';

describe('Проверка модуля if', () => {
  it('true', (done) => {
    const steps = [{
      module: 'if',
      params: {
        condition: true,
        steps: [{
          module: 'if',
          result: true,
          params: {
            condition: false
          }
        }]
      }
    }];

    const as = new AsyncSteps(steps);

    as.init()
      .then((response) => {
        if (response.result === true) {
          done();
        } else {
          done('Result is not true');
        }
      }).catch(err => done(err));
  });
});