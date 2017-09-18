import {AsyncSteps, asEvents, asModules} from '../src/index';

describe('Проверка 555', () => {
  it('true', (done) => {
    const steps = [{
      module: 'setComponents',
      after() {
        return 555;
      },
      params: {
        components: [{
          name: 'c',
          steps: [{
            timeout: 3000,
            module: 'for',
            params: {
              condition: '1000',
              steps: [{
                module: 'for',
                params: {
                  condition: '0',
                  steps: [{
                    module: 'if',
                    before: () => {
                      console.log(true);
                    },
                    after: () => {

                    },
                    params: {
                      conditions: [
                        {
                          condition: false
                        }
                      ]
                    }
                  }]
                }
              }, {
                module: 'for',
                params: {
                  condition: '0',
                  steps: [{
                    module: 'if',
                    params: {
                      conditions: [
                        {
                          condition: false
                        }
                      ]
                    }
                  }]
                }
              }]
            }
          }]
        }, {
          name: 'ced',
          steps: [{
            module: 'if',
            params: {
              condition: false
            }
          }]
        }]
      }
    }, {
      module: 'callComponent',
      params: {
        name: 'ced',
      },
      result: '${$BASIC.currentResult}'
    }];

    const as = new AsyncSteps(steps);

    asEvents.on('startStep', (a, v, ctx) => {
      console.log(ctx.stepDepth, ctx.stepIndex);
    });

    asEvents.on('error', (a) => {
      console.log(a);
    });

    as.init()
      .then((response) => {
        if (response.result === 555) {
          done();
        } else {
          done('is not "555"');
        }
      })
      .catch(err => done(err));
  });
});