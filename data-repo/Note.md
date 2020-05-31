# Design

```sh
BaseRemoteRepo
  Storage
      metadata: _lastStreamId
      entities: [
        {
          _id,
          type,
          data
        }
      ]


RemoteRepo extend BaseRemoteRepo
  sync
    pubrpc -> forceSync(initialQuery)

  sub repoStream -> updateDb
  find
    notExits -> source.query -> save to db
  findById


Repo
  syncPubSub
  publish curd to stream

```
