# 西南大学统一身份认证登录脚本

根据认证页面前端源码复现账号密码登录流程：初始化会话、下载图形验证码、按前端规则进行 RSA 密码加密，并提交登录请求。

## 安装依赖

```powershell
python -m pip install -r requirements.txt
```

## 使用方法

从仓库根目录运行：

```powershell
python src/login.py
```

程序启动后依次输入用户名、密码和验证码。密码使用隐藏输入，验证码保存为当前目录下的 `captcha.png`。服务器原始响应会以 JSON 输出，`code == 200` 表示登录完成，其他状态保留服务端字段。

## 测试

```powershell
python -m pytest -q
```

部署地址、学校 ID、超时和 User-Agent 位于 `src/swu_auth/config.py`。

协议细节见 [docs/protocol.md](docs/protocol.md)，浏览器逆向依据见 [docs/evidence.md](docs/evidence.md)。
