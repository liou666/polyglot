# <img src="./public/favicon.ico" width="60px" align="center" alt="Polyglot icon"> Polyglot 
>  AI语言练习应用 

Polyglot是一款桌面端应用程序。基于ChatGPT和Azure人工智能语言模型作为底层服务，使用Vue3+TS技术栈构建，旨在提供一个易于使用的语言练习平台，方便进行多语种的口语练习。

<p align="center">
  <img width="" alt="Screenshot: Polyglot App running" src="./screenshot/dark.png">
</p>

## 功能
- [x] 多国语言口语练习 （目前内置四个不同国家的AI人物，分别来自美国、日本、韩国和法国。后续将考虑增加更多的语种。）
- [x] 智能语音合成（基于Azure TTS服务）
- [x] 智能对话功能（基于chatGPT服务）
- [x] 支持暗黑模式
- [ ] 接入文字翻译功能
- [ ] 支持用户配置自定义对话场景
- [ ] 支持用户自定义语种和AI人物
## 使用方法
+ 设置OpenAI Key
+ 设置代理（非必须）
+ 选择喜欢的AI人物进行对话；
+ 与AI人物进行对话练习口语。

## 安装
```bash
# 1.克隆本仓库；
git clone https://github.com/liou666/polyglot.git

# 2.安装依赖；
cd polyglot
pnpm install

# 3.配置环境变量
mv .env_example .env

# 4. 启动服务
pnpm dev
```

## 贡献
如果您有任何建议或意见，欢迎提出 [Issues](https://github.com/liou666/polyglot/issues) 或 [ Pull Request](https://github.com/liou666/polyglot/pulls)。
