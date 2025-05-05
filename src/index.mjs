import * as acorn from 'acorn';
import express from 'express';
import * as astring from 'astring';
// import {JSFuck} from './jsfuck.js';
import pkg from './jsfuck.js';
const {JSFuck} = pkg;


const app = express();
// "Literal" ノードを探して JSFuck でエンコードする
function applyJSFuck(node, literals = []) {
    if (node.type === 'Literal') {
        node.value = JSFuck.encode(node.value);
        node.raw = `'${node.value}'`;
    //   literals.push(node);
    }
  
    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const child = node[key];
        if (Array.isArray(child)) {
          child.forEach(c => applyJSFuck(c, literals));
        } else if (child && typeof child.type === 'string') {
          applyJSFuck(child, literals);
        }
      }
    }
  
    return node;
  }

app.get('/', (req, res) => {
    const code = 'const a = "hoge";';
    const ast = acorn.parse(code, { ecmaVersion: 2020 });
    
    console.log(JSON.stringify(ast, null, 2));

    // const ast = /* ASTオブジェクト */;
    // ast['body'][0]['declarations'][0]['init']['value'] = 2;
    // ast['body'][0]['declarations'][0]['init']['raw'] = "2";
    // const generated_code = astring.generate(ast);
    // console.log(generated_code);
    const encodedAst = applyJSFuck(ast);
    const generated_code = astring.generate(encodedAst);
    console.log(generated_code);

    // console.log(literals);
    // console.log(JSON.stringify(literals, null, 2));
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
