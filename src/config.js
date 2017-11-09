import PACKAGE from '../package.json';
import path from 'path';

const CWDDIR = process.cwd();
const HOMEDIR = path.join(__dirname, '..');

export default {
  homePackage: PACKAGE,
  homeDir: HOMEDIR,
  cwdDir: CWDDIR,
  cwdPackage: require(path.join(CWDDIR, 'package.json'))
}

