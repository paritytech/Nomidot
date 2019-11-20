// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext } from '@substrate/context/src';
import { AccountsList } from '@substrate/ui-components/src';
import React, { useContext, useEffect, useState } from 'react';

const Profile = (): React.ReactElement => {
  const { injectedAccounts } = useContext(AccountsContext);
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsComponentMounted(true);

    return () => setIsComponentMounted(false);
  }, []);

  return (
    <AccountsList accounts={injectedAccounts} clickable />
  )
}

export default Profile;