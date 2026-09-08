# 登录协议说明

## 请求顺序

默认认证部署使用以下请求：

```text
GET  /center-auth-server/officeHallApplicationCode/cas/login?service=...
GET  /center-auth-server/getVerifyCode?random=...
POST /center-auth-server/sso/doLogin
```

第一个请求建立会话并取得 `COOKIE_AUTH_SERVER_CLIENT_TAG`。验证码请求与登录请求必须复用同一个会话，否则服务端无法将验证码与提交内容关联。

## 密码字段

`evidence/browser/common.js` 内嵌 1024 位 RSA 公钥，前端 `getSecretParam` 按以下顺序构造 `pwd`：

1. 按页面 JavaScript 循环切分密码。由于循环在每第 30 个索引调用 `substring(maxIndex, i)`，第一段为 29 个 UTF-16 代码单元，后续每段为 30 个。
2. 对每一段进行 RSA PKCS#1 v1.5 加密。
3. 将每个 128 字节密文编码为 Base64。
4. 将密文列表序列化为紧凑 JSON 数组。
5. 对整个 JSON 字符串执行 JavaScript `encodeURIComponent`。

`src/swu_auth/crypto.py` 按此规则实现。RSA 填充具有随机性，因此同一密码的每次密文不同是正常现象。浏览器源码只用于协议分析，Python 运行时不会加载这些 JavaScript 文件。

## 登录请求体

```json
{
  "name": "学号或工号",
  "pwd": "URL 编码后的 RSA 密文数组",
  "verifyCode": "图形验证码",
  "universityId": "106350",
  "loginType": "login"
}
```

## 响应状态

- `200`：登录完成。
- `16300`：需要额外认证，`msg` 中包含后续流程票据。
- `15101`：需要修改密码。
- `15102`：密码策略不匹配，`data` 中包含票据。
- `601`：存在多个身份，需要进一步选择。
- 其他状态：用户名、密码、验证码或服务端策略校验失败。

脚本会输出服务端原始 JSON，避免丢失认证流程所需字段。
