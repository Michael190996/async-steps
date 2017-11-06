[![NPM Version](https://img.shields.io/npm/v/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![NPM Downloads](https://img.shields.io/npm/dm/async-steps.svg?style=flat)](https://www.npmjs.com/package/async-steps)
[![Node.js Version](https://img.shields.io/node/v/async-steps.svg?style=flat)](http://nodejs.org/download/)
[![Build Status](https://travis-ci.org/futoin/core-js-ri-async-steps.svg)](https://travis-ci.org/futoin/core-js-ri-async-steps)
  [![stable](https://img.shields.io/badge/stablity-beta-green.svg?style=flat)](https://www.npmjs.com/package/futoin-asyncsteps)
[![NPM](https://nodei.co/npm/async-steps.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/async-steps/)

# Async-steps (0.2.5) **BETA**
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
- **Потоки** - Модуль также может возвращать результат в едином потоке.
- **Гибкость в ассинхронности/синхронности** - Все модули могут вызываться как последовательно, так и беспорядочно, простым флагом sync.
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

const module = function test(params, pipe, vars, events) {
    return {
      result: params.test
    };
};

const modules = {
  test2: async function(params, pipe, vars, events) {
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

asModules.addModule('test', (params, pipe, vars, ctx) => {
  console.log(params, pipe, vars, ctx);
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

as.init(globalVars, 'pipe')
	.then(response => console.info(response))
	.catch(err => console.error(err))
```
#### Вызов классов-контроллеров
```javascript
import AsyncSteps from '../dist/controllers/AsyncSteps';
import AsModules from '../dist/controllers/Modules';
import AsEvents from '../dist/controllers/Events';

const asEvents = new AsEvents();
const asModules = new AsModules(asEvents);

asModules.addModule('test', (params, pipe, vars, ctx) => {
  console.log(params, pipe, vars, ctx);
});

const globalVars = {
  vars_i: true
};

const steps = [{
  module: 'test'
}]

const as = new AsyncSteps(steps, asModules, asEvents);
as.init(globalVars, 'pipe')
	.then(response => console.info(response))
	.catch(err => console.error(err))
````
## Расширяемость из библиотек
- [см. https://github.com/Michael190996/async-steps.modules-as](https://github.com/Michael190996/async-steps.modules-as)
## Раздел asyncsteps в package.json 
* asyncsteps
  - {boolean} noModulesAs=false - не добавлять модулей из библиотеки async-steps.modules-as
  - {object[]} [pathsToModules] - массив объектов настроек модулей
    - {string} [prefix] - добавляет префикс к названиям модулей `${prefix}/${moduleName}`
    - {boolean} [homeDir] - берет модуль либо с библиотеки, либо с текущей директории
    - {string} path - имя модуля или путь к директории с модулями
  - {object} [importsModules]
    - {name: path} - имя и путь к модулю
## API
### Classes-controllers
* Классы-контроллеры для вызова лежат в директории dist/controllers/*
#### Ctx
  * Ctx({[sync, ][timeoeut][, prefix]}[, modules][, events])
  - {boolean} [sync] - синхронность
  - {string} [prefix] - префикс к названиям модулей `${prefix}/${moduleName}`
  - {number} [timeout] - задержка текущего модуля
  - [[modules] - экземпляр класса Modules](#modules)
  - [[events] - экземпляр класса Events](#events)
  
  * .sync - синхронность
  
  * .prefix - префикс к названию модуля `${prefix}/${moduleName}`
  
  * .timeout - задержка текущего модуля
  
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
  
  * .mediumRes(name, result, vars, ctx)
    - {string} name - имя соответствующего результата
    - {*} [result] 
    - [vars](#vars) 
    - ctx - [экземпляр класса Ctx](#ctx)
  * .on('mediumRes', function(name, result, vars, ctx))
    
#### Modules
Класс управляющий модулями
* Modules(events[, modules])
  - [events - экземпляр класса Events](#events)
  - {object} [modules] - модули
    - {moduleName: [function](#modulefunction)} - уникальное имя: функция
    
  * static getModulesFromFolder(dir[, prefix]) - возвращает модули из указанной папки
    - {string} dir - Путь до папки
    - {string} [prefix] - добавляет префикс к названиям модулей `${prefix}/${moduleName}`
    
  * .addModule(moduleName, func) 
    - {string} moduleName - уникальное имя
    - {function} [func](#modulefunction)
    
  * .addModules(modules)
    - {object} modules
      - {moduleName: [function](#modulefunction)} - уникальное имя: функция
      
  * .startModule(moduleName, params[, pipe], vars, ctx)
    - {string} moduleName - имя вызываемого модуля
    - {params} - параметры соответствующего модуля
    - {*} [pipe] - поток результата
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
  
  * .init([vars][, pipe])
    - [[vars]](#vars)
    - {*} [pipe] - поток результата
    
  * .getPosCurrentStep() - возвращает {index, depth, scheme}
  
### Params
##### steps
- {object[]} steps - последовательные модули
  - {string} module - имя вызываемого модуля
  - {object} [params] - параметры соответствующего модуля
  - {number} [timeout] - задержка вызова текущего модуля
  - {string} [prefix] - добавляет префикс к названию модуля `${prefix}/${moduleName}`
  - {boolean} [sync] - синхронность
  - {function} [[after]](#modulefunction) - функция, исполняющая после завершения текущего модуля 
    - результат функции записывается в pipe
  - {string} [mediumRes] - промежуточный результат модуля возвращается в событии mediumRes с указанным именем
    - events.mediumRes.emit(name, result, vars, ctx)
    
##### vars
- {var: value} vars - глобальные переменные
  - {object} [$BASIC] - вспомогательный объект модулей
    - [currentModule](#steps) - текущий модуль
    - {*} currentResult - текущий результат модуля
    - {*} beforeResult - предыдущий результат модуля
    - {object} setting - настройки модулей
      - {boolean} lodash - добавляет шаблонизатор на параметры params [модулей](#steps)
          
##### moduleFunction
- function([params][, pipe], vars, ctx)
  - {object} [params] - параметры соответствующего модуля
  - {*} [pipe] - поток результата
  - [vars](#vars)
  - ctx - [экземпляр класса Ctx](#ctx)
