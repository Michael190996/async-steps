import AsyncSteps from '../dist/AsyncSteps';

const steps = [{
  module: 'if',
  params: {
    condition: true,
    steps: [{
      module: 'vars',
      params: {
        init: {
          result: true
        }
      }
    }, {
      module: 'ifs',
      params: {
        conditions: [{
          condition: false,
          steps: []
        }, {
          condition: 'result == true',
          steps: [{
            module: 'vars',
            params: {
              init: {
                test: true
              }
            },
            result: 'test'
          }]
        }]
      }
    }]
  }
}];

const as = new AsyncSteps(steps);

as.events.on('startStep', (result, vars, ctx) => console.log(ctx.stepIndex, ctx.stepDepth));

as.init()
  .then(r => console.log(r.result === true))
  .catch(e => console.log(e));