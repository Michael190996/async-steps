import AsyncSteps from '../AsyncSteps';

const vars = {
  i: 5
};

const steps = [{
  module: 'for',
  params: {
    condition: '5',
    steps: [{
      module: 'for',
      params: {
        condition: '2',
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
  module: 'vars',
  params: {
    vars: [{
      text: 'text + i'
    }]
  }
}];

const as = new AsyncSteps(steps);


as.init(vars).then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
}).catch(err => console.log(err));