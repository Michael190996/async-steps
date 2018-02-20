[![NPM Version](https://img.shields.io/npm/v/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![NPM Downloads](https://img.shields.io/npm/dm/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![Node.js Version](https://img.shields.io/node/v/async-steps.svg?style=flat)](http://nodejs.org/download/)
[![Build Status](https://travis-ci.org/futoin/core-js-ri-async-steps.svg)](https://travis-ci.org/futoin/core-js-ri-async-steps)
  [![stable](https://img.shields.io/badge/stablity-beta-green.svg?style=flat)](https://www.npmjs.com/package/futoin-asyncsteps)
[![NPM](https://nodei.co/npm/async-steps.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/async-steps/)

# Async-steps (0.6.0) **BETA**
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
    - [Ctx](#ctx)
    - [Events](#events)
    - [Modules](#modules)
    - [AsyncSteps](#asyncsteps)
  - [Params](#params)
    - [steps](#steps)
    - [step](#step)
    - [vars](#vars)
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
      "path": "async-steps.modules-as"
   }]
}
```
так и через экземпляр класса Modules
```javascript
import AsyncSteps from 'async-steps';

const module = function test(params, data, vars, events) {
    return {
      result: params.test
    };
};

const modules = {
  test2: async function(params, data, vars, events) {
    return await {
      result: params.test
    };
  }
}

AsyncSteps.modules.addModule(module.name, module); // один
AsyncSteps.modules.addModules(modules); // несколько
```
#### Вызов модулей
```javascript
import AsyncSteps from 'async-steps';

const steps = [{
  module: 'test'
}];

const as = new AsyncSteps(steps);
as.init()
	.then(response => console.info(response))
	.catch(err => console.error(err))
```
## Примеры
#### Все в одном
```javascript
import {asModules, AsyncSteps, asEvents} from 'async-steps';

asModules.addModule('test', (params, data, vars, ctx) => {
  console.log(params, data, vars, ctx);
});

asEvents.on('initSteps', (result, vars, ctx) => {
  console.log(result, vars, ctx);
});

const as = new AsyncSteps([{
  module: 'test'
}]);

const globalVars = {
  var_i: true
}

as.init(globalVars, 'data')
	.then(response => console.info(response))
	.catch(err => console.error(err))
```
#### Вызов классов-контроллеров
```javascript
import AsyncSteps from '../dist/lib/AsyncSteps';
import AsModules from '../dist/lib/Modules';
import AsEvents from '../dist/lib/Events';

const asEvents = new AsEvents();
const asModules = new AsModules();

asModules.addModule('test', (params, data, vars, ctx) => {
  console.log(params, data, vars, ctx);
});

const globalVars = {
  vars_i: true
};

const steps = [{
  module: 'test'
}]

const as = new AsyncSteps(steps, asModules, asEvents);
as.init(globalVars, 'data')
	.then(response => console.info(response))
	.catch(err => console.error(err))
````
## Расширяемость из библиотек
- [см. https://github.com/Michael190996/async-steps.modules-as](https://github.com/Michael190996/async-steps.modules-as)
## Раздел asyncsteps в package.json 
* asyncsteps
  - {object[]} [pathsToModules]
    - {string} [prefix] - добавляет префикс к названиям модулей `${prefix}/${moduleName}`
    - {boolean} [homeDir] - берет модуль либо с библиотеки, либо с текущей директории
    - {string} path - имя модуля или путь к директории с модулями
  - {object} [importsModules]
    - {name: path} - имя и путь к модулю
## API
### Classes-controllers
* Классы-контроллеры в директории dist/lib/*
#### Ctx
  * Ctx(moduleName, step[, modules][, events])
  - moduleName - имя текущего модуля
  - [step](#step)
  - [[modules] - экземпляр класса Modules](#modules)
  - [[events] - экземпляр класса Events](#events)
  
  * .moduleName - имя текущего модуля
  
  * .step - [step](#step)
  
  * .modules - [ссылка на экземпляр класса Modules](#modules)
  
  * .events - [ссылка на экземпляр класса Events](#events)
  
  * .stepDepth - позиция глубины вложенности в [steps](#steps)
  
  * .stepIndex - индекс текущей позиции в [steps](#steps)
  
  * .showStepScheme() - возвращает схему вызовов модулей [steps](#steps)
  
  * .stepsInDeep(steps) - метод возвращает новый экземпляр класса [asyncSteps](#asyncsteps) со заданной позицией
    - [steps](#steps)
    
#### Events
Класс событий, расширенный от нативного класса [Events](https://nodejs.org/api/events.html#events_events)
* Events() 
  * .initSteps([result, ]vars) 
    - {*} [result] 
    - [vars](#vars)
  * .on('initSteps', function(result, vars))
  
  * .startStep([result, ]vars, ctx)
    - {*} [result] 
    - [vars](#vars)
    - ctx - [экземпляр класса Ctx](#ctx)
  * .on('startStep', function(result, vars, ctx))
  
  * .end([result, ]vars)
    - {*} [result] 
    - [vars](#vars)
  * .on('end', function(result, vars))
  
  * .endStep([result, ]vars, ctx)
    - {*} [result] 
    - [vars](#vars) 
    - ctx - [экземпляр класса Ctx](#ctx)
  * .on('endStep', function(result, vars, ctx))
    
  * .error(error[, ctx])
    - {*} error - любая ошибка
    - ctx - [экземпляр класса Ctx](#ctx)
  * .on('error', function(error[, ctx]))
    
#### Modules
Класс управляющий модулями
* Modules([, modules])
  - [events - экземпляр класса Events](#events)
  - {object} [modules] - модули
    - {moduleName: [function](#modulefunction)} - уникальное имя: функция
    
  * static getModulesFromFolder(dir) - возвращает модули из указанной папки
    - {string} dir - путь до папки
    
  * .addModule(moduleName, func[, prefix]) 
    - {string} moduleName - уникальное имя
    - {function} [func](#modulefunction)
    - {string} [prefix] - добавляет префикс к названиям модулей `${prefix}/${moduleName}`
    
  * .addModules(modules[, prefix])
    - {object} modules
      - {moduleName: [function](#modulefunction)} - уникальное имя: функция
    - {string} [prefix] - добавляет префикс к названиям модулей `${prefix}/${moduleName}`

      
  * .startModule(moduleName, params[, data], vars, ctx)
    - {string} moduleName - имя вызываемого модуля
    - {params} - параметры соответствующего модуля
    - {*} [data] - данные
    - [vars](#vars)
    - ctx - [экземпляр класса Ctx](#ctx) 
    
#### AsyncSteps
Класс старта
* AsyncSteps(steps[, modules][, events]) 
  - [steps](#steps)
  - [[modules] - экземпляр класса Modules](#modules)
  - [[events] - экземпляр класса Events](#events)
  
  * static getNewBasic() - возвращает новый объект [$BASIC](#vars)
  
  * .modules - [ссылка на экземпляр класса modules](#modules)
  
  * .events - [ссылка на экземпляр класса Events](#events)
  
  * .init([vars][, data])
    - [[vars]](#vars)
    - {*} [data] - данные
    
  * .getPosCurrentStep() - возвращает {index, depth, scheme}
  
  * .startStep(moduleName[, params][, data], vars, ctx)
    - {string} moduleName - имя модуля
    - {params} - параметры соответствующего модуля
    - {*} [data] - данные
    - [[vars]](#vars)
    - ctx - [экземпляр класса Ctx](#ctx) 
  
### Params
##### steps
- {object[[step](#step)]} steps - последовательные модули
    
##### step
- {object} step - модуль
  - {string} module - имя вызываемого модуля
  - {object} [params] - параметры соответствующего модуля
  - {number} [timeout] - задержка вызова текущего модуля
  - {string} [prefix] - добавляет префикс к названию модуля `${prefix}/${moduleName}`
  - {boolean} [sync] - синхронность
  - {function} [[after]](#modulefunction) - функция, исполняющая после завершения текущего модуля 
    - результат функции записывается в data 
    
##### vars
- {var: value} vars - глобальные переменные
  - {object} [$BASIC] - вспомогательный объект модулей
    - [currentModule](#steps) - текущий модуль
    - {*} currentResult - текущий результат модуля
    - {*} beforeResult - предыдущий результат модуля
    - {object} setting - настройки
          
##### moduleFunction
- function([params][, data], vars, ctx)
  - {object} [params] - параметры соответствующего модуля
  - {*} [data] - данные
  - [vars](#vars)
  - ctx - [экземпляр класса Ctx](#ctx)
