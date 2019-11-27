/* eslint-disable */

const path = require('path');

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
exports.onCreateWebpackConfig = function({ actions }) {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@substrate/context': path.resolve(__dirname, '../context/src'),
        '@substrate/ui-components': path.resolve(
          __dirname,
          '../ui-components/src'
        ),
      },
    },
  });
};
