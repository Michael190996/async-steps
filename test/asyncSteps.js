import asyncSteps from '../dist/asyncSteps';

describe('Проверка класса asyncSteps', () => {
  it('extends', (done) => {
    const STEPS = [{
      module: 'test',
      prefix: 'prefix'
    }];

    const ase = asyncSteps(STEPS, {
      pathsToModules: [{
        prefix: "prefix",
        homeDir: true,
        path: "./test/modules-out"
      }]
    });

    ase.run()
      .then(() => done())
      .catch(err => done(err));
  });
});