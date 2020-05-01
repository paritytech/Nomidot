// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import IdentityIcon from '@polkadot/react-identicon';
import { Spinner } from '@substrate/design-system';
import React from 'react';
import styled from 'styled-components';

import { Balance } from '../Balance';
import { OrientationType, SizeType } from './types';

const Layout = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2px;

  & > * {
    margin: 1px 10px;
  }
`;

type AddressSummaryProps = {
  address?: string;
  api: ApiRx;
  detailed?: boolean;
  name?: string;
  noPlaceholderName?: boolean;
  noBalance?: boolean;
  orientation?: OrientationType;
  size?: SizeType;
  withShortAddress?: boolean;
};

const PLACEHOLDER_NAME = 'No Name';

const ICON_SIZES = {
  tiny: 16,
  small: 32,
  medium: 96,
  large: 128,
};

function renderIcon(address: string, size: SizeType): React.ReactElement {
  return (
    <IdentityIcon value={address} theme={'substrate'} size={ICON_SIZES[size]} />
  );
}

function renderShortAddress(address: string): string {
  return address
    .slice(0, 8)
    .concat('......')
    .concat(address.slice(address.length - 8, address.length));
}

function renderDetails(
  address: string,
  api: ApiRx,
  summaryProps: Exclude<AddressSummaryProps, keyof 'address'>
): React.ReactElement {
  const {
    detailed,
    name = PLACEHOLDER_NAME,
    noBalance,
    noPlaceholderName,
    withShortAddress,
  } = summaryProps;

  return (
    <>
      {noPlaceholderName ? null : name}
      {withShortAddress && renderShortAddress(address)}
      {!noBalance && (
        <Balance
          address={address}
          api={api}
          detailed={detailed}
        />
      )}
    </>
  );
}

export function AddressSummary(props: AddressSummaryProps): React.ReactElement {
  const { address, api, size = 'medium' } = props;

  if (address) {
    return (
      <Layout>
        {renderIcon(address, size)}
        {renderDetails(address, api, props)}
      </Layout>
    );
  } else {
    return <Spinner />;
  }
}
