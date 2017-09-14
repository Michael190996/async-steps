import AsyncSteps from '../src/components/AsyncSteps';

describe('Проверка модуля ifs', () => {
  it('2', (done) => {
    const steps = [{
      module: 'ifs',
      params: {
        conditions: [{
          condition: true,
          steps: [{
            module: 'ifs',
            params: {
              conditions: [{
                condition: false
              }],
            },
            result: 1
          }]
        }, {
          condition: true,
          steps: [{
            module: 'ifs',
            params: {
              conditions: [{
                condition: false
              }],
            },
            result: '${$BASIC.beforeResult+$BASIC.currentResult}'
          }]
        }]
      }
    }];

    const as = new AsyncSteps(steps);

    as.init()
      .then((response) => {
        if (response.result === 2) {
          done();
        } else {
          done('Result is not 2');
        }
      }).catch(err => done(err));
  });
});