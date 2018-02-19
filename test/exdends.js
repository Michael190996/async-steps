import AS from '../src/lib/AsyncSteps';
import AM from '../src/lib/Modules';
import AE from '../src/lib/Events';
import path from 'path';

describe('Проверка расширяемости', () => {
  it('extends', (done) => {
    const asEvents = new AE();
    const asModule = new AM();
    const MODULES = AM.getModulesFromFolder(path.join(__dirname, 'modules-as'));

    asModule.addModules(MODULES, 'main');

    class AsyncSteps extends AS {
      constructor(steps, _modules = asModule, _events = asEvents) {
        super(steps, _modules, _events);
      }
    }

    // ------------------------------

    const as = new AsyncSteps([{
      prefix: 'main',
      module: 'test'
    }, {
      module: 'main/test',
      timeout: 1500,
      params: {
        get test() {
          return true;
        }
      },

      after: (params, data, vars, ctx) => params.test
    }]);

    as.events.on('startStep', (result, vars, ctx) => {
     const SCHEME = ctx.showStepScheme().split(' -> ');
     console.log(ctx.step, SCHEME);
    });

    const $basic = AsyncSteps.getNewBasic();

    const GLOBALVARS = {
      $BASIC: $basic
    };

    as.init(GLOBALVARS/*, data */).then((response) => {
      if (response.result) {
        done();
      } else {
        done('is not "true"');
      }
    }).catch(err => done(err));
  });
});
