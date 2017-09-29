import AS from '../src/controllers/AsyncSteps';
import AM from '../src/controllers/Modules';
import AE from '../src/controllers/Events';
import path from 'path';

describe('Проверка расширяемости', () => {
  it('true', (done) => {
    const asEvents = new AE();

    const asModule = new AM(asEvents);

    class AsyncSteps extends AS {
      constructor(steps, _modules = asModule, _events = asEvents) {
        super(steps, _modules, _events);
      }
    }

    const MODULES = AM.getModulesFromFolder(path.join(__dirname, 'modules-as'), 'main');
    asModule.addModules(MODULES);

    const as = new AsyncSteps([{
      prefix: 'main',
      module: 'test'
    }, {
      module: 'main/test',
   //   sync: true,
      timeout: 1500,
      params: {
        test: '${i}'
      }
    }]);

    const $basic = as.getNewBasic();
    $basic.setting.lodash = true;

    as.init({$BASIC: $basic, i: 5})
      .then((response) => {
        if (response.result === true) {
          done();
        } else {
          done('is not "true"');
        }
      })
      .catch(err => done(err));
  });
});