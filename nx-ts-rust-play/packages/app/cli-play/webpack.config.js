const { merge } = require('webpack-merge');

module.exports = (config, context) => {
  return merge(config, {
    target: 'node',
    node: {
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /\.node$/,
          loader: 'node-loader',
        },
      ],
    },
  });
};
