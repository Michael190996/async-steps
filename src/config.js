import homePackage from '../package.json';
import path from 'path';

const cwdDir = process.cwd();
const homeDir = path.join(__dirname, '..');

export default {
  homeDir,
  cwdDir,
  homePackage,
  cwdPackage: require(path.join(cwdDir, 'package.json'))
}