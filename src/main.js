import * as acorn from 'acorn';

const code = 'const a = 1;';
const ast = acorn.parse(code, { ecmaVersion: 2020 });

console.log(JSON.stringify(ast, null, 2));
