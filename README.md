# Spiredle Wordle

杀戮尖塔 2 (Slay the Spire 2) 主题的 Wordle 猜卡游戏，每日一题。

## 快速开始

```bash
cd d:\project\spiredle
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

访问 http://127.0.0.1:5000/

## 玩法

每天 00:00 UTC 更新一道新题目，你有 **6 次** 机会猜出当天的卡牌。

每次猜测后，系统会从 **6 个维度** 给出反馈：

| 属性   | 字段     | 🟢 绿色             | 🟡 黄色     | ⚫ 灰色 |
| ------ | -------- | ------------------ | ---------- | ------ |
| 名称   | Name     | 完全正确           | —          | 错误   |
| 稀有度 | Rarity   | 完全相同           | —          | 错误   |
| 类型   | Type     | 完全相同           | —          | 错误   |
| 费用   | Cost     | 费用和辉星都匹配   | 仅费用匹配 | 不匹配 |
| 颜色   | Color    | 完全相同           | —          | 错误   |
| 关键词 | Keywords | 关键词集合完全一致 | 部分重合   | 无重合 |

### Cost 特殊规则

- **X 费用**：`is_x_cost` 为 `true` 时显示为 `X`
- **辉星费用**：有辉星的卡牌显示为 `a / b` 格式（如 `1 / 2`）
  - 费用和辉星都匹配 → 🟢
  - 仅费用匹配 → 🟡
  - 均不匹配 → ⚫

### 关键词

`keywords` 可能为 `null` 或一个列表。猜测时：
- 列表元素完全一致 → 🟢
- 至少有一个元素重合 → 🟡
- 无重合 → ⚫
- 双方均为空 → 🟢

## 功能特性

- **多语言支持**：14 种语言（eng, zhs, dsu, esp, fra, ita, jpn, kor, pol, ptb, rus, spa, tha, tur）
- **本地化轮询**：每小时自动拉取远程翻译数据，次日 UTC+0 生效
- **UTC+0 刷新**：每日挑战每天 00:00 UTC 自动更新
- **自动补全**：输入卡名或 ID 实时搜索
- **ID/Name 双匹配**：输入卡牌 ID 或任意语言的名称均可

## API

| 端点                  | 方法 | 说明                           |
| --------------------- | ---- | ------------------------------ |
| `/`                   | GET  | 主页面                         |
| `/?lang=zhs`          | GET  | 指定语言的页面                 |
| `/api/init?lang=eng`  | GET  | 获取今日游戏状态               |
| `/api/guess`          | POST | 提交猜测                       |
| `/api/cards?lang=eng` | GET  | 获取所有卡牌列表（自动补全用） |
| `/api/card/<id>`      | GET  | 获取单个卡牌详情               |
| `/api/date`           | GET  | 当前 UTC 日期                  |
| `/api/stats/<date>`   | GET  | 某日猜测统计                   |

## 项目结构

```
d:\project\spiredle/
├── app.py              # Flask 主应用
├── config.py           # 配置
├── models.py           # 数据库模型
├── game.py             # 游戏逻辑
├── localization.py     # 多语言轮询
├── seed_data.py        # 种子数据生成
├── cards_data.json     # 卡牌数据
├── requirements.txt    # 依赖
├── static/
│   ├── css/style.css   # 样式
│   └── js/app.js       # 前端逻辑
├── templates/
│   └── index.html      # 页面模板
├── localization/       # 多语言数据
└── instance/           # SQLite 数据库
```

## 卡牌数据

数据来自 **[Spire Codex API](https://spire-codex.com/api/cards?lang=eng)**，包含 576 张杀戮尖塔 2 的卡牌，属性为真实游戏数据。

### 数据刷新

- `cards_data.json` — 卡牌定义（运行 `python seed_data.py` 重新获取）
- `data/localized_names.json` — 14 种语言的本地化名称
- 后台每小时自动轮询 API 更新本地化数据

### 数据格式参考

```json
{
  "CARD_ID": {
    "id": "CARD_ID",
    "name": "Card Name",
    "rarity": "Basic | Common | Uncommon | Rare | Ancient | Curse | Status | Event | Quest | Token",
    "type": "Attack | Skill | Power | Curse | Status | Quest",
    "cost": 1,           // null for unplayable
    "is_x_cost": false,   // true for X-cost cards
    "is_x_star_cost": false,
    "star_cost": null,    // e.g. 5 for cards that cost stars
    "color": "Red | Green | Blue | Purple | Colorless",
    "keywords": null      // array or null
  }
}
```

## 重新生成数据

```bash
cd d:\project\spiredle
.venv\Scripts\Activate.ps1
python seed_data.py     # 从 Spire Codex API 获取最新卡牌数据
```
