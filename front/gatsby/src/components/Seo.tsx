// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Helmet } from 'react-helmet';

import { APP_DESCRIPTION, APP_TITLE } from '../util';

type MetaProps = JSX.IntrinsicElements['meta'];

const DEFAULT_META = [
  {
    name: 'description',
    content: APP_DESCRIPTION,
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
      titleTemplate={`%s | ${APP_TITLE}`}
    />
  );
}
