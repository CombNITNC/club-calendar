# club-calendar

部活動の集会に関するデータを管理する API と、それを表示するウェブサイトを提供する。


# ディレクトリ構成

- db -- データベースの定義
- lib -- 独立していて、そのまま自由に別プラットフォームへ移植できるライブラリ
- pages -- Next.js のページ
  - api -- HTTP リクエストの API
- public -- デプロイ時にそのまま維持されるファイル
- server -- Express による API サーバースクリプト
- slack -- jsx-slack による Slack の画面
- uml -- このシステムに関する UML 図
- view -- Next.js のページに使う部品


# ウェブサイト

スケジュールの入ったカレンダーが表示される。

集会の追加ボタンを押すと画面が開き、集会の設定と追加ができる。

スケジュール上の集会をクリックすると画面が開き、集会の設定と中止ができる。


# API

サーバーに以下の HTTP リクエストを送って、集会データを扱える。


## 設定

| 環境変数               | 説明                        | デフォルト値 |
| ---------------------- | --------------------------- | ------------ |
| `API_PORT`             | API サーバーのポート        | `3080`       |
| `AUTH_PUBLIC`          | 認証サーバーの公開鍵        | なし         |
| `AUTH_HMAC_KEY`        | 認証サーバーの HMAC 暗号鍵  | なし         |
| `DB_HOST`              | 接続する DB の URI          | `127.0.0.1`  |
| `DB_USER`              | 接続する DB のユーザ名      | `meetings`   |
| `DB_PASS`              | 接続する DB のパスワード    | なし         |
| `SLACK_CLIENT_SECRET`  | Slack API の秘密鍵          | なし         |
| `SLACK_SIGNING_SECRET` | Slack API の署名鍵          | なし         |
| `SLACK_OAUTH_TOKEN`    | Slack API の OAuth トークン | なし         |


## データベースのテーブル設定

```sql
CREATE DATABASE meetings IF NO EXISTS;

CREATE USER 'meetings'@'172.17.0.1' IDENTIFIED BY 'test';
GRANT ALL PRIVILEGES ON meetings. * TO 'meetings'@'172.17.0.1';

USE meetings;
CREATE TABLE meetings (
  id VARCHAR(255) NOT NULL,
  kind ENUM('Regular', 'Others') NOT NULL,
  name TEXT NOT NULL,
  date DATETIME NOT NULL,
  expired BOOLEAN NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE meetings CONVERT TO CHARACTER SET utf8mb4;
```


## 使い方

### 取得

`GET /meetings` に以下のクエリを付けてアクセスする。

正常なクエリ引数を渡さないと `400 Bad Request` を返す。

| 引数    | 必須 | 意味                                                                                         |
| ------- | ---- |
| kind    | NO   | 取得する集会の種別で、`Regular` か `Others` にできる。                                       |
| from    | NO   | 日時の文字列で、これ以降の集会を取得する。                                                   |
| to      | NO   | 日時の文字列で、これ以前の集会を取得する。                                                   |
| expired | NO   | `true` なら中止されたものを、`false` なら中止されていないものを、`both` なら両方を取得する。 |

`200 OK` と以下のような JSON を返す。

```json
{
  "meetings": [
    {
      "id": "hoge",
      "kind": "Others",
      "name": "ホゲ談義",
      "date": "2019-12-12T12:12:00",
      "expired": false
    }
  ]
}
```

### 作成

`POST /meetings` に以下の JSON を付けてアクセスする。

正常な JSON を渡さないと `400 Bad Request` を返す。

```json
{
  "kind": "Others",
  "name": "ホゲ談義",
  "date": "2019-12-12T12:12:00"
}
```

定例会 (`kind` が `Regular`) の場合は、範囲を指定する。
`from` と同じ曜日で、`to` の日付までの予定が複数生成される。

```json
{
  "kind": "Regular",
  "name": "前期定例会",
  "from": "2019-04-09T16:15:00",
  "to": "2019-07-31T16:15:00"
}
```

作成に成功すると、`201 Created` と以下のような JSON を返す。

```json
{
  "ids": [
    "hoge"
  ]
}
```

### 更新

`PATCH /meetings/[id]` に以下の JSON を付けてアクセスする。

JSON には更新したい属性だけを渡す。

正常な JSON を渡さないと `400 Bad Request` を返す。

```json
{
  "name": "ホゲ談義",
  "date": "12:12:00",
  "from": "2019-12-01T00:00:00",
  "to": "2020-01-01T00:00:00",
}
```

更新に成功すると `202 Accpeted` を返す。

### 中止

`PATCH /meetings/[id]/expire` に以下の JSON を付けてアクセスする。

正常な ID でないと `400 Bad Request` を返す。

更新に成功すると、`202 Accepted` を返す。
