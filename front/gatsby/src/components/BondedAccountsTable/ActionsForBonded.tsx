// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';

import { BondExtraModal, Tc } from '../index';
import { ActionsForBondedProps } from './types';

const ActionsForBonded = (props: ActionsForBondedProps): React.ReactElement => {
  const { stashId } = props;

  return (
    <Tc>
      <Dropdown text='Actions'>
        <Dropdown.Menu>
          <Dropdown.Item text='Unbond' />
          <BondExtraModal stashId={stashId} />
          <Dropdown.Item text='Claim Rewards' />
          <Dropdown.Item text='Change Reward Preferences' />
        </Dropdown.Menu>
      </Dropdown>
    </Tc>
  );
};

export default React.memo(ActionsForBonded);
