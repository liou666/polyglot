# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.1](https://github.com/liou666/polyglot/compare/v0.2.0...v0.2.1) (2023-05-08)


### Features

* audio support record ([#29](https://github.com/liou666/polyglot/issues/29)) ([1235b52](https://github.com/liou666/polyglot/commit/1235b529817d1ac4900262d87f2add5892e6888f))
* custom system prompt ([#21](https://github.com/liou666/polyglot/issues/21)) ([31c2e9b](https://github.com/liou666/polyglot/commit/31c2e9bc93261cca4b50291a819516c9a0063e61))


### Bug Fixes

* 新建角色后语音识别快捷键失效 ([9ec0a4b](https://github.com/liou666/polyglot/commit/9ec0a4b39af2e5b887ff45308cadf4e22b887750))
* change input keyup to keypress ([#37](https://github.com/liou666/polyglot/issues/37)) ([0674a39](https://github.com/liou666/polyglot/commit/0674a398bd61036d0caf47bc35dc0a482cd58dd8))
* tap voice in play to end playback ([#14](https://github.com/liou666/polyglot/issues/14)) ([#38](https://github.com/liou666/polyglot/issues/38)) ([6d6cf10](https://github.com/liou666/polyglot/commit/6d6cf108659f4330f07b5bc9c629d355c6e2eadd))

# [0.2.0](https://github.com/liou666/polyglot/compare/v0.1.1...v0.2.0) (2023-04-27)


### Bug Fixes

* 播放期间不允许再次点击语音 ([7e51d57](https://github.com/liou666/polyglot/commit/7e51d578489185965e99f46d74123aaf6da7a825))
* 默认角色不允许删除 ([14e2765](https://github.com/liou666/polyglot/commit/14e2765638968c3fb0741fd14bd916a6141749ab))
* 切换角色时语音播放异常 ([ae7dc9e](https://github.com/liou666/polyglot/commit/ae7dc9e1da90848cdd381d49d30ed3d9684f178e))
* 语音识别不完整 ([d4a4083](https://github.com/liou666/polyglot/commit/d4a4083194ee8fae5a94ccd76d2c8e0c98d6bf8e))
* debounce getvoice ([73d13dd](https://github.com/liou666/polyglot/commit/73d13ddf95371fdc6d4db9f345fd508281155631))


### Features

* 兼容api2d接口 close [#11](https://github.com/liou666/polyglot/issues/11) ([b458d35](https://github.com/liou666/polyglot/commit/b458d35483f3c3b01159c51e94cb57797b4d9fcf))
* 数据持久化，头像支持自定义 ([#10](https://github.com/liou666/polyglot/issues/10)) ([09c66c1](https://github.com/liou666/polyglot/commit/09c66c17373f73c99273e691bc99ec10ee72c542))
* 头像自定义上传 ([ad9854e](https://github.com/liou666/polyglot/commit/ad9854e7df9a8129447d6f6f9199ef0b3387a160))
* 语音增加预览功能 ([#12](https://github.com/liou666/polyglot/issues/12)) ([a663a6b](https://github.com/liou666/polyglot/commit/a663a6bee6149a1af6f1966a7ea46173c6be6686))
* 增加语音识别快捷键 ([#9](https://github.com/liou666/polyglot/issues/9)) ([42a0d02](https://github.com/liou666/polyglot/commit/42a0d0253bc4109fceeffa619bcd3a04ab3d6b33))
* about page ([fb10ff0](https://github.com/liou666/polyglot/commit/fb10ff005fab597b2ce494b9443951266b01852d))
* autoupdate ([3657933](https://github.com/liou666/polyglot/commit/3657933a07d55d86d3bb507a29f2cb585ecdbde4))
* **wip:** 头像上传 ([16cb505](https://github.com/liou666/polyglot/commit/16cb5050b3cf3f6451f116908160ff8cbc9f79d5))



# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.1](https://github.com/liou666/polyglot/compare/v0.0.0...v0.1.1) (2023-04-15)


### Features

* 封装弹窗组件 ([2afa8d8](https://github.com/liou666/polyglot/commit/2afa8d8537d438c5830cb00ef96c9b78c05361be))
* 根据人物显示标题 ([fc0641c](https://github.com/liou666/polyglot/commit/fc0641cc1cd43723ea1e2a25d5de6431f667891c))
* 添加对话 ([1fbb9f3](https://github.com/liou666/polyglot/commit/1fbb9f38f76af620b9e3b9b2e20c0473d8879061))
* 语音合成 翻译 增加loading ([23965d5](https://github.com/liou666/polyglot/commit/23965d556e92258c3c40ab561fd647fa882f7df2))
* 增加删除逻辑与公共配置 ([47f5b09](https://github.com/liou666/polyglot/commit/47f5b09fe414c6fbc4df9171a68adf9f4fe238e7))
* 增加文本翻译功能 ([028c02e](https://github.com/liou666/polyglot/commit/028c02ec018965f7fc83ce4bcc974112120fd36b))
* 增加azure语言映射表 ([dbbf61d](https://github.com/liou666/polyglot/commit/dbbf61d5bdcbe597be282edc7797da1ab46cd180))
* 支持设置语速 ([d54a12e](https://github.com/liou666/polyglot/commit/d54a12e360aaaade04e361ccccf8f20b1cd4fefd))
* 自定义对话 ([e9cad94](https://github.com/liou666/polyglot/commit/e9cad944c7fb2c4181fb5a840b68553230a407d7))


### Bug Fixes

* 新建对话后跳转到当前对话 ([d1060f9](https://github.com/liou666/polyglot/commit/d1060f9787b63a0cca377b0d91bcebabdcfefd7c))
* loading 时机调整 ([386af51](https://github.com/liou666/polyglot/commit/386af51c5d5260c039008401d9f1efa84c66c8bc))
* Mac系统增加访问权限 ([52d85a7](https://github.com/liou666/polyglot/commit/52d85a75c2176d8664f6b1e3471124397da36de5))

## 0.0.0 (2023-04-03)


### Features

* access the azure voice system ([8daad6c](https://github.com/liou666/polyglot/commit/8daad6c783fa16c7ee5624d5420286affc9c6b25))
* base layout ([c4461ce](https://github.com/liou666/polyglot/commit/c4461ce60c6a7da564e9ded8a556b7b975a2a8d3))
* card style and input keyup ([f77d3b1](https://github.com/liou666/polyglot/commit/f77d3b12781e1375026ca35b64aa9e468bc797b4))
* improve chat , ui and prompt ([8ef806d](https://github.com/liou666/polyglot/commit/8ef806d9ebe09917a638c50a6cc12d2d17b6236e))
* nav style dark mode ([829bfac](https://github.com/liou666/polyglot/commit/829bfacdbf474ac4f23576bbccd7e0bccfa5b459))
* open proxy ([b815b8e](https://github.com/liou666/polyglot/commit/b815b8e3443d81d1ca34fae55b59539fac15f1ce))
* openai api ([a898eca](https://github.com/liou666/polyglot/commit/a898eca4f6e631ce68f59137bb34bad5aef82cc1))
* recognizeSpeech ([8b5326d](https://github.com/liou666/polyglot/commit/8b5326d821d4ed8c4247d72eaa7265f4b22018db))
* speech hooks ([0177d31](https://github.com/liou666/polyglot/commit/0177d310acae166520fc4420dafb90daa3e7fc40))
* text to speak ([e90ec2c](https://github.com/liou666/polyglot/commit/e90ec2ca230366177429f650c10d3a5f1f495f95))
* update image url ([1b9a933](https://github.com/liou666/polyglot/commit/1b9a933017e71c0ee1e8442a1122cd154b2c3337))
* use piana store ([adcbeae](https://github.com/liou666/polyglot/commit/adcbeae02c35a1b00d8956d8758ac17adad47782))
* 添加网络超时处理 ([3d239ad](https://github.com/liou666/polyglot/commit/3d239ad77c0a2e54d19970fdd3d1d3f674678a1f))


### Bug Fixes

* 语音识别失败时增加错误处理 ([057d9c7](https://github.com/liou666/polyglot/commit/057d9c726199e7fd98be0561dec068f3ab93bfb6))
