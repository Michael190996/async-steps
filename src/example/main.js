import AsyncSteps from '../AsyncSteps';

const vars = {
  i: 5
};

const steps = [{
  module: 'for',
  timeout: 0,
  params: {
    condition: '1',
    steps: [{
      timeout: 0,
      module: 'for',
      params: {
        condition: '5',
        steps: [{
          module: 'if',
          params: {
            conditions: [
              {
                condition: 'true',
                steps: [{
                  module: 'vars',
                  params: {
                    vars: [{
                      i: 'i + i',

                    }, {
                      text: 'i'
                    }]
                  }
                }]
              }
            ]
          }
        }]
      }
    }]
  }
}, {
  module: 'for',
  params: {
    condition: '2',
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
    condition: '2',
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
    condition: '2',
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
    condition: '2',
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
    condition: '2',
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
}];

const as = new AsyncSteps(steps);

as.init(vars, 'thr').then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
}).catch(err => console.log('err'));
