import AS from '../src/controllers/AsyncSteps';
import AM from '../src/controllers/Modules';
import AE from '../src/controllers/Events';
import path from 'path';

describe('Проверка расширяемости', () => {
  it('true', (done) => {
    const asEvents = new AE();

    const asModule = new AM(asEvents);

    class AsyncSteps extends AS {
      constructor(steps, sync = true, _modules = asModule, _events = asEvents) {
        super(steps, sync, _modules, _events);
      }
    }

    const modules = AM.getModulesFromFolder(path.join(__dirname, 'modules-as'), 'main');
    asModule.addModules(modules);

    const as = new AsyncSteps([{
      prefix: 'main',
      module: 'test'
    }]);

    as.init()
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