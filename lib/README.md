# club-calendar-lib

カレンダー管理ライブラリ


# ディレクトリ構成

- exp -- このシステムで使うモデル
  - date-string -- 日付の文字列
  - duration -- 日付の範囲
  - meeting -- 集会情報
- op -- このシステム上でできる操作
  - create -- 新しい集会を作成
  - fetch -- 集会を取得
  - update -- 集会を修正
  - abort -- 集会を中止
- abst -- op に必要な外部を抽象化したもの
  - client -- サーバーにアクセスしてくる存在
  - repository -- データベース
  - meeting-query -- 集会クエリ
- skin -- abst の様々な実装
  - express -- Express サーバー
  - on-memory -- メモリ上で動作するテスト向けレポジトリ
  - mysql -- MySQL レポジトリ
  - bool-query -- 真偽値のみの集会クエリの実装
  - mysql-query -- MySQL 用の集会クエリの実装
- tests -- op のテスト
  - regular.test.ts -- 定例会に関する処理のテスト
  - others.test.ts -- その他の集会に関する処理のテスト