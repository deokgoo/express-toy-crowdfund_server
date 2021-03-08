const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const path = require('path');

const { NODE_ENV } = process.env;
const OURPUT_PATH = path.resolve(__dirname, 'dist');
const DEVELOP_ENV_PATH = '/.env-dev';
const PRODUCTION_ENV_PATH = '/.env-prod';
const ENV_PATH = path.join(__dirname, NODE_ENV === 'production' ? PRODUCTION_ENV_PATH : DEVELOP_ENV_PATH);

module.exports = {
  mode: NODE_ENV,
  entry: './src/app.ts',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts|js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-env'],
            plugins: ['@babel/plugin-transform-typescript', '@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
          },
        },
      }, 
    ]
  },
  plugins: [
    new Dotenv({
      path: ENV_PATH, // load this now instead of the ones in '.env'
      safe: true, // load 'ENV_PATH' to verify the '.env' variables are all set. Can also be a string to a different file.
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false // load '.env.defaults' as the default values if empty.
    })
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'app.js',
    path: OURPUT_PATH,
  },
};
