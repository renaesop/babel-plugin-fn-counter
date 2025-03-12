const assert = require('assert');
const { transform } = require('@babel/core');
const plugin = require('../src/index.js');
const { Script } = require('vm');

describe('babel-plugin-fn-counter', () => {
  it('should count the number of functions correctly', () => {
    const code = `
      function a() {}
      const b = function() {};
      const c = () => {};
      a();
      b();
      c();
    `;
    const output = transform(code, { plugins: [plugin], filename: 'test/test.js' });
    const script = new Script(output.code);
    const sandbox = { __fn__counter: {} };
    script.runInNewContext(sandbox);
    const { __fn__counter } = sandbox;
    console.log(output, __fn__counter)
    assert.strictEqual(__fn__counter['test/test.js:a:2:6'], 1);
    assert.strictEqual(__fn__counter['test/test.js:b:3:12'], 1);
    assert.strictEqual(__fn__counter['test/test.js:arrow_function:4:12'], 1);
  });
});
