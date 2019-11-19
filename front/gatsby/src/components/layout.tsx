/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import './layout.css';

import { NavHeader } from '@substrate/ui-components/src';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): React.ReactElement => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <>
    <NavHeader siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          height: '100%',
          margin: `0 auto`,
          padding: `0px 1.0875rem 1.45rem`,
          paddingTop: 0,
        }}
      >
        <main className='content'>{children}</main>
        <footer className='footer'>
          {data.site.siteMetadata.title}© {new Date().getFullYear()}, Built with
          {` `}
          <a href='https://polkadot.js.org/api/'>Polkadot-js</a>
        </footer>
      </div>
    </>
  );
};

export default Layout;
