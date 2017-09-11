import AsyncSteps from '../src/AsyncSteps';

describe('Проверка модулей компонентов', () => {
  it('set:component/call:component', (done) => {
    const steps = [{
      module: 'set:component',
      params: {
        name: 'test',
        steps: [{
          module: 'vars',
          params: {
            init: {
              test: 1
            }
          }
        }]
      }
    }, {
      module: 'call:component',
      params: {
        name: 'test'
      },
      result: '${test+1}'
    }];

    const as = new AsyncSteps(steps);

    as.init()
      .then((response) => {
        if (response.result === 2) {
          done();
        } else {
          done('Result is not true');
        }
      }).catch(err => done(err));
  });

  it('set:components/call:components', (done) => {
    const steps = [{
      module: 'set:components',
      params: {
        components: [{
          name: 'test',
          steps: [{
            module: 'vars',
            params: {
              init: {
                test: 1
              }
            }
          }]
        }, {
          name: 'test2',
          steps: [{
            module: 'vars',
            params: {
              init: {
                test: '${test+1}'
              }
            }
          }]
        }]
      }
    }, {
      module: 'call:components',
      params: {
        names: ['test', 'test2']
      },
      result: '${test+1}'
    }];

    const as = new AsyncSteps(steps);

    as.init()
      .then((response) => {
        if (response.result === 3) {
          done();
        } else {
          done('Result is not true');
        }
      }).catch(err => done(err));
  });
});