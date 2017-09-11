import moduleSetComponents from './component/modules/setComponents.js';
import moduleSetComponent from './component/modules/setComponent.js';
import moduleCallComponent from './component/modules/callComponent.js';
import moduleCallComponents from './component/modules/callComponents.js';
import moduleFor from './component/modules/for.js';
import moduleIfs from './component/modules/ifs.js';
import moduleIf from './component/modules/if.js';
import moduleVars from './component/modules/vars.js';
import moduleLodashTemplate from './component/modules/lodashTemplate.js';

/**
 * Экпорт {name: func}
 */

export default {
  'set:component': moduleSetComponent,
  'set:components': moduleSetComponents,
  'call:component': moduleCallComponent,
  'call:components': moduleCallComponents,
  'for': moduleFor,
  'ifs': moduleIfs,
  'if': moduleIf,
  'vars': moduleVars,
  'lodash:template': moduleLodashTemplate
};