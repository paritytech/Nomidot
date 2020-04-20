# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.25](https://github.com/paritytech/Nomidot/compare/v0.3.24...v0.3.25) (2020-04-20)


### Bug Fixes

* **context:** Reset context parameters when we change provider ([#303](https://github.com/paritytech/Nomidot/issues/303)) ([bfc9c0e](https://github.com/paritytech/Nomidot/commit/bfc9c0e7db80dd58d15f32e638ceb9267d24bf59))


### Features

* Split ApiContext into ApiPromiseContext and ApiRxContext ([#302](https://github.com/paritytech/Nomidot/issues/302)) ([ef85664](https://github.com/paritytech/Nomidot/commit/ef856649a429b5ff2f45e71bc9be193bc05ec16c))





## [0.3.24](https://github.com/paritytech/Nomidot/compare/v0.3.23...v0.3.24) (2020-04-14)


### Bug Fixes

* **context:** Add local-storage dep ([#294](https://github.com/paritytech/Nomidot/issues/294)) ([f652190](https://github.com/paritytech/Nomidot/commit/f65219085f11c68e1f5d6eb4a8e1fb3bf3f57c46))
* address summary stretchy thing ([#297](https://github.com/paritytech/Nomidot/issues/297)) ([cc95952](https://github.com/paritytech/Nomidot/commit/cc9595239115e6cc9a8fdb19dcdad049834bdd1f))
* field resource ([#299](https://github.com/paritytech/Nomidot/issues/299)) ([d59e216](https://github.com/paritytech/Nomidot/commit/d59e21616ee779775dd6400cf44bb88d138e9360))
* styling for tables and account page ([#295](https://github.com/paritytech/Nomidot/issues/295)) ([96c8dde](https://github.com/paritytech/Nomidot/commit/96c8dde74ce5b5d59bd8365ceb2525e4a58409fa))


### Features

* extension signer ([#290](https://github.com/paritytech/Nomidot/issues/290)) ([97a6611](https://github.com/paritytech/Nomidot/commit/97a6611162be7d59f5010084906c9c968d17ed78))
* server, node endpionts per env ([#296](https://github.com/paritytech/Nomidot/issues/296)) ([895a9ca](https://github.com/paritytech/Nomidot/commit/895a9ca3d6381d8de900050a244a28b2f6852d3d))
* set cpu/mem requests and limits for prisma and cloudsql ([#298](https://github.com/paritytech/Nomidot/issues/298)) ([9ab8811](https://github.com/paritytech/Nomidot/commit/9ab8811a75bdb32caa5001f84f6ed377cf01ced8))





## [0.3.23](https://github.com/paritytech/Nomidot/compare/v0.3.22...v0.3.23) (2020-04-09)


### Bug Fixes

* **context:** Make provider optional in contexts ([#291](https://github.com/paritytech/Nomidot/issues/291)) ([5a129e0](https://github.com/paritytech/Nomidot/commit/5a129e05bcb6c37cc59ac25249052da6ea5bca54))
* archive node endpoint, nodewatcher endpoint 1.5 ([#274](https://github.com/paritytech/Nomidot/issues/274)) ([62a6ae7](https://github.com/paritytech/Nomidot/commit/62a6ae7c86d42ed125d3dff0597573369c56a901))
* log era only on new idx ([#262](https://github.com/paritytech/Nomidot/issues/262)) ([a82db81](https://github.com/paritytech/Nomidot/commit/a82db8158801a29bee48730c98518234dc52509f))
* remove fillin-job, update image for last50k ([#272](https://github.com/paritytech/Nomidot/issues/272)) ([dce3843](https://github.com/paritytech/Nomidot/commit/dce38433e460f017c8c7a3ec71ed5193ed047d32))
* replicasets ([#246](https://github.com/paritytech/Nomidot/issues/246)) ([101d39c](https://github.com/paritytech/Nomidot/commit/101d39cba8ab0c94376ea74f27fdbe64649f0151))
* server deployment strategy, nodewatcher replicas ([#270](https://github.com/paritytech/Nomidot/issues/270)) ([7ccc2de](https://github.com/paritytech/Nomidot/commit/7ccc2de4b541d1b260df28d1e6324f9438440dda))
* uncomment nomidot tasks ([#252](https://github.com/paritytech/Nomidot/issues/252)) ([cc121f5](https://github.com/paritytech/Nomidot/commit/cc121f58d70970a1ad8ba5d48df6600e84a59cc5))
* Use domains instead of ips ([#278](https://github.com/paritytech/Nomidot/issues/278)) ([a806ada](https://github.com/paritytech/Nomidot/commit/a806adaf632b0d7d852d6894145a2677c33266f2))
* v1.5 sync ([#265](https://github.com/paritytech/Nomidot/issues/265)) ([5d2fd70](https://github.com/paritytech/Nomidot/commit/5d2fd70bccf64facae1e6cfe7103af197a1f5e7a))


### Features

* 1 replica for nodewatcher deployment ([#277](https://github.com/paritytech/Nomidot/issues/277)) ([46bb5ea](https://github.com/paritytech/Nomidot/commit/46bb5eaf97e3d9925c4fb99dfd953929004b8e96))
* accounts context ([#228](https://github.com/paritytech/Nomidot/issues/228)) ([909f380](https://github.com/paritytech/Nomidot/commit/909f3809a2e22e2977ccfcbeca66150171e88744))
* accounts page ([#256](https://github.com/paritytech/Nomidot/issues/256)) ([1120cba](https://github.com/paritytech/Nomidot/commit/1120cbae9202c244d1b118e3f7c89ce64a7eb6a7))
* cache accounts context results ([#285](https://github.com/paritytech/Nomidot/issues/285)) ([c25e304](https://github.com/paritytech/Nomidot/commit/c25e304cba0633bc6660543a43ea1edd66fb8b8d))
* new header ([#269](https://github.com/paritytech/Nomidot/issues/269)) ([f0a34fb](https://github.com/paritytech/Nomidot/commit/f0a34fb45ca3526f09969f9b178cdd62a0de86bf))
* v1.5 sync ([#255](https://github.com/paritytech/Nomidot/issues/255)) ([d394ee5](https://github.com/paritytech/Nomidot/commit/d394ee5929824e442e8594083663e72796729d3a))





## [0.3.22](https://github.com/paritytech/Nomidot/compare/v0.3.21...v0.3.22) (2020-03-18)


### Bug Fixes

* **context:** Remove useless keyring from context ([#241](https://github.com/paritytech/Nomidot/issues/241)) ([d03b432](https://github.com/paritytech/Nomidot/commit/d03b432b459ba10865a436870796596308b07ae7))
* **nodeWatcher:** Handle promise errors ([#240](https://github.com/paritytech/Nomidot/issues/240)) ([bbe8986](https://github.com/paritytech/Nomidot/commit/bbe8986141457659252debb00250e3e481cd9103))
* js heap out of memory ([#203](https://github.com/paritytech/Nomidot/issues/203)) ([246a3c1](https://github.com/paritytech/Nomidot/commit/246a3c12eb94106aa08b3df6ae6baa2fc1931ea0))
* redirection and other navigation bugs ([#209](https://github.com/paritytech/Nomidot/issues/209)) ([6a0c20d](https://github.com/paritytech/Nomidot/commit/6a0c20d01b51253b174f90e30d7a6790f2de829a))
* ws iin dev ([#204](https://github.com/paritytech/Nomidot/issues/204)) ([b0adb5b](https://github.com/paritytech/Nomidot/commit/b0adb5b6774fe8b460c83d45fd4846f1c271ee43))


### Features

* accounts page ([#207](https://github.com/paritytech/Nomidot/issues/207)) ([ba81594](https://github.com/paritytech/Nomidot/commit/ba81594401e0fc01c299b1d4cafbc3d18e898e6b))
* add to cart, cart page ([#205](https://github.com/paritytech/Nomidot/issues/205)) ([3baf09e](https://github.com/paritytech/Nomidot/commit/3baf09e5fc70991a6243cabc5694b479c0000d8b))
* app wide routing setup with @reach/router ([#191](https://github.com/paritytech/Nomidot/issues/191)) ([c73069c](https://github.com/paritytech/Nomidot/commit/c73069c823a539a216c5053d9e9dd938e7805692))
* localstorage listeners ([#215](https://github.com/paritytech/Nomidot/issues/215)) ([c26ac08](https://github.com/paritytech/Nomidot/commit/c26ac08b7fc59fd9df5d34167d5cb44b230bbce3))
* **gatsby:** make master build for Netlify ([#201](https://github.com/paritytech/Nomidot/issues/201)) ([6bdda24](https://github.com/paritytech/Nomidot/commit/6bdda24e183df95805ac801dcae65bce62748a6c))





## [0.3.21](https://github.com/paritytech/Nomidot/compare/v0.3.20...v0.3.21) (2020-02-21)


### Bug Fixes

* **#165:** nested query resolvers ([#168](https://github.com/paritytech/Nomidot/issues/168)) ([8912c99](https://github.com/paritytech/Nomidot/commit/8912c990e896cf90b63a6ecce86289fbfd7fc62d)), closes [#165](https://github.com/paritytech/Nomidot/issues/165)
* **#173:** unwrap none ([#174](https://github.com/paritytech/Nomidot/issues/174)) ([6d25f44](https://github.com/paritytech/Nomidot/commit/6d25f44252240d9008f8fab012b890e76414e4cd)), closes [#173](https://github.com/paritytech/Nomidot/issues/173)
* **context:** Create a new {Api,System}Context on new provider ([#196](https://github.com/paritytech/Nomidot/issues/196)) ([2270a25](https://github.com/paritytech/Nomidot/commit/2270a25600ee2d6bb4a301e08b45a21db543e44d))
* update images ([#171](https://github.com/paritytech/Nomidot/issues/171)) ([1548a46](https://github.com/paritytech/Nomidot/commit/1548a46969b4f6d79c4bdb2c4cc2799805f3ab91))


### Features

* decoding SCALE hex, query then subscribe, Validators List ([#182](https://github.com/paritytech/Nomidot/issues/182)) ([d564059](https://github.com/paritytech/Nomidot/commit/d5640595b9765516d9f799059c05a9139db06d9f))
* **#141:** heartbeats, offline, nominations, rewards, stakes ([#157](https://github.com/paritytech/Nomidot/issues/157)) ([05325db](https://github.com/paritytech/Nomidot/commit/05325dbecafd4f6b64e087c1e837b6d6616bdc2f)), closes [#141](https://github.com/paritytech/Nomidot/issues/141)
* **#179:** subscribing to heads ([#181](https://github.com/paritytech/Nomidot/issues/181)) ([8c702d1](https://github.com/paritytech/Nomidot/commit/8c702d1d9c59fd4d4eb77c0e07b582bd94be3150)), closes [#179](https://github.com/paritytech/Nomidot/issues/179)
* **node-watcher:** Store motions in chain-db ([#159](https://github.com/paritytech/Nomidot/issues/159)) ([8657b9b](https://github.com/paritytech/Nomidot/commit/8657b9bacc362548d20953bf42b5e066ac92d90e))
* **node-watcher:** Write motion status ([#162](https://github.com/paritytech/Nomidot/issues/162)) ([a686485](https://github.com/paritytech/Nomidot/commit/a686485d603d32f4d8d3bd1afdc1bc66e9f4af3d))
* **server:** Polkassembly chain-db server ([#156](https://github.com/paritytech/Nomidot/issues/156)) ([5729220](https://github.com/paritytech/Nomidot/commit/57292208968c0c67abdbe289b8be847c869faa4b))
* header ui with design-system ([#178](https://github.com/paritytech/Nomidot/issues/178)) ([f85774b](https://github.com/paritytech/Nomidot/commit/f85774b45e4ce116cfc64269a8da5df05a0c6edd))
* subscription resolvers for stake, heartbeats, offline ([#180](https://github.com/paritytech/Nomidot/issues/180)) ([98be255](https://github.com/paritytech/Nomidot/commit/98be25590e1781b6118fd7c77fcf61205f57c0f8))





## [0.3.20](https://github.com/paritytech/Nomidot/compare/v0.3.19...v0.3.20) (2020-02-11)


### Bug Fixes

* dont allow package-lock.json into git ([#152](https://github.com/paritytech/Nomidot/issues/152)) ([573ca95](https://github.com/paritytech/Nomidot/commit/573ca95b44d769def87952625b93d0308ee35cd6))
* referendum statuses not updated ([#150](https://github.com/paritytech/Nomidot/issues/150)) ([acc3578](https://github.com/paritytech/Nomidot/commit/acc3578aec7602c0fc2cf3f00721dde57697c11d))
* Remove useless stuff from context & ui-components ([#161](https://github.com/paritytech/Nomidot/issues/161)) ([99466a7](https://github.com/paritytech/Nomidot/commit/99466a7a7d012326d8d536f848ac31f75ed7812d))


### Features

* apollo client and provider ([#146](https://github.com/paritytech/Nomidot/issues/146)) ([47da1b9](https://github.com/paritytech/Nomidot/commit/47da1b9f01f04ca68cb80e731ad24fc4768753ea))





## [0.3.19](https://github.com/paritytech/Nomidot/compare/v0.3.18...v0.3.19) (2020-02-06)


### Bug Fixes

* **ui-components:** Stateless InputAddress ([#145](https://github.com/paritytech/Nomidot/issues/145)) ([eaa2487](https://github.com/paritytech/Nomidot/commit/eaa248746ebec98653349c463b8f9dbdfb21e267))


### Features

* nomidot-server k8s ([#144](https://github.com/paritytech/Nomidot/issues/144)) ([8135d0e](https://github.com/paritytech/Nomidot/commit/8135d0e311bbb8f434fafd48b9b0deec1ffbe46a))





## [0.3.18](https://github.com/paritytech/Nomidot/compare/v0.3.17...v0.3.18) (2020-02-05)


### Bug Fixes

* **context:** Also poll on system.health ([#142](https://github.com/paritytech/Nomidot/issues/142)) ([5033189](https://github.com/paritytech/Nomidot/commit/50331893d0175dfbe940c22a4d66bbf7867541be))


### Features

* all server queries and chain header, new session subscription resolvers ([#138](https://github.com/paritytech/Nomidot/issues/138)) ([16dd1b8](https://github.com/paritytech/Nomidot/commit/16dd1b8086fa3e5d6a5279ebb0e9b6ebd33ec419))
* subscription resolvers ([#140](https://github.com/paritytech/Nomidot/issues/140)) ([9136d41](https://github.com/paritytech/Nomidot/commit/9136d41c6b8d8af6792b4b542ea6a687b272e9e4)), closes [#106](https://github.com/paritytech/Nomidot/issues/106) [#129](https://github.com/paritytech/Nomidot/issues/129) [#133](https://github.com/paritytech/Nomidot/issues/133) [#126](https://github.com/paritytech/Nomidot/issues/126) [#125](https://github.com/paritytech/Nomidot/issues/125) [#137](https://github.com/paritytech/Nomidot/issues/137) [#136](https://github.com/paritytech/Nomidot/issues/136)





## [0.3.17](https://github.com/paritytech/Nomidot/compare/v0.3.16...v0.3.17) (2020-02-05)


### Bug Fixes

*  [#125](https://github.com/paritytech/Nomidot/issues/125) - createReferendumStatus ([#126](https://github.com/paritytech/Nomidot/issues/126)) ([3640284](https://github.com/paritytech/Nomidot/commit/36402843a4d2192c2e2e4d1b3a1b06da59be2103))
* [#126](https://github.com/paritytech/Nomidot/issues/126) fix: [#125](https://github.com/paritytech/Nomidot/issues/125) ([#137](https://github.com/paritytech/Nomidot/issues/137)) ([6166ef6](https://github.com/paritytech/Nomidot/commit/6166ef621b99b60f96c11be5a2bd19f53ffa7ab1))
* **#77:** back/server eslint errors ([#124](https://github.com/paritytech/Nomidot/issues/124)) ([79538d7](https://github.com/paritytech/Nomidot/commit/79538d72be0b8c489f4af0a6a45cdb926eb89963)), closes [#77](https://github.com/paritytech/Nomidot/issues/77)
* make nodewatcher sync again ([#121](https://github.com/paritytech/Nomidot/issues/121)) ([59b2069](https://github.com/paritytech/Nomidot/commit/59b2069e0348f6b942444c8bc6a178c59f5a9c9b))


### Features

* **gatsby:** Inject accounts into header ([#136](https://github.com/paritytech/Nomidot/issues/136)) ([b095c3c](https://github.com/paritytech/Nomidot/commit/b095c3c8eb77197da2eb672deee2f65ae55459c4))





## [0.3.16](https://github.com/paritytech/Nomidot/compare/v0.3.15...v0.3.16) (2020-01-30)

**Note:** Version bump only for package nomidot





## [0.3.15](https://github.com/paritytech/Nomidot/compare/v0.3.14...v0.3.15) (2020-01-28)


### Bug Fixes

* image and k8 for recent fixes ([#110](https://github.com/paritytech/Nomidot/issues/110)) ([a082533](https://github.com/paritytech/Nomidot/commit/a0825330738f764e30fb418d2324e50c7a7ffdaf))
* **node-watcher:** Override with chain types ([#104](https://github.com/paritytech/Nomidot/issues/104)) ([ae0ff5d](https://github.com/paritytech/Nomidot/commit/ae0ff5d282860c94cc369b3d0c3eb9047e2492e2))
* docker ([#99](https://github.com/paritytech/Nomidot/issues/99)) ([673a21b](https://github.com/paritytech/Nomidot/commit/673a21b894b52a881e76cb92057266122bfa4cea))
* k8s poststart hook, add back api to nodewatcher ([#102](https://github.com/paritytech/Nomidot/issues/102)) ([dc5135e](https://github.com/paritytech/Nomidot/commit/dc5135e95eb63fd4d8e1b451ff16f1dcb40ac056))


### Features

* **context:** Add HealthContext ([#114](https://github.com/paritytech/Nomidot/issues/114)) ([0fd0f8a](https://github.com/paritytech/Nomidot/commit/0fd0f8a2bf28d4e3f28f518472567bbc905ef0e7))
* Separate preimage from proposal ([#96](https://github.com/paritytech/Nomidot/issues/96)) ([c285d3e](https://github.com/paritytech/Nomidot/commit/c285d3edfd3e827707914106eb4fc093e6b6b094))
* **node-watcher:** Create proposal and proposalArguments ([#86](https://github.com/paritytech/Nomidot/issues/86)) ([7a20a09](https://github.com/paritytech/Nomidot/commit/7a20a09748f4efbc21a4dfdf4baadfd6e60dba9f))





## [0.3.14](https://github.com/paritytech/Nomidot/compare/v0.3.13...v0.3.14) (2020-01-09)


### Bug Fixes

* back to tsnode ([86d3b91](https://github.com/paritytech/Nomidot/commit/86d3b91710ed937474d079adf5a65bc1f1593656))


### Features

* Make ApiRxContext take a `provider` prop ([#84](https://github.com/paritytech/Nomidot/issues/84)) ([a5bcfaa](https://github.com/paritytech/Nomidot/commit/a5bcfaab28198356fb0e9050c8cb791ae862dad7))





## [0.3.13](https://github.com/paritytech/Nomidot/compare/v0.3.12...v0.3.13) (2020-01-09)


### Bug Fixes

* build and run the transpiled index.js for prod ([#81](https://github.com/paritytech/Nomidot/issues/81)) ([2bfb1c6](https://github.com/paritytech/Nomidot/commit/2bfb1c6ae0ef34eb7dd94637868da0ef6c9069e9))





## [0.3.12](https://github.com/paritytech/Nomidot/compare/v0.3.11...v0.3.12) (2020-01-07)


### Bug Fixes

* Input Address bug ([#72](https://github.com/paritytech/Nomidot/issues/72)) ([01652b0](https://github.com/paritytech/Nomidot/commit/01652b0dcc672b343287aaf3ca3e508943da9ba6))





# [0.3.0](https://github.com/paritytech/Nomidot/compare/v0.2.4...v0.3.0) (2020-01-02)


### Bug Fixes

* linting errors ([#51](https://github.com/paritytech/Nomidot/issues/51)) ([15c30a6](https://github.com/paritytech/Nomidot/commit/15c30a6814e9180feea9c695701ca58a2c2fce49))
* package names and versions ([#52](https://github.com/paritytech/Nomidot/issues/52)) ([402130f](https://github.com/paritytech/Nomidot/commit/402130f75469d75224a7419b53c682e08764e1d4))
* spec version ([#35](https://github.com/paritytech/Nomidot/issues/35)) ([577a5dd](https://github.com/paritytech/Nomidot/commit/577a5ddfa1fcec80249c9f2a050b897443034cdc))
* Sync from tip ([#34](https://github.com/paritytech/Nomidot/issues/34)) ([82d982b](https://github.com/paritytech/Nomidot/commit/82d982b47dc33d52ff4be08de527219987a9e9a8))
* validator thing ([#36](https://github.com/paritytech/Nomidot/issues/36)) ([50e1444](https://github.com/paritytech/Nomidot/commit/50e144479b6ecfe9e52f29714823bf460d7b3b00))


### Features

* deployment scripts for server ([#48](https://github.com/paritytech/Nomidot/issues/48)) ([6a3e24c](https://github.com/paritytech/Nomidot/commit/6a3e24c9997595fba61bb0e617b9a761e523a57a))
* Prisma Server to watch a node ([#24](https://github.com/paritytech/Nomidot/issues/24)) ([ded1fc3](https://github.com/paritytech/Nomidot/commit/ded1fc3114200952d0aa12acc0b3bb6b42601960)), closes [#29](https://github.com/paritytech/Nomidot/issues/29) [#30](https://github.com/paritytech/Nomidot/issues/30) [#31](https://github.com/paritytech/Nomidot/issues/31)





## [0.2.4](https://github.com/paritytech/Nomidot/compare/v0.2.3...v0.2.4) (2019-11-26)


### Bug Fixes

* Allow importing without src/ directory ([#26](https://github.com/paritytech/Nomidot/issues/26)) ([175d1fd](https://github.com/paritytech/Nomidot/commit/175d1fd0541191516f44986c23c5c0ae816015ec))





## [0.2.3](https://github.com/paritytech/Nomidot/compare/v0.2.2...v0.2.3) (2019-11-26)


### Bug Fixes

* Fix various little bugs ([#23](https://github.com/paritytech/Nomidot/issues/23)) ([24969fc](https://github.com/paritytech/Nomidot/commit/24969fc2fcd46456b94f4077859b9ae5632a24b4))





## [0.2.2](https://github.com/paritytech/Nomidot/compare/v0.2.1...v0.2.2) (2019-11-21)


### Bug Fixes

* Add forgotten Dropdown in ui-components ([#22](https://github.com/paritytech/Nomidot/issues/22)) ([783300d](https://github.com/paritytech/Nomidot/commit/783300dc0328683b457eedc068b635b608869911))





## [0.2.1](https://github.com/paritytech/Nomidot/compare/v0.2.0...v0.2.1) (2019-11-20)

**Note:** Version bump only for package nomidot





# [0.2.0](https://github.com/paritytech/Nomidot/compare/v0.1.5...v0.2.0) (2019-11-18)


### Bug Fixes

* add funciton return types ([9da2ba9](https://github.com/paritytech/Nomidot/commit/9da2ba98ffdf89de5593696af868766340cf2084))
* move get injected into useeffect ([4781c80](https://github.com/paritytech/Nomidot/commit/4781c804dc8b8702b62facf5476a5996e59bb8ae))
* onboarding styles and other good stuff ([6c0dcea](https://github.com/paritytech/Nomidot/commit/6c0dcea7f6f4e81d9398dc177176dbfe1f34545b))
* ready async ([27d1e72](https://github.com/paritytech/Nomidot/commit/27d1e72f4e1fc8334ddfbbfbb940a8f59d9ad473))
* remove keyring from context ([1234dac](https://github.com/paritytech/Nomidot/commit/1234dac333971c6619b60e64b6a6a9b9f5b16b70))
* split up contexts, move context gate to gatsby, drop keyring ([3f22b2a](https://github.com/paritytech/Nomidot/commit/3f22b2a72c297f2a5e4cff3b9ba22b60bb9e9009))


### Features

* add eslint and remove unnecessary components ([5034358](https://github.com/paritytech/Nomidot/commit/5034358371f91720889a8d21d808621ba2bbec34))
* gatsby routing ([5e2bfb5](https://github.com/paritytech/Nomidot/commit/5e2bfb58a2ee517135f4210ef8523d453fb015f1))
* get and format injected accounts ([ae5deae](https://github.com/paritytech/Nomidot/commit/ae5deae12932b27e4358705f3b65a1acbc7d1b81))
* Github Workflow for Lint on PR ([#11](https://github.com/paritytech/Nomidot/issues/11)) ([12f9f41](https://github.com/paritytech/Nomidot/commit/12f9f41a222ed3b1855d7dcbceede65796e36c22))





<a name="0.1.5"></a>
## [0.1.5](https://github.com/paritytech/Nomidot/compare/v0.1.3...v0.1.5) (2019-11-12)


### Bug Fixes

* Make lerna publish work ([#6](https://github.com/paritytech/Nomidot/issues/6)) ([f040c9a](https://github.com/paritytech/Nomidot/commit/f040c9a))





# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.4](https://github.com/paritytech/Nomidot/compare/v0.1.3...v0.1.4) (2019-11-12)


### Bug Fixes

* Make lerna publish work ([e206eab](https://github.com/paritytech/Nomidot/commit/e206eab12844a1e32005d9954d11d3239de6c53b))





## [0.1.3](https://github.com/paritytech/Nomidot/compare/v0.1.2...v0.1.3) (2019-11-11)

**Note:** Version bump only for package nomidot





## [0.1.2](https://github.com/paritytech/Nomidot/compare/v0.1.1...v0.1.2) (2019-11-11)

**Note:** Version bump only for package nomidot





## 0.1.1 (2019-11-11)


### Bug Fixes

* start script ([2763ca0](https://github.com/paritytech/Nomidot/commit/2763ca00881e09439ebb222d0f4395412b78a3fa))
* types and lerna scripts ([e52f0fe](https://github.com/paritytech/Nomidot/commit/e52f0feeb5d2a2a8008c34372af189bdda41cff4))


### Features

* add ui-common, uic-omponents ([ff3480d](https://github.com/paritytech/Nomidot/commit/ff3480d914329dbe9a44b6188095465fdec76137))
* lerna ([4af1434](https://github.com/paritytech/Nomidot/commit/4af14342de7c145c164640f17993f11c06244e2c))
