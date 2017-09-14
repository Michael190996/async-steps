import AS from '../components/AsyncSteps';
import AM from '../components/Modules';
import AE from '../components/Events';
import asUtils from '../utils/utils';
import path from 'path';

export const asEvents = new AE();

export const asModule = new AM(asEvents, {
  alert() {
    console.log(true);
  }
});

export default class AsyncSteps extends AS {
  constructor(steps, sync = true, _modules = asModule, _events = asEvents) {
    super(steps, sync, _modules, _events);
  }
}

asModule.setModules(asUtils.getModulesFromFolder(path.join(__dirname, '..', 'as-modules')));

const as = new AsyncSteps([{
  module: 'alert',
  result: 'finish'
}]);

as.init()
  .then(response => console.info(response.result))
  .catch(err => console.error(err));