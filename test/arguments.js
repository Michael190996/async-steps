import AsyncSteps from '../src';

describe('Проверка параметров', () => {
  it('params && ctx.step.params', (done) => {
    const steps = [{
      module: 'test',
      get params() {
        return {
          test: true
        }
      },

      after({test}, data, vars, ctx) {
        if (test && ctx.step.params) {
          return done();
        }

        done('"test" of undefined');
      }
    }];

    const as = new AsyncSteps(steps);

    const VARS = {
      $BASIC: AsyncSteps.getNewBasic()
    };

    as.init(VARS, "data");
  });
});

describe('Проверка параметров', () => {
  it('params && !ctx.step.params', (done) => {
    const steps = [{
      module: 'test',

      after(params, data, vars, ctx) {
        if (params && ctx.step.params === undefined) {
          return done();
        }

        done('"params" of undefined');
      }
    }];

    const as = new AsyncSteps(steps);

    const VARS = {
      $BASIC: AsyncSteps.getNewBasic()
    };

    as.init(VARS, "data");
  });
});
