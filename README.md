[![NPM Version](https://img.shields.io/npm/v/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![NPM Downloads](https://img.shields.io/npm/dm/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![Node.js Version](https://img.shields.io/node/v/async-steps.svg?style=flat)](http://nodejs.org/download/)
  [![stable](https://img.shields.io/badge/stablity-beta-green.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![NPM](https://nodei.co/npm/async-steps.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/async-steps)

# Async-steps (0.7.5) **BETA**
## Что это?
**Async-steps** - node.js библиотека для написания последовательных блоков инструкций.
- Система написана на базе [async-step.engine](https://github.com/michael190996/async-steps.engine)
* [Для чего](#Для-чего)
* [Похожие проекты](#Похожие-проекты)
* [Фичи и особенности](#Фичи-и-особенности)
* [Установка](#Установка)
* [Инструкция по использованию](#Инструкция-по-использованию)
  - [Расширяемость](#Расширяемость)
  - [Вызов модулей](#Вызов-модулей)
* [Примеры](#Примеры)
  - [Все в одном](#Все-в-одном)
* [Раздел asyncsteps в package.json](#Раздел-asyncsteps-в-packagejson)
* [Middleware](#middleware)
* [API](#api)
  - [asyncSteps](asyncsteps)
  - [Контроллеры](#classes-controllers)
    - [AsyncStepsEngine](#asyncstepsengine)
    - [Namespace](#namespace)
    - [Events](#events)
    - [Modular](#modular)
    - [Vars](#vars)
  - [Параметры](#params)
    - [steps](#steps)
    - [step](#step)
## Для чего?
Для различных систем мониторинга, парсинга или сборок.
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
#### Расширяемость
Добавить модули можно в разделе asyncsteps файла package.json
```json
"asyncsteps": {
   "pathsToModules": [{
      "prefix": "default",
      "homeDir": false,
      "path": "async-steps.modules-as"
   }]
}
```
Импортируется деволтный массив объектов
```js
export default [{
   name: имя модуля,
   fn: функция модуля
}]
```

#### Вызов модулей
```javascript
import asyncSteps from 'async-steps';

const steps = [{
  module: 'test'
}];

const as = asyncSteps(steps, /* configAsyncSteps */);
as.run()
	.then(response => console.info(response))
	.catch(err => console.error(err))
```
## Примеры
#### Все в одном
```javascript
import asyncSteps from 'async-steps';

const as = asyncSteps([{
  module: 'test'
}]);

as.modular.add('test', (params, data, ns) => {
  console.log(params, data, ns);
});

as.events.on('initSteps', (data, parentsNS) => {
  console.log(data, parentsNS);
});

as.run('data')
	.then(response => console.info(response))
	.catch(err => console.error(err))
```

## Раздел asyncsteps в package.json
* asyncsteps
  - {object[]} [pathsToModules]
    - {string} path - имя модуля или путь к директории с модулями
    - {boolean} [homeDir] - берет модуль с библиотеки, либо с текущей директории
    - {string} [prefix] - добавляет префикс к именам модулей

## Middleware
* Схема промежуточных функций ((см))[https://github.com/Michael190996/async-steps.engine#middleware].
  - dataGet - добавляет данные с определенного шага
  - timeout - задержка
  - module - запускает указанный модуль
  - after - функция, срабатывающая после завершения модуля
  - dataSet - сохраняет результат

## API
## asyncSteps
Функция, возвращающая экземпляр класса [AsyncStepsEngine](#asyncstepsengine)
- import asyncSteps from 'async-steps'
asyncSteps(steps, configAsyncSteps)
  - [steps](#steps)
  - [configAsyncSteps](#Раздел-asyncsteps-в-packagejson)
### Classes-controllers
#### AsyncStepsEngine
Расширенный [AsyncStepsEngine](https://github.com/michael190996/async-steps.engine#events)
- import AsyncStepsEngine from 'async-steps/dist/lib/AsyncStepsEngine'
* AsyncStepsEngine(steps[, vars][, modular][, middleware][, events])
  - [steps](#steps)
  - [[vars] - экземпляр класса Vars](#vars)
  - [[modular] - экземпляр класса Modular](#modular)
  - [[middleware] - экземпляр класса Middleware](#middleware)
  - [[events] - экземпляр класса Events](#events)

  * .[events - экземпляр класса Events](#events)

  * .[middleware - экземпляр класса Middleware](#middleware)

  * .[modular - экземпляр класса Modular](#modular)

  * .[vars - экземпляр класса Vars](#vars)

#### Namespace
Класс контекста, расширенный [Namespace](https://github.com/michael190996/async-steps.engine#namespace)
- import Namespace from 'async-steps/dist/lib/Namespace'
* Namespace(stepIndex, steps, parentsNamespace, modular, middleware, vars, events)
  - stepIndex - индекс текущей позиции шага в steps
  - [steps](#steps)
  - {Array.<[Namespace](#namespace)>} parentsNamespace
  - [[modular] - экземпляр класса Modular](#modular)
  - [[events] - экземпляр класса Events](#events)
  - [[middleware] - экземпляр класса Middleware](#middleware)
  - [[vars] - экземпляр класса Vars](#vars)

  * .[modular - экземпляр класса Modular](#modular)

  * .[vars - экземпляр класса Vars](#vars)

#### Events
Класс событий, расширенный [Events](https://github.com/michael190996/async-steps.engine#events)
- import Events from 'async-steps/dist/lib/Events'
* Events()
  * .startWare(nameWare, data, namespace) {
      - {string} nameWare
      - {*} data
      - [namespace - экземпляр класса Namespace](#namespace)
    * .on('startWare', function(data, namespace))

  * .endWare(nameWare, data, namespace)
      - {string} nameWare
      - {*} data
      - [namespace - экземпляр класса Namespace](#namespace)
    * .on('endWare', function(data, namespace))
    
#### Modular
Класс, управляющий модулями
* Modular()
  * .modules - Возвращает модули

  * .add(name, fn[, prefix])
    - {string} name - уникальное имя модуля
    - {function} fn
      - function([params][, data], namespace)
        - {object} [params] - параметры соответствующего модуля
        - {*} [data] - данные
        - [namespace - экземпляр класса Namespace](#namespace)

    - {string} [prefix] - префикс модуля

  * .check(name[, prefix])
    - {string} name - имя модуля
    - {string} [prefix] - префикс модуля

  * .start(name[, prefix], params[, data], namespace)
    - {string} name - имя модуля
    - {string} [prefix] - префикс модуля
    - {object} params - параметры модуля
    - {*} [data] - данные
    - [namespace - экземпляр класса Namespace](#namespace)

#### Vars
Класс переменных
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
- {object[[step](#step)]} steps
    
##### step
- {object} step ((см))[https://github.com/Michael190996/async-steps.engine#step].
  - {string} module - вызывает модуль
  - {string} [name=default] - имя шага
  - {string} [prefix=default] - префикс модуля
  - {number} [timeout] - задержка перед модулем
  - {string} [data] - данные соответствующего шага
  - {boolean} [sync=false] - синхронность шага
  - {function} [after] - функция, срабатывающая после модуля
    - function after(data, namespace)
      - {*} data
      - [namespace - экземпляр класса Namespace](#namespace)
    - результат функции при истинном значении записывается в data
  - {function} [throwError] - функция, обрабатывающая исключения
    - function throwError(error, namespace)
      - {Error} error
      - [namespace - экземпляр класса Namespace](#namespace)
    - результат функции при истинном значении записывается в data