module.exports = function() {
  return {
    visitor: {
      FunctionDeclaration(path) {
        // No-op
      },
      FunctionExpression(path) {
        // No-op
      },
      ArrowFunctionExpression(path) {
        // No-op
      }
    }
  };
};
