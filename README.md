# babel-plugin-fn-counter
a simple plugin counter

![Node.js CI](https://github.com/renaesop/babel-plugin-fn-counter/actions/workflows/node.js.yml/badge.svg)

## Installation
To install the plugin, use npm:

```sh
npm install babel-plugin-fn-counter
```

## Usage
To use the plugin in your Babel configuration file (usually named "babel.config.json" or ".babelrc" and located at the root of your project), add it to the plugins array:

```js
{
  "plugins": ["babel-plugin-fn-counter"]
}
```

## Sourcemap Visualization
The plugin now supports visualizing `__fn__counter` with a sourcemap. You can use the `visualizer.html` file to upload your `__fn__counter` JSON file and sourcemap for visualization.

### Instructions
1. Open the `visualizer.html` file in your browser.
2. Upload the `__fn__counter` JSON file using the first file input.
3. Upload the sourcemap file using the second file input.
4. Click the "Visualize" button to see the visualization of the data.
