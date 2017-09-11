import AsyncSteps from '../AsyncSteps';

const vars = {
  i: 5
};

const steps = [{
  module: 'set:components',
  params: {
    components: [{
      name: 'c',
      steps: [{
        timeout: 3000,
        module: 'for',
        params: {
          condition: '1',
          steps: [{
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
        },
        result: true
      }]
    }, {
        name: 'ced',
        steps: [{
          module: 'if',
          params: {
            condition: false
          },
          result: false
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

as.events.on('startStep', (a,v,ctx) => {
  console.log(ctx.stepDepth, ctx.stepIndex);
});

as.events.on('error', (a) => {
  console.log(a);
});

as.init(vars, 'thr').then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
})
