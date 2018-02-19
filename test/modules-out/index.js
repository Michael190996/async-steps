import Modules from '../../src/lib/Modules';
import path from 'path';

const modules = Modules.getModulesFromFolder(path.join(__dirname, '..', 'modules-as'));

export default modules;