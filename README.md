# 西南大学统一身份认证登录脚本

> ⚠️ **实验性质**：本项目基于逆向分析西南大学当前统一身份认证前端实现。该登录方式**尚未正式上线**，SWU 将来可能会采用此协议，当前主要用于技术研究和前瞻性适配准备。

根据认证页面前端源码完整复现账号密码登录流程：初始化会话、获取 RSA 公钥、下载图形验证码、按前端规则进行 RSA 密码加密，并提交完整登录请求。

---

## 快速开始

### 安装

克隆仓库并安装依赖：

```bash
git clone https://github.com/your-org/swu-login.git
cd swu-login
pip install -e .
```

或直接安装依赖包：

```bash
pip install requests pycryptodome pytest
```

### 命令行使用

```bash
python src/login.py
```

程序启动后依次输入：
- **用户名**：学号或教工号
- **密码**：统一认证密码（隐藏输入）
- **验证码**：查看自动保存的 `captcha.png` 并输入四位字符

服务器原始响应会以 JSON 格式输出，`code == 200` 表示登录成功，其他状态码和错误信息保留服务端原始字段。

---

## 开发与测试

运行单元测试：

```bash
python -m pytest -q
```

### 配置

部署地址、学校 ID、请求超时和 User-Agent 等配置位于 `src/swu_auth/config.py`。

- 协议细节：[docs/protocol.md](docs/protocol.md)  
- 浏览器逆向依据：[docs/evidence.md](docs/evidence.md)
