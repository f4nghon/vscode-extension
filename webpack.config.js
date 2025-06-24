const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node', // VS Code extensions run in Node.js
  entry: './src/extension.ts', // adjust if your entry file is elsewhere
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map', // enable source maps for debugging
  externals: {
  vscode: 'commonjs vscode',
  path: 'commonjs path',
  child_process: 'commonjs child_process',
},

  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  optimization: {
    minimize: false
  },
  node: {
    __dirname: false,
    __filename: false
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'server/*.jar'),
          to: 'server/[name][ext]'
        }
      ]
    })
  ]
};
