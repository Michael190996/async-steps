import {AsyncSteps, asEvents, asModules} from '../src/index';

describe('Проверка 555', () => {
  it('true', (done) => {
    const steps = [{
      module: 'vars',
      params: {
        init: {
          i:'${typeof i !== "undefined" ? i+1 : 1}'
        }
      }
    },{
      module: 'setComponents',
      params: {
        components: [{
          name: 'c',
          steps: [{
            module: 'if',
            template: '#',
            params: {
              condition: true,
              steps: [{
                module: 'if',
                template: '#',
                params: {
                  condition: true,
                  steps: [{
                    module: 'if',
                    template: '#',
                    params: {
                      condition: false,
                      steps: undefined
                    }
                  }]
                }
              }, {
                module: 'if',
                template: '#',
                params: {
                  condition: true,
                  steps: [{
                    module: 'if',
                    template: '#',
                    params: {
                      condition: false,
                      steps: undefined
                    }
                  }]
                }
              }]
            }
          }]
        }]
      },
      after: () => 555
    }, {
      module: 'callComponent',
      params: {
        name: 'c',
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