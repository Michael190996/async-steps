import AsyncSteps from '../src/components/AsyncSteps';

describe('Проверка модуля for', () => {
  it('4', (done) => {
    const steps = [{
      module: 'for',
      params: {
        condition: 4,
        steps: [{
          module: 'for',
          result: '${$BASIC.$for.index}',
          params: {
            condition: 0
          }
        }]
      }
    }];

    const as = new AsyncSteps(steps);

    as.init()
      .then((response) => {
        if (response.result === 4) {
          done();
        } else {
          done('Result is not true');
        }
      }).catch(err => done(err));
  });
});