# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.23](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.22...v0.0.23) (2022-08-10)


### Bug Fixes

* better logging ([2d50acc](https://github.com/WandersonAlves/yeelight-manager/commit/2d50accfa8ac697989f4310abab059639c55f0bd))
* better logging on ambilight ([9fcf6fa](https://github.com/WandersonAlves/yeelight-manager/commit/9fcf6fa78b6c8a29bd6d82b6fd0f11ca31d59ed7))
* validate setx cmd; better documentation about it ([67d2ff3](https://github.com/WandersonAlves/yeelight-manager/commit/67d2ff34ed7833249d0ac4851feaaf8bece15f85))

### [0.0.22](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.21...v0.0.22) (2022-03-24)


### Bug Fixes

* add more info to cli cmd ([241b1ff](https://github.com/WandersonAlves/yeelight-manager/commit/241b1ffb7bff3f31574ec77b4af75bde96287a8f))

### [0.0.21](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.20...v0.0.21) (2022-03-24)


### Bug Fixes

* show version number ([4eeed50](https://github.com/WandersonAlves/yeelight-manager/commit/4eeed5009c54e7218ecdbe2ab8dbca39831a695e))

### [0.0.20](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.19...v0.0.20) (2022-03-24)


### Bug Fixes

* order device names on list cmd ([76d7a5b](https://github.com/WandersonAlves/yeelight-manager/commit/76d7a5ba5838ee167b3a8f50d1d4e383af003f2b))
* power on device on ct, bright and color cmds ([7f84b1f](https://github.com/WandersonAlves/yeelight-manager/commit/7f84b1fb81c6ad1996ded9c61cfea9d4b383ea5d))

### [0.0.19](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.18...v0.0.19) (2022-03-02)


### Bug Fixes

* only show device table if devices was found ([8a1990f](https://github.com/WandersonAlves/yeelight-manager/commit/8a1990fc3e39de5e900395d1cded0197d7e7e405))

### [0.0.18](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.17...v0.0.18) (2022-02-03)


### Bug Fixes

* exit program when a load cmd fails ([197c64f](https://github.com/WandersonAlves/yeelight-manager/commit/197c64f78c5cb8b620cb2806389c692a0865b106))

### [0.0.17](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.16...v0.0.17) (2022-02-02)


### Features

* add load --list cmd ([6403610](https://github.com/WandersonAlves/yeelight-manager/commit/6403610565846be8cc9120e33c171437dacbec6a))

### [0.0.16](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.15...v0.0.16) (2022-01-31)


### Bug Fixes

* saved setx file location ([9d5e017](https://github.com/WandersonAlves/yeelight-manager/commit/9d5e01796ac2e61bb5bb59c23f8351c7666c741e))

### [0.0.15](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.14...v0.0.15) (2022-01-31)


### Bug Fixes

* add DOM to tsconfig ([f951ccd](https://github.com/WandersonAlves/yeelight-manager/commit/f951ccdf35978d3059d879e7dea5e79988a50357))

### [0.0.14](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.13...v0.0.14) (2022-01-31)


### Features

* add 'setx' and 'load' cmds ([bd659a8](https://github.com/WandersonAlves/yeelight-manager/commit/bd659a8ce5e187b5d74a2e07854662bc5e88ef2b))
* better table on discovery ([de2dcac](https://github.com/WandersonAlves/yeelight-manager/commit/de2dcac03b15613183f0d1e6a79b385357a53b8f))
* use cli-table to show devices on discovery ([5d6b566](https://github.com/WandersonAlves/yeelight-manager/commit/5d6b566e91f6ac21fe5dec28b5b37fb06994b37f))


### Bug Fixes

* add flow to CommandList ([1fb238d](https://github.com/WandersonAlves/yeelight-manager/commit/1fb238db7ac5bceb68a7d05f04c1868fe02898b5))
* add flow to YeelightDevice ([eaa6655](https://github.com/WandersonAlves/yeelight-manager/commit/eaa6655219e3ae1b74394cc910ce752bd495b14e))
* device connection on ReceiveCommandCase ([b381644](https://github.com/WandersonAlves/yeelight-manager/commit/b381644f9fd6bc1a6456770d251635998248c0f0))
* logging error when devices can't be found ([9250382](https://github.com/WandersonAlves/yeelight-manager/commit/925038208a97ff991d481765303e76da0077ce30))

### [0.0.13](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.12...v0.0.13) (2021-10-01)


### Features

* show some stats when list ([dc2274a](https://github.com/WandersonAlves/yeelight-manager/commit/dc2274abd47c2c468432957d793ef379096dcb4c))


### Bug Fixes

* accepts devices by ip,name,id on ReceiveCommandCase ([7d67854](https://github.com/WandersonAlves/yeelight-manager/commit/7d6785400732608851b82505df60486cd7627fca))

### [0.0.11](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.9...v0.0.11) (2021-07-08)


### Features

* commands now accept multiple devices ([a2bb9aa](https://github.com/WandersonAlves/yeelight-manager/commit/a2bb9aaf386c4c33c1d08cf20c683ad4b04d31d2))


### Bug Fixes

* move SIGINT to start on Ambilight ([731d9c7](https://github.com/WandersonAlves/yeelight-manager/commit/731d9c7e3c793f3ece4528f30dc90bc84f912f85))

### [0.0.9](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.8...v0.0.9) (2021-06-29)

### [0.0.8](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.7...v0.0.8) (2021-06-29)


### Features

* ambilight fetchs ip automatically ([18d0610](https://github.com/WandersonAlves/yeelight-manager/commit/18d06103bd0428e52c9ba784de58c14ef086f6a9))


### Bug Fixes

* remove release from prepublish ([4d74638](https://github.com/WandersonAlves/yeelight-manager/commit/4d74638eb774dacb553bab9f92ef828bc8eb1c7f))

### [0.0.7](https://github.com/WandersonAlves/yeelight-manager/compare/v0.0.6...v0.0.7) (2021-06-29)

### 0.0.6 (2021-06-29)


### Features

* add alias to ct cmd ([c8cb6a5](https://github.com/WandersonAlves/yeelight-manager/commit/c8cb6a524978625b602f45369bcc369867a41d80))
* add ambilight cmd ([74ba876](https://github.com/WandersonAlves/yeelight-manager/commit/74ba876edeb69cffde5c6130b95bae721453f0cd))
* add ambilight command ([65ced6c](https://github.com/WandersonAlves/yeelight-manager/commit/65ced6c09917ca2a4d3eca1884457f312307b087))
* add auto reconnect ([e7ad9b6](https://github.com/WandersonAlves/yeelight-manager/commit/e7ad9b61c16e463457d22ac821b4b1b342e2512a))
* add blink command ([5ada1c7](https://github.com/WandersonAlves/yeelight-manager/commit/5ada1c748f2b6f05f7d15b9a16a2f6848f12a924))
* add bright command; change names ([75e6d64](https://github.com/WandersonAlves/yeelight-manager/commit/75e6d64c4a73d0363d96afb8f07c69fba82241a9))
* add CLI support ([859813e](https://github.com/WandersonAlves/yeelight-manager/commit/859813ee411eadfda5b4dba31bae33e15eef3a3d))
* add color temperature cmd; better logging ([c538ec7](https://github.com/WandersonAlves/yeelight-manager/commit/c538ec7e51a55e22dfbe9e652aa89ecc1bada01c))
* add debug flag; configure commands helper ([59aa8b4](https://github.com/WandersonAlves/yeelight-manager/commit/59aa8b414c11947bbbbf8c81643c306768072436))
* add ip scan method to retrieve devices ([4c4a29c](https://github.com/WandersonAlves/yeelight-manager/commit/4c4a29c15e3fc13421bfd3a49c6442af465c6a12))
* add list cmd; add waitTime option; cmds dont need server running ([7e901be](https://github.com/WandersonAlves/yeelight-manager/commit/7e901bee04b504a461c18f01dd86caa7459dc30f))
* add Logs cmd ([e77ce33](https://github.com/WandersonAlves/yeelight-manager/commit/e77ce338fb6b5053fdba91746494b535939cc87b))
* add name and rgb commands ([7cb7a0d](https://github.com/WandersonAlves/yeelight-manager/commit/7cb7a0d1c0eca7b58493f92d8c3d156b4fe78db1))
* add ReceiveCommandCase ([094f411](https://github.com/WandersonAlves/yeelight-manager/commit/094f411b5681dadce8d6ed32da2a523f871a3d7f))
* add RetrieveDevice route ([4daab9d](https://github.com/WandersonAlves/yeelight-manager/commit/4daab9dc770a3bfc1fccdad087b216ef38095d4a))
* add Scene route ([2e20106](https://github.com/WandersonAlves/yeelight-manager/commit/2e20106d3ab6da111d1e83b88fb1084ac3a67bb2))
* add support for named colors ([e2d6a8f](https://github.com/WandersonAlves/yeelight-manager/commit/e2d6a8f6e67d154021263af0f4631a1dd0dbe1d1))
* add toggle cmd ([4880c0b](https://github.com/WandersonAlves/yeelight-manager/commit/4880c0b9297e7c08d958c41866533ac735ce4b16))
* allow bright to be changed within cmds ([92d6c93](https://github.com/WandersonAlves/yeelight-manager/commit/92d6c93441e6213c7a867fad4756d3c480bd9241))
* allow to find device by name too ([7ada6b1](https://github.com/WandersonAlves/yeelight-manager/commit/7ada6b1096b22a00d6fdc0e45b7bc4c8b882c5a8))
* auto discovery on start-up ([bc00be4](https://github.com/WandersonAlves/yeelight-manager/commit/bc00be4d4deb999724b2ca78351da1ef163ac5b2))
* connect to all devices on first run ([d7cbb28](https://github.com/WandersonAlves/yeelight-manager/commit/d7cbb2882c606e4ca9b2bae4cd077349f749f196))
* first commit :rocket: ([bec1a23](https://github.com/WandersonAlves/yeelight-manager/commit/bec1a23b06d607de9eaccc1d6971ab615507a6c5))
* get brightness in screenshot ([af9fb43](https://github.com/WandersonAlves/yeelight-manager/commit/af9fb43acf3b51198cff5cd7885b52676b006fbf))
* power cmd ([7d6fcee](https://github.com/WandersonAlves/yeelight-manager/commit/7d6fcee04537f9c28101432de3cff9fbdc890fa0))
* prepare to release ([b622575](https://github.com/WandersonAlves/yeelight-manager/commit/b622575f6593c7e5c90b8570e0f017d75964fe36))
* really first commit :rocket: ([5d4bea4](https://github.com/WandersonAlves/yeelight-manager/commit/5d4bea4addbd477e19e99684658a458279e0b9e9))
* toggle device when command arrive ([e818af8](https://github.com/WandersonAlves/yeelight-manager/commit/e818af8ba7cfba8568f94c1c0842c38d6789f13a))
* use event to keep object updated ([d40d49d](https://github.com/WandersonAlves/yeelight-manager/commit/d40d49df00a7929c0f4bb1f479ec6bc9c254bcd8))


### Bug Fixes

* add ct support on changeEvent ([741b26e](https://github.com/WandersonAlves/yeelight-manager/commit/741b26e9fe2f7b00986d89357713b9eb58255761))
* add http to axios post ([4cfe280](https://github.com/WandersonAlves/yeelight-manager/commit/4cfe28028dcefbdef5824067d2a0508c7d7000d5))
* ambilight promise await ([388753a](https://github.com/WandersonAlves/yeelight-manager/commit/388753acc64d8151f61d612cd7e2b440a7686e8b))
* better logging ([84a3e2a](https://github.com/WandersonAlves/yeelight-manager/commit/84a3e2ad2447867d9c27ebc5a0f5a4f9f01e7ed4))
* better logging of events ([1a0b5ba](https://github.com/WandersonAlves/yeelight-manager/commit/1a0b5baeef3b60b25b64d9e5bd887456f0953b94))
* change interval of ambilight ([41cf80e](https://github.com/WandersonAlves/yeelight-manager/commit/41cf80e9ff7c079300f0da599fe0d1e099f7360f))
* change npmignore ([fe1014a](https://github.com/WandersonAlves/yeelight-manager/commit/fe1014a05c7a70e3fb8215956cb09e979321ea7a))
* don't been able to see complete logs ([5100f33](https://github.com/WandersonAlves/yeelight-manager/commit/5100f3313aba21a2e01737d3a8c95c908a480764))
* ffmpeg broken cmd ([d67dedb](https://github.com/WandersonAlves/yeelight-manager/commit/d67dedb625899691fee2b370772dbaf2082cfd3f))
* ignore lib folder ([842b7dc](https://github.com/WandersonAlves/yeelight-manager/commit/842b7dc9a854ea092c868005d6388c8cdd8f389a))
* increase discovery time ([b8f0935](https://github.com/WandersonAlves/yeelight-manager/commit/b8f0935e7c8c522dac5cfdc111a191b57f7bb2d3))
* invalid commands ([9e58f2c](https://github.com/WandersonAlves/yeelight-manager/commit/9e58f2c2f8f11e6a10863447a771971b4984c8e1))
* invalid date on logger ([b42b231](https://github.com/WandersonAlves/yeelight-manager/commit/b42b231a2c503709599626b4c51b39060df11a73))
* log location and log reset ([79dfd40](https://github.com/WandersonAlves/yeelight-manager/commit/79dfd40b0b0c22aee871a31236d8731ad2a2b930))
* logger starts at info level ([99c9b13](https://github.com/WandersonAlves/yeelight-manager/commit/99c9b1330894ddd343963e1b6b58a24c9449c8ea))
* make value required ([1c94875](https://github.com/WandersonAlves/yeelight-manager/commit/1c948758869bd34888132db00c320fa34ad00d45))
* minor changes ([ef7ca4e](https://github.com/WandersonAlves/yeelight-manager/commit/ef7ca4eb043918939719770de8631204e944d6b1))
* power command now uses 9999 id ([c7d5061](https://github.com/WandersonAlves/yeelight-manager/commit/c7d50618fd42182e136698ff65424bbce30eab94))
* remove bright header when undefined ([ee28456](https://github.com/WandersonAlves/yeelight-manager/commit/ee28456e093a3c1d4a8c1251842469ca6681ce9c))
* rename ct on CommandList ([4f0f394](https://github.com/WandersonAlves/yeelight-manager/commit/4f0f394000552fb08dc0af02a2632b09f706c720))
* show more details to user when cmd fails ([0c44952](https://github.com/WandersonAlves/yeelight-manager/commit/0c44952f25fbc49183beb1fe7a7eeb236f329464))
* vibrant-node build ([0805b42](https://github.com/WandersonAlves/yeelight-manager/commit/0805b4216cdb536855ac309a23c90ab62b437df9))
