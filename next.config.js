const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');

module.exports = {
  webpack(config, { isServer }) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    if (!isServer) {
      config.node = {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      };
    }
    return config;
  },
};
