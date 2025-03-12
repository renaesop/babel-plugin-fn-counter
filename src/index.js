const path = require("path");
const { default: template } = require("@babel/template");
const t = require("@babel/types");

module.exports = function functionCounterPlugin() {
  const initCounterAST = template.ast(`
    if (typeof __fn__counter === 'undefined') {
      if (typeof global !== 'undefined') {
        global.__fn__counter = {};
      } else if (typeof window !== 'undefined') {
        window.__fn__counter = {};
      } else if (typeof self !== 'undefined') {
        self.__fn__counter = {};
      }
    }
  `);

  const incrementCounterTemplate = template(`
    {
      if (!__fn__counter[UNIQUE_KEY]) {
        __fn__counter[UNIQUE_KEY] = 0;
      }
      __fn__counter[UNIQUE_KEY]++;
    }
  `);

  let initInserted = false;

  return {
    name: "function-counter-plugin",
    visitor: {
      Program(path) {
        // Only insert the init code once
        if (!initInserted) {
          path.unshiftContainer("body", initCounterAST);
          initInserted = true;
        }
      },

      FunctionDeclaration(path, state) {
        if (!path.node.loc || path.node._skipFunctionCounter) return;
        path.node._skipFunctionCounter = true;

        const functionName = path.node.id ? path.node.id.name : "anonymous";
        const uniqueKey = makeUniqueKey(
          state.file.opts.filename,
          functionName,
          path.node.loc
        );

        const incrementNode = incrementCounterTemplate({
          UNIQUE_KEY: t.stringLiteral(uniqueKey),
        });
        incrementNode._skipFunctionCounter = true;

        insertIncrementAtFunctionStart(path, incrementNode);
      },

      FunctionExpression(path, state) {
        if (!path.node.loc || path.node._skipFunctionCounter) return;
        path.node._skipFunctionCounter = true;

        const functionName = path.node.id ? path.node.id.name : "anonymous";
        const uniqueKey = makeUniqueKey(
          state.file.opts.filename,
          functionName,
          path.node.loc
        );

        const incrementNode = incrementCounterTemplate({
          UNIQUE_KEY: t.stringLiteral(uniqueKey),
        });
        incrementNode._skipFunctionCounter = true;

        insertIncrementAtFunctionStart(path, incrementNode);
      },

      ArrowFunctionExpression(path, state) {
        if (!path.node.loc || path.node._skipFunctionCounter) return;
        path.node._skipFunctionCounter = true;

        const functionName = "arrow_function";
        const uniqueKey = makeUniqueKey(
          state.file.opts.filename,
          functionName,
          path.node.loc
        );

        const incrementNode = incrementCounterTemplate({
          UNIQUE_KEY: t.stringLiteral(uniqueKey),
        });
        incrementNode._skipFunctionCounter = true;

        insertIncrementAtFunctionStart(path, incrementNode);
      },
    },
  };
};

/**
 * Inserts `incrementNode` at the very beginning of a function's body.
 * If it's an arrow function with an expression body, wrap it in a block first.
 */
function insertIncrementAtFunctionStart(path, incrementNode) {
  const bodyPath = path.get("body");

  // If it's an arrow function with an expression body, convert to block.
  if (!t.isBlockStatement(bodyPath.node)) {
    bodyPath.replaceWith(
      t.blockStatement([t.returnStatement(bodyPath.node)])
    );
    // After replacing, re-fetch the 'body' path
  }

  path.get("body").unshiftContainer("body", incrementNode);
}

/**
 * Creates a unique key from a relative filename, function name, and source location.
 * The filename is converted to a relative path from the project root (process.cwd()).
 */
function makeUniqueKey(filename = "unknown", fnName, loc) {
  const relativeFilename = path.relative(process.cwd(), filename) || filename;

  if (!loc) {
    return `${relativeFilename}:${fnName}:unknown-line:unknown-col`;
  }

  return `${relativeFilename}:${fnName}:${loc.start.line}:${loc.start.column}`;
}
