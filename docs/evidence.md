# 逆向依据清单

`evidence/browser/` 保存恢复登录协议所需的前端源码和页面快照。修改 Python 实现时，应重新核对相关逻辑。

| 文件 | 作用 | Python 运行时是否加载 |
| --- | --- | --- |
| `evidence/browser/common.js` | RSA 公钥和 `getSecretParam` 密码编码逻辑 | 否 |
| `evidence/browser/login.js` | 表单校验、验证码流程、接口路径和响应状态 | 否 |
| `evidence/browser/login.devtools` | 渲染后的认证页面、部署变量和资源引用 | 否 |
| `evidence/browser/jsencrypt.js` | 页面引用的浏览器 RSA 实现 | 否 |
| `evidence/browser/jquery-3.6.0.min.js` | 页面引用的前端运行依赖 | 否 |
| `evidence/browser/qrcode.min.new.js` | 页面引用的二维码运行依赖 | 否 |

包含 Cookie、账号、验证码或请求数据的会话抓包不纳入仓库。不要提交密码、Cookie、账号、验证码图片或其他敏感信息。

## 计算依据文件哈希

在仓库根目录运行：

```powershell
Get-FileHash evidence\browser\* -Algorithm SHA256
```

哈希只用于确认依据文件是否被替换，不写入登录逻辑。
