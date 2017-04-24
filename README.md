<a href="https://github.com/TryGhost/Ghost"><img src="https://cloud.githubusercontent.com/assets/120485/6622822/c4c639fe-c8e7-11e4-9e64-5bec06c8b4c3.png" alt="Ghost" /></a>
<a href="https://travis-ci.org/TryGhost/Ghost"><img align="right" src="https://travis-ci.org/TryGhost/Ghost.svg?branch=master" alt="Build status" /></a>

![Ghost Screenshot](https://cloud.githubusercontent.com/assets/120485/6626466/6dae46b2-c8ff-11e4-8c7c-8dd63b215f7b.jpg)

![Ghost is a simple, powerful publishing platform that allows you to share your stories with the world.](https://cloud.githubusercontent.com/assets/120485/6626501/b2bb072c-c8ff-11e4-8e1a-2e78e68fd5c3.png)

Ghost 目由非盈利性组织 **Ghost Foundation** 和一群优秀的独立[贡献者](https://github.com/TryGhost/Ghost/contributors)共同维护。我们正在尽最大努力让在线内容创作变得更好。

- [Ghost.org](https://ghost.org)
- [Latest Release](https://ghost.org/developers/)
- [Support](http://support.ghost.org/)
- [Theme Docs](http://themes.ghost.org)
- [Contributing Guide](https://github.com/TryGhost/Ghost/blob/master/.github/CONTRIBUTING.md)
- [Feature Requests](http://ideas.ghost.org/)
- [Dev Blog](http://dev.ghost.org)

**注意：如果你在使用 Ghost 过程中遇到难题需要帮助，请尽量加入 [Slack 社区](https://ghost.org/slack/) 寻求帮助而不是在 Github 上新开一个 issue。**


# Quick Start Install

安装前请确保已经安装了 Node.js - 我们建议使用  **Node v4 LTS**  的最新版本。 [下载](http://support.ghost.org/supported-node-versions/).

1. 下载 [最新版](https://ghost.org/developers/) 的 Ghost
1. 解压文件至你所希望的安装位置
1.  启动一个命令行窗口
1. 执行`npm install --production`命令
1. 启动 Ghost!
    - 本地环境: `npm start`
    - 发布环境: `npm start --production`
1.启动浏览器，打开 `http://localhost:2368/ghost` :链接

还可以参考详细的 [安装指南](http://support.ghost.org/installation/) .

<a name="getting-started"></a>
# 开发者 (从 git 下载)

下载 Node.js. (查看 [ Node.js 提供版本](http://support.ghost.org/supported-node-versions/))

```bash
# Node v4.2+ LTS - 推荐
# Node v0.10.x and v0.12.x - supported
#
# Choose wisely
```

Clone :ghost:

```bash
git clone git://github.com/tryghost/ghost.git
cd ghost
```

Install grunt. No prizes here.

```bash
npm install -g grunt-cli
```

安装 Ghost。 如果你是在本地环境运行 ghost，可以使用 [master](https://github.com/TryGhost/Ghost/tree/master) 分支。如果是在生产环境运行，请使用 [stable](https://github.com/TryGhost/Ghost/tree/stable) 分支. :no_entry_sign::rocket::microscope:

```bash
npm install
```

Build the things!

```bash
grunt init
```

Minify that shit for production?

```bash
grunt prod
```

Start your engines.

```bash
npm start

## 运行 production? Add --production
```

祝贺你，一切搞定了！顺便说一下，你还可以直接执行 `npm install ghost` 指令将 Ghost 作为 npm 包来使用。[将 Ghost 作为 NPM 模块来使用](https://github.com/TryGhost/Ghost/wiki/Using-Ghost-as-an-npm-module) 是一份很详尽的文档。

还可以参考更详细的[安装指南](http://support.ghost.org/installation/) 。



# 部署 Ghost

![Ghost(Pro) + DigitalOcean](https://cloud.githubusercontent.com/assets/120485/8180331/d6674e32-1414-11e5-8ce4-2250e9994906.png)

Ghost 官方支持的 **[Ghost(Pro)](https://ghost.org/pricing/)** 服务能够帮你节约大量时间，只需点几下鼠标就能部署一个 Ghost 实例到 [DigitalOcean](https://digitalocean.com) 的服务器上，并且还可以免费享受到全球化的 CDN 服务。

从 **Ghost(Pro)** 所获得的所有收益都将用于 Ghost 基金 -- 一个非营利性的组织，为 Ghost 的开发和维护提供支持。

如果你希望自己部署 Ghost，可以参考[这里](http://support.ghost.org/deploying-ghost/).


# 保持更新

当 Ghost 有新版本发布时，请参考 [升级指南](http://support.ghost.org/how-to-upgrade/) 以了解如何升级 Ghost。

在 [public Slack team](https://ghost.org/slack/) 与 Ghost 开发者沟通。我们每周二下午 5:30 都会在 Slack 上开碰头会。请注意，我们说的是`伦敦时间`。

每次有新版本都会在 [技术博客](http://dev.ghost.org/tag/releases/) 上公布。你可以通过邮件订阅或者在 Twitter 上关注 [@TryGhost_Dev](https://twitter.com/tryghost_dev)。
:saxophone::turtle:


#  Copyright & License

Copyright (c) 2013-2017 Ghost Foundation - Released under the [MIT license](LICENSE).
