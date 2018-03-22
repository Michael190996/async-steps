import test from './test';

export default [{
  fn: test,
  name: 'test'
}, {
  fn(p,d,as) {
    console.log(as.getScheme());
  },
  name: 'test2'
}]