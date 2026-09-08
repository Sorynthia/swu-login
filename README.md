# 西南大学统一身份认证登录脚本

> ⚠️ **实验性质**：本项目基于逆向分析西南大学当前统一身份认证前端实现。该登录方式**尚未正式上线**，SWU 将来可能会采用此协议，当前主要用于技术研究和前瞻性适配准备。

根据认证页面前端源码完整复现账号密码登录流程：初始化会话、获取 RSA 公钥、下载图形验证码、按前端规则进行 RSA 密码加密，并提交完整登录请求。

---

## 快速开始

### 安装

```bash
# 使用 pip
pip install -e .

# 或使用 uv（推荐）
uv sync
```

### 使用示例

```python
from swu_login import login

# 基础登录
success, message = login("你的学号", "你的密码")

# 完整参数
success, message = login(
    username="你的学号",
    password="你的密码",
    captcha_solver=None,  # 可选：自定义验证码识别函数
    max_retries=3
)
```

## 功能特性

- ✅ 完整复现前端登录逻辑
- ✅ RSA 密码加密
- ✅ 自动处理会话和 Cookie
- ✅ 内置验证码识别（基于 ddddocr）
- ✅ 支持自定义验证码处理函数
- ✅ 自动重试机制

## 技术实现

1. **会话初始化** - 获取初始 Cookie 和 CSRF Token
2. **RSA 加密** - 使用服务器返回的公钥加密密码
3. **验证码处理** - 下载图形验证码并识别
4. **登录请求** - 提交完整的加密凭证和验证码

## 环境要求

- Python 3.13+
- 依赖：requests, Pillow, ddddocr, pycryptodome

## 注意事项

- ⚠️ 本项目用于技术研究和学习，请遵守学校相关规定
- ⚠️ 登录协议可能随时变化，需要持续维护
- ⚠️ 切勿将账号密码硬编码到代码中
- ⚠️ 建议通过环境变量或安全配置管理凭证

## 相关项目

- **[swu-checkin](https://github.com/Sorynthia/swu-checkin)** - 钉钉查寝自动打卡脚本
- **[swudk-dingtalk](https://github.com/Sorynthia/swudk-dingtalk)** - 钉钉扫码打卡前端工具

如需完整的后端服务系统（API、用户管理、定时任务等），请参考 swudk 私有仓库。

## 贡献指南

欢迎提交 Issue 和 Pull Request！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

## 引用与归属

如果你在项目中使用或参考了本代码，建议按以下方式标注：

```
基于 Sorynthia/swu-login 开发
GitHub: https://github.com/Sorynthia/swu-login
```

本项目采用 MIT 许可证，欢迎使用和修改，但请保留原作者信息。

## 许可证

MIT License