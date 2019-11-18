/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';

type MetaProps = JSX.IntrinsicElements['meta'];

interface Props {
	description?: string;
	lang?: string;
	meta?: MetaProps[];
	title?: string;
}

function SEO({
	description = '',
	lang = 'en',
	meta = [],
	title = '',
}: Props): React.ReactElement {
	const { site } = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						author
					}
				}
			}
		`
	);

	const metaDescription: string = description || site.siteMetadata.description;
	const defaultMeta = [
		{
			name: `description`,
			content: metaDescription,
		},
	];

	return (
		<Helmet
			htmlAttributes={{
				lang,
			}}
			title={title}
			titleTemplate={`%s | ${site.siteMetadata.title}`}
			meta={[...defaultMeta, ...meta]}
		/>
	);
}

export default SEO;
