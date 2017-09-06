[![NPM Version](https://img.shields.io/npm/v/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![NPM Downloads](https://img.shields.io/npm/dm/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![Node.js Version](https://img.shields.io/node/v/async-steps.svg?style=flat)](http://nodejs.org/download/)
[![Build Status](https://travis-ci.org/futoin/core-js-ri-async-steps.svg)](https://travis-ci.org/futoin/core-js-ri-async-steps)
  [![stable](https://img.shields.io/badge/stablity-beta-green.svg?style=flat)](https://www.npmjs.com/package/futoin-asyncsteps)
[![NPM](https://nodei.co/npm/async-steps.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/async-steps/)

# Async-steps (0.0.12) **BETA**
## Что это?
**Async-steps** это node.js библиотека или метод написания последовательных модулей (блоков инструкций) в читабельном виде.
## Для чего?
Для различных систем мониторинга, парсинга или сборок, где есть нужно последовательно выполнять ту или иную функцию.
## Подобные проекты:
 - **Grunt/gulp**
 - **Puppet**
 - **Ansible**
## Фичи/особенности данной системы:
- **Расширяемость** - Модули изолированы от друг друга, что позволяет удобно расширять и дополнять модулями.
- **Потоки** - Модуль также может возвращать результат предыдущего.
- **Гибкость в ассинхронности/синхронности** - Все модули вызываюся как последовательно, так и беспорядочно.
## Установка:
- **Npm**:
```sh
npm install --save async-steps
```
- **Source git**:
```sh
git clone https://github.com/Michael190996/async-steps && \
cd async-steps && \
npm i && \
npm run build # npm run prepublish
```
## Примеры использования:
```javascript
import AsyncSteps from 'async-steps';

const module = async function test(params, beforeResult, vars, events) {
    return await {
      result: params.test
    };
};

AsyncSteps.modules.setModule(module.name, module);

const steps = [{
    module: 'test',
    timeout: 0,
    params: {
      test: 'Hello world!'
    }
}];

const as = new AsyncSteps(steps, true /*- sync*/);
as.init()
    .then(result => console.info(result))
    .catch(error => console.error(error));
```

### Создание модуля (рекомендация)
#### modules/test.js
```javascript
export default async function test(params, beforeResult, vars, events) {
    return await {
      result: params.test
    };
};
```
#### modules/index.js
```javascript
import test from './test';
export default {test};
```
#### steps.js
```javascript
export default [{
    module: 'test',
    timeout: 0,
    params: {
      test: 'Hello world!'
    }
}];
```
#### app.js
```javascript
import AsyncSteps from 'async-steps';
import modules from './modules/index.js';
import steps from './steps';

AsyncSteps.modules.setModules(modules);

const as = new AsyncSteps(steps, true /*- async*/);
as.init()
    .then(result => console.info(result))
    .catch(error => console.error(error));
```
