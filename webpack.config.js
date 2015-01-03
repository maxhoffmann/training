"use strict";

module.exports = {
  entry: './src/main.jsx',
  output: {
    filename: 'dist/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};
