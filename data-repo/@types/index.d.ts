import { RedisClient } from "redis";
import { EventEmitter } from "events";

import RpcServer from "../src/RpcServer";
import RpcClient from "../src/RpcClient";

import MemoryStore from "../src/storages/MemoryStore";
import FileStore from "../src/storages/FileStore";

declare module datarepo {
  export interface IDataSource extends EventEmitter {
    findAsync(query: Object): Promise<Object>;
  }

  export interface IDataStore {
    getStreamHead(): string;
    setStreamHead(head: string);
    clear();
    batchCreateItems(items: Object[]);
    createItem(item: Object);
    updateItem(item: Object);
    deleteItem(item: Object);
  }

  export type Repo = {
    rpcServer: RpcServer;
    start();
    stop();
  };

  export type RepoRemote = {
    start();
    stop();
  };

  function start(client: RedisClient);
  function stop();
  function createDataRepo(params: {
    topic: string;
    dataSource: IDataSource;
  }): Promise<Repo>;

  function createRpcClient(): Promise<RpcClient>;

  function createDataRepoRemote(params: {
    topic: string;
    dataStore: IDataStore;
  }): Promise<RepoRemote>;

  var storage: {
    MemoryStore: typeof MemoryStore;
    FileStore: typeof FileStore;
  };
}

export = datarepo;
