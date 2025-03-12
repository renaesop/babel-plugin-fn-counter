const sourceMap = require('source-map');

module.exports = function() {
  return {
    visitor: {
      Program(path, state) {
        const initCounter = `
          if (typeof __fn__counter === 'undefined') {
            if (typeof global !== 'undefined') {
              global.__fn__counter = {};
            } else if (typeof window !== 'undefined') {
              window.__fn__counter = {};
            } else if (typeof self !== 'undefined') {
              self.__fn__counter = {};
            }
          }
        `;
        path.unshiftContainer('body', initCounter);
      },
      FunctionDeclaration(path, state) {
        const functionName = path.node.id.name;
        const uniqueKey = `${state.file.opts.filename}:${functionName}:${path.node.loc.start.line}:${path.node.loc.start.column}`;
        path.insertBefore(`
          if (!__fn__counter['${uniqueKey}']) {
            __fn__counter['${uniqueKey}'] = 0;
          }
          __fn__counter['${uniqueKey}']++;
        `);
      },
      FunctionExpression(path, state) {
        const functionName = path.node.id ? path.node.id.name : 'anonymous';
        const uniqueKey = `${state.file.opts.filename}:${functionName}:${path.node.loc.start.line}:${path.node.loc.start.column}`;
        path.insertBefore(`
          if (!__fn__counter['${uniqueKey}']) {
            __fn__counter['${uniqueKey}'] = 0;
          }
          __fn__counter['${uniqueKey}']++;
        `);
      },
      ArrowFunctionExpression(path, state) {
        const functionName = 'arrow_function';
        const uniqueKey = `${state.file.opts.filename}:${functionName}:${path.node.loc.start.line}:${path.node.loc.start.column}`;
        path.insertBefore(`
          if (!__fn__counter['${uniqueKey}']) {
            __fn__counter['${uniqueKey}'] = 0;
          }
          __fn__counter['${uniqueKey}']++;
        `);
      }
    }
  };
};
