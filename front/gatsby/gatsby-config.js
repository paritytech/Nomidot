/* eslint-disable */
module.exports = {
  siteMetadata: {
    title: 'Nomidot',
    description: 'Staking Portal for Polkadot',
    author: '@paritytech',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Nomidot',
        short_name: 'nomidot',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-typescript',
  ],
};
