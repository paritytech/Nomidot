import React from 'react';
import { Helmet } from 'react-helmet';

import pkgJson from '../../package.json';

type MetaProps = JSX.IntrinsicElements['meta'];

const DEFAULT_META = [
  {
    name: 'description',
    content: pkgJson.description,
  },
];

export interface SeoProps {
  meta?: MetaProps[];
  title: string;
}

export function Seo(props: SeoProps): React.ReactElement {
  const { meta, title } = props;

  return (
    <Helmet
      htmlAttributes={{
        lang: 'en',
      }}
      meta={[...DEFAULT_META, ...meta]}
      title={title}
      titleTemplate={`%s | ${pkgJson.name}`}
    />
  );
}
