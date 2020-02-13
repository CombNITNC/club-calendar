const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
  entry: ['./server'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules|view|pages|public/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  plugins: [new (require('dotenv-webpack'))()],
};

module.exports = config;
