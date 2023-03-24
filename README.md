# WebSocket RabbitMQ Node Example

RabbitMQに接続し、キューにメッセージを送信するNode.jsのWebSocketサンプルです。

## Getting Started

`docker-compose`コマンドが利用できる環境であることを前提としています。

このディレクトリで以下のコマンドを実行してください。

```
$ docker-compose up
```

`web`コンテナは`http://localhost:3000`で実行されています。

また、`http://localhost:15672`でRabbitMQの管理画面が起動しています。ユーザー名とパスワードは`user`と`password`です。

より詳細な情報は[docker-compose.yml](docker-compose.yml)を参照してください。
