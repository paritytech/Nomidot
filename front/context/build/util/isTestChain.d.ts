declare const TEST_CHAINS: readonly ["Development", "Local Testnet"];
declare type TestChain = typeof TEST_CHAINS[number];
export declare function isTestChain(chain?: string): chain is TestChain;
export {};
