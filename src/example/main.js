import {AsyncSteps, asEvents, asModules} from '../index';

const vars = {
  i: 5
};

const steps = [{
  module: 'set:components',
  after(p) {
    return 5556
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
  module: 'call:component',
  params: {
    name: 'ced',
  },
  result: '${$BASIC.currentResult} + '
}];

const as = new AsyncSteps(steps);

asEvents.on('startStep', (a,v,ctx) => {
  console.log(ctx.stepDepth, ctx.stepIndex);
});

asEvents.on('error', (a) => {
  console.log(a);
});

as.init(vars, 'thr').then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
});
