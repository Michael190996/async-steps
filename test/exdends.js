import AS from '../src/controllers/AsyncSteps';
import AM from '../src/controllers/Modules';
import AE from '../src/controllers/Events';
import path from 'path';

describe('Проверка расширяемости', () => {
  it('extends', (done) => {
    const asEvents = new AE();
    const asModule = new AM(asEvents);

    const MODULES = AM.getModulesFromFolder(path.join(__dirname, 'modules-as'), 'main');
    asModule.addModules(MODULES);

    class AsyncSteps extends AS {
      constructor(steps, _modules = asModule, _events = asEvents) {
        super(steps, _modules, _events);
      }
    }

    // ------------------------------

    const as = new AsyncSteps([{
      prefix: 'main',
      module: 'test',
    }, {
      module: 'main/test',
      timeout: 1500,
      mediumRes: 'socket',
      
      params: {
        test: '${i}'
      },

      after: (params, pipe, vars, ctx) => params.test
    }]);

    as.events.on('mediumRes', (name, result, vars, ctx) => {
      if (name === 'socket') {
        console.log(result, name, vars, ctx);
      } 
    });
    
    const $basic = AsyncSteps.getNewBasic();
    $basic.setting.lodash = true;

    const globalVars = {
      $BASIC: $basic,
      i: 5
    };

    as.init(globalVars/*, pipe */)
      .then((response) => {
        if (response.result === 5) {
          done();
        } else {
          done('is not "true"');
        }
      })
      .catch(err => done(err));
  });
});