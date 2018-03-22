import {Middleware} from 'async-steps.engine';
import Namespace from '../dist/lib/Namespace';
import Modular from '../dist/lib/Modular';
import Vars from '../dist/lib/Vars';
import Events from '../dist/lib/Events';
import after from '../dist/middlewares/after';
import assert from 'assert';

function deferred() {
  const deferred = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}

describe('Проверка класса asyncSteps', () => {
  it('extends', (done) => {
    const INDEXSTEP = 0;
    const PARENTSNS = [];
    const STEPS = [{
      after() {
        return true;
      }
    }];

    const ns = new Namespace(INDEXSTEP, STEPS, PARENTSNS, new Modular(), new Middleware(), new Vars(), new Events());

    const DEFERRED = deferred();
    const next = data => DEFERRED.resolve(data);

    try {
      after('', ns, next);
    } catch (err) {
      DEFERRED.reject(err);
    }
    
    DEFERRED.promise
      .then(() => done())
      .catch(err => done(err))
  });
});