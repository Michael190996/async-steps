export default function (params, beforeResult, vars, ctx) {
  console.log(params, vars.$BASIC.currentModule);
  return {result: true};
}