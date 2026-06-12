# Spiredle 部署文档

## 1. 上传到 GitHub

### 1.1 创建 GitHub 仓库

在 https://github.com/new 创建一个新仓库（不要勾选 README 和 .gitignore）。

### 1.2 推送代码

```bash
# 在项目目录下初始化 Git
cd d:\project\spiredle
git init
git add .
git commit -m "Initial commit: Spiredle - Slay the Spire 2 Wordle"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/spiredle.git

# 推送代码
git branch -M main
git push -u origin main
```

### 1.3 后续更新

```bash
git add .
git commit -m "更新说明"
git push
```

---

## 2. 服务器部署（宝塔面板）

### 2.1 前置准备

宝塔面板需已安装以下软件：
- **Python 项目**（宝塔插件，用于运行 Flask）
- **Nginx**（可选，用于反向代理和域名绑定）

### 2.2 上传代码

**方式一：从 GitHub 拉取（推荐）**

```bash
# SSH 登录服务器，进入 /www/wwwroot/
cd /www/wwwroot/
git clone https://github.com/你的用户名/spiredle.git
cd spiredle
```

**方式二：通过宝塔文件管理器上传**

1. 在宝塔面板中进入 `/www/wwwroot/` 目录
2. 新建文件夹 `spiredle`
3. 将本地代码压缩上传并解压到该目录

### 2.3 配置 Python 虚拟环境

```bash
cd /www/wwwroot/spiredle

# 创建虚拟环境（宝塔的 Python 通常位于 /www/server/python_project/ 下）
python3 -m venv .venv

# 激活并安装依赖
source .venv/bin/activate
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
```

### 2.4 配置环境变量（可选）

建议设置一个随机的 `SECRET_KEY`：

```bash
# 生成随机密钥
python3 -c "import secrets; print(secrets.token_hex(32))"

# 写入环境变量
echo 'export SECRET_KEY="上面生成的密钥"' >> /www/wwwroot/spiredle/.env
```

### 2.5 宝塔 - Python 项目设置

1. 进入宝塔面板 → **软件商店** → **Python 项目**
2. 点击 **添加 Python 项目**

| 配置项          | 值                      |
| --------------- | ----------------------- |
| **项目名称**    | Spiredle                |
| **项目路径**    | `/www/wwwroot/spiredle` |
| **Python 版本** | 选择 Python 3.9+        |
| **框架**        | Flask                   |
| **启动方式**    | 启动模块                |
| **启动模块**    | `app.py`                |
| **监听端口**    | `5000`                  |
| **运行用户**    | `www`                   |
| **开机启动**    | ✅ 开启                  |

3. 点击 **确定**，宝塔会自动安装依赖并启动项目。

### 2.6 域名绑定（通过 Nginx）

如需要绑定域名，在宝塔 **网站** → **添加站点**：

```
域名：spiredle.你的域名.com
根目录：/www/wwwroot/spiredle
```

然后在 **设置** → **反向代理** 中添加：

```
代理名称：spiredle
目标 URL：http://127.0.0.1:5000
```

### 2.7 验证部署

访问 `http://你的服务器IP:5000/?lang=zhs` 或绑定的域名，应该能看到游戏页面。

---

## 3. 生产环境注意事项

### 3.1 关闭 Debug 模式

在宝塔 Python 项目中，**启动参数** 不要加 `debug=True`。项目入口 `app.py` 默认带有 `debug=True`，但宝塔的 Python 项目插件会直接调用 `app.py`，建议创建一个生产入口文件：

新建 `run.py`：

```python
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

然后在宝塔 Python 项目的 **启动模块** 改为 `run.py`。

### 3.2 设置 SECRET_KEY

在宝塔 Python 项目的 **环境变量** 中添加：

```
SECRET_KEY = 你的随机密钥
```

### 3.3 数据库

项目使用 SQLite，数据库文件位于 `instance/spiredle.db`。

- **备份**：定期备份 `instance/` 目录
- **重置**：删除 `instance/spiredle.db` 并重启项目，会自动重建

### 3.4 本地化数据

项目每小时自动从 Spire Codex API 拉取卡牌翻译数据。首次启动后需要等待下一次轮询（最多 1 小时），或访问 `/api/poll_now` 手动触发。

---

## 4. 常用命令

```bash
# 查看项目状态
supervisorctl status spiredle

# 重启项目
supervisorctl restart spiredle

# 查看日志（宝塔 Python 项目日志路径）
tail -f /www/wwwroot/spiredle/logs/error.log

# 停止项目
supervisorctl stop spiredle
```

---

## 5. 目录结构

```
spiredle/
├── app.py              # Flask 应用入口
├── config.py           # 配置（数据库、密钥、API）
├── game.py             # 游戏逻辑
├── models.py           # 数据库模型
├── localization.py     # 本地化数据轮询
├── requirements.txt    # Python 依赖
├── DEPLOY.md           # 本文件
├── localization/       # 翻译文件（自动拉取）
├── static/
│   ├── css/style.css
│   └── js/app.js
└── templates/
    └── index.html
```
