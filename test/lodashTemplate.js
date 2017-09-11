import AsyncSteps from '../src/AsyncSteps';

describe('Проверка модуля lodash:template', () => {
  it('true', (done) => {
    const steps = [{
      module: 'lodash:template',
      params: {
        template: '<% if (test !== undefined) { %>true<% } %>'
      }
    }];

    const as = new AsyncSteps(steps);

    as.init({test: true})
      .then((response) => {
        if (response.result === true) {
          done();
        } else {
          done('Result is not true');
        }
      }).catch(err => done(err));
  });
});