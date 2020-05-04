// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ApiRx } from '@polkadot/api';
import { AccountsContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import React, { useContext } from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import shortid from 'shortid';

import {
  AddressSummary,
  Table,
  Thead,
  Th,
  Tb,
  Tc,
  Tr,
  BondExtraModal,
} from './index';

interface BondedAccountsTableProps {
  api: ApiRx;
}

interface BondedAccountRowProps extends BondedAccountsTableProps {
  account: string;
}

interface StakingQueryColumnsProps extends BondedAccountRowProps {}

interface StashColumnProps extends BondedAccountRowProps {}

interface ActionsForBondedProps {
  stashId: string;
}

const ActionsForBonded = React.memo((props: ActionsForBondedProps): React.
ReactElement => {
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
});

const StashColumn = React.memo((props: StashColumnProps): React.ReactElement => {
  const { account, api } = props;
  const { state: { allAccounts, allStashes } } = useContext(AccountsContext);

  const thisInjectedStash = allAccounts.find(
    (injectedAccount: InjectedAccountWithMeta) =>
      injectedAccount.address === account
  );

  return (
    <Tc>
      {!allStashes ? (
        <Spinner active inline />
      ) : (
        <AddressSummary
          address={account}
          api={api}
          name={thisInjectedStash?.meta.name}
          noBalance
          size='tiny'
        />
      )}
    </Tc>
  );
});

const StakingQueryColumns = React.memo((props: StakingQueryColumnsProps): React.ReactElement => {
  const { account, api } = props;
  const { state: { allAccounts, allStashes, loadingAccountStaking, stashControllerMap} } = useContext(AccountsContext);

  const staking = stashControllerMap[account];

  const thisInjectedController = allAccounts.find(
    (injectedAccount: InjectedAccountWithMeta) =>
      injectedAccount.address === account &&
      !allStashes.includes(injectedAccount.address)
  );

  return (
    <>
      <Tc>
        {loadingAccountStaking ? (
          <Spinner active inline />
        ) : !staking ? (
          'no staking info'
        ) : (
          <AddressSummary
            address={
              staking.controllerId?.toHuman && staking.controllerId?.toHuman()
            }
            api={api}
            name={thisInjectedController?.meta.name}
            noBalance
            size='tiny'
          />
        )}
      </Tc>
      <Tc>
        {loadingAccountStaking ? (
          <Spinner inline active />
        ) : !staking ? (
          'no staking info'
        ) : (
          staking.stakingLedger?.active.toHuman &&
          staking.stakingLedger?.active.toHuman()
        )}
      </Tc>
    </>
  );
});

// n.b. doesnt make sense to render balacne here because it's not clear to the user whether the balance is for the stash or the controller. Would make sense to defer that to account details page.
const BondedAccountRow = React.memo((props: BondedAccountRowProps): React.ReactElement => {
  console.log('rerendered...')
  const { account, api } = props;

  return (
    <Tr key={shortid.generate()}>
      <StashColumn account={account} api={api} />
      <StakingQueryColumns account={account} api={api} />
      <ActionsForBonded stashId={account} />
    </Tr>
  );
});

const BondedAccountsTable = (props: BondedAccountsTableProps): React.ReactElement => {
  const { api } = props;
  const { state: { allStashes } } = useContext(AccountsContext);

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Bonded Accounts</Th>
        </Tr>
        <Tr>
          <Th>Stash</Th>
          <Th>Controller</Th>
          <Th>Bonded Amount</Th>
        </Tr>
      </Thead>
      <Tb>
        {allStashes.length ? ( allStashes.map((account: string) => <BondedAccountRow account={account} api={api} />)
        ) : (
          <Tr>
            <Tc rowSpan={4}>No Bonded Accounts</Tc>
          </Tr>
        )}
      </Tb>
    </Table>
  );
};

export default React.memo(BondedAccountsTable);