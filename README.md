[![NPM Version](https://img.shields.io/npm/v/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![NPM Downloads](https://img.shields.io/npm/dm/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![Node.js Version](https://img.shields.io/node/v/async-steps.svg?style=flat)](http://nodejs.org/download/)
  [![stable](https://img.shields.io/badge/stablity-beta-green.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![NPM](https://nodei.co/npm/async-steps.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/async-steps)

# Async-steps (0.7.0) **BETA**
## Что это?
**Async-steps** - node.js библиотека для написания последовательных модулей (блоков инструкций) в простом и понятном виде.
* [Для чего](#Для-чего)
* [Похожие проекты](#Похожие-проекты)
* [Фичи и особенности](#Фичи-и-особенности)
* [Установка](#Установка)
* [Инструкция по использованию](#Инструкция-по-использованию)
  - [Добавление модуля](#Добавление-модуля)
  - [Вызов модулей](#Вызов-модулей)
* [Примеры](#Примеры)
  - [Все в одном](#Все-в-одном)
  - [Вызов классов-контроллеров](#Вызов-классов-контроллеров)
* [Расширяемость из библиотек](#Расширяемость-из-библиотек)
* [Раздел asyncsteps в package.json](#Раздел-asyncsteps-в-packagejson)
* [API](#api)
  - [Classes-controllers](#classes-controllers)
    - [AS](#as)
    - [Events](#events)
    - [Modular](#modular)
    - [Middleware](#middleware)
    - [Vars](#vars)
    - [AsyncSteps](#asyncsteps)
  - [Params](#params)
    - [steps](#steps)
    - [step](#step)
    - [moduleFunction](#modulefunction)
## Для чего?
Для различных систем мониторинга, парсинга или сборок, где нужно последовательно выполнять ту или иную функцию.
## Похожие проекты
 - **Grunt/gulp**
 - **Puppet**
 - **Ansible**
## Фичи и особенности
- **Расширяемость** - Модули изолированы от внешних фунций, что позволяет удобно расширять и дополнять систему.
- **Гибкость в ассинхронности/синхронности** - Все модули могут вызываться как последовательно, так и синхронно, простым флагом sync.
## Установка
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
## Инструкция по использованию 
#### Добавление модуля
Добавить модули можно как в разделе asyncsteps файла package.json 
```json
"asyncsteps": {
   "pathsToModules": [{
      "prefix": "default",
      "homeDir": false,
      "path": "async-steps.modules-as"
   }]
}
```
так и через экземпляр класса Modular
```javascript
import AsyncSteps from 'async-steps';

const module = function test() {
  return true;
};

AsyncSteps.modular.add(module.name, module, /* prefix */);
```
#### Вызов модулей
```javascript
import AsyncSteps from 'async-steps';

const steps = [{
  module: 'test'
}];

const as = new AsyncSteps(steps);
as.run()
	.then(response => console.info(response))
	.catch(err => console.error(err))
```
## Примеры
#### Все в одном
```javascript
import AsyncSteps from 'async-steps';

const asyncSteps = new AsyncSteps([{
  module: 'test'
}]);

asyncSteps.modular.add('test', (params, data, as) => {
  console.log(params, data, as);
});

asyncSteps.events.on('initSteps', (result, vars, as) => {
  console.log(result, vars, as);
});

asyncSteps.run('data')
	.then(response => console.info(response))
	.catch(err => console.error(err))
```
#### Вызов классов-контроллеров
```javascript
import {AsyncSteps, Modular, Events, Middleware, Vars} from 'async-steps';

const middleware = new Middleware();
const events = new Events();
const modular = new Modular();
const vars = new Vars();

modular.add('test', (params, data, as) => {
  console.log(params, data, as);
});

middleware.use(async(data, as, next) => {
  const MODULENAME = as.step.module;
  const MODULEPREFIX = as.step.prefix !== undefined ? as.step.prefix : 'default';
  const PARAMS = Object.assign({}, as.step.params);

  data = await as.modular.start(MODULENAME, MODULEPREFIX, data, as);
  next(data);
});

vars.add('globalVars', {
  vars_i: true
});

const steps = [{
  module: 'test'
}];

const asyncSteps = new AsyncSteps(steps, modular, middleware, vars, events);
asyncSteps.run('data')
	.then(response => console.info(response))
	.catch(err => console.error(err))
````
## Расширяемость из библиотек
- [см. https://github.com/Michael190996/async-steps.modules-as](https://github.com/Michael190996/async-steps.modules-as)
## Раздел asyncsteps в package.json 
* asyncsteps
  - {object[]} [pathsToModules]
    - {string} path - имя модуля или путь к директории с модулями
    - {boolean} [homeDir] - берет модуль с библиотеки, либо с текущей директории
    - {string} [prefix] - добавляет префикс к именам модулей
    
## API
### Classes-controllers
#### AsyncSteps
* AsyncSteps(steps[, vars][, modular][, events][, middleware])
  - [steps](#steps)
  - [[vars] - экземпляр класса Vars](#vars)
  - [[modular] - экземпляр класса Modular](#modular)
  - [[events] - экземпляр класса Events](#events)
  - [[middleware] - экземпляр класса Middleware](#middleware)

  * .[modular - ссылка на экземпляр класса Modular](#modular)

  * .[events - ссылка на экземпляр класса Events](#events)

  * .[middleware - ссылка на экземпляр класса Middleware](#middleware)

  * .[vars - ссылка на экземпляр класса Vars](#vars)

  * .setParentsAS(parentsAS)
    - {Array.<AS>} parentsAS

  * startStep(data, as)
    - [data] - данные
    - [as - экземпляр класса AS](#as)

  * .run([data])
    - {*} [data] - данные

#### AS
* AS(stepIndex, steps, parentsAS, modular, events, vars, middleware)
  - stepIndex - индекс текущей позиции шага в steps
  - [steps](#steps)
  - {Array.<AS>} parentsAS
  - [[modular] - экземпляр класса Modular](#modular)
  - [[events] - экземпляр класса Events](#events)
  - [[vars] - экземпляр класса Vars](#vars)
  - [[middleware] - экземпляр класса Middleware](#middleware)

  * .name - имя текущего модуля

  * .step - [step](#step) - текущий шаг

  * .steps - [steps](#steps)

  * .[modular - ссылка на экземпляр класса Modular](#modular)

  * .[middleware - ссылка на экземпляр класса Middleware](#middleware)

  * .[events - ссылка на экземпляр класса Events](#events)

  * .[vars - ссылка на экземпляр класса Vars](#vars)

  * .parents - возвращает цепочку родителей - {Array.<[AS](#as)>}

  * .stepDepth - позиция глубины вложенности в [steps](#steps)

  * .stepIndex - индекс текущей позиции в [steps](#steps)

  * .getScheme() - возвращает схему вызовов

  * .setBreak($break)
    - {boolean} $break - Данный флаг означает, что на текущем шаге нужно прекратить итерацию по массиву steps

  * .setBreakAll($break)
    - {boolean} $break - Данный флаг означает, что на текущем шаге нужно прекратить итерацию по массиву steps, в том числе и у родителей

  * .getBreak() - возвращает булевое значение

  * .child(steps) - метод возвращает новый экземпляр класса [asyncSteps](#asyncsteps) со заданной позицией
    - [steps](#steps)
    
#### Events
Класс событий, расширенный от нативного класса [Events](https://nodejs.org/api/events.html#events_events)
* Events() 
  * .initSteps([data, ]parentsAS)
    - {*} [data]
    - {Array.<AS>} parentsAS
  * .on('initSteps', function(data, as))
  
  * .startStep([data, ]as)
    - {*} [data]
    - [as - экземпляр класса AS](#as)
  * .on('startStep', function(data, as))
  
  * .endSteps([data, ]parentsAS)
    - {*} [data]
    - {Array.<AS>} parentsAS
  * .on('end', function(data, as))
  
  * .endStep([data, ]as)
    - {*} [data]
    - as - [экземпляр класса AS](#as)
  * .on('endStep', function(data, as))
    
  * .error(error, as)
    - {Error} error - ошибка
    - as - [экземпляр класса AS](#as)
  * .on('error', function(error, as))
    
#### Modular
Класс, управляющий модулями
* Modular()
  * .modules - Возвращает модули

  * .add(name, fn[, prefix])
    - {string} name - уникальное имя модуля
    - {function} [fn](#modulefunction)
    - {string} [prefix] - префикс модуля

  * .check(name[, prefix])
    - {string} name - имя модуля
    - {string} [prefix] - префикс модуля

  * .start(name[, prefix][, ...argsModule])
    - {string} name - имя модуля
    - {string} [prefix] - префикс модуля
    - {...} [argsModule] - аргументы соответствующего модуля

#### middleware
Класс, управляющий промежуточными результатами
* Middleware()
  * .middlewares - Возвращает все middlewares

  * .use(fn)
    - {function} fn

  * .go(data[, ...args]) - Запускает поток
    - {*} data
    - {...} [args] - аргументы соответствующих middleware

#### Vars
* Vars()
  * .add(key, value)
    - {string} key
    - {*} value

  * .remove(key)
    - {string} key

  * .get(key)
    - {string} key

  * .check(key)
    - {string} key

### Params
##### steps
- {object[[step](#step)]} steps - последовательные модули
    
##### step
- {object} step
  - {string} [name] - имя шага
  - {string} module - модуль 
  - {string} [prefix] - префикс модуля
  - {boolean} [sync] - синхронность шага
  - {boolean} [initData] - данные при инициализации [steps](#steps)
  - {function} [throw] - функция, обрабатывающая исключения
    - function throw(error, as)
      - {Error} error
      - [as - экземпляр класса AS](#as)
    - результат функции при истинном значении записывается в data

##### moduleFunction
- function([params][, data], as)
  - {object} [params] - параметры соответствующего модуля
  - {*} [data] - данные
  - [vars - экземпляр класса Vars](#vars)
  - [as - экземпляр класса AS](#as)
