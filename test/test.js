const assert = require('assert');
const { transform } = require('@babel/core');
const plugin = require('../src/index.js');

describe('babel-plugin-fn-counter', () => {
  it('should count the number of functions correctly', () => {
    const code = `
      function a() {}
      const b = function() {};
      const c = () => {};
    `;
    const output = transform(code, { plugins: [plugin] });
    const { __fn__counter } = output.metadata;
    assert.strictEqual(__fn__counter, 3);
  });
});
