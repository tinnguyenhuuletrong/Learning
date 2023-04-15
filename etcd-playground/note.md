# TODO

- Nodejs check
<https://microsoft.github.io/etcd3/classes/election.html>

- Golang check

- Eco check
<https://etcd.io/docs/v3.5/integrations/>



``` txt

- start app 
- init new electron & campaign
  ---- onLeader
  ---- onLeaderChanged


- AppStateMachine
  init
    leader: null

  :onLeaderChanged (x)
    leader: x

  :onLeaderLose
    if(i am leader)
      -> stop recieve work
      -> rollback unfinished

    leader: null

  [helper]
  waitForLeader
    waitUntilLeader !== null


  queryCurrentState

  queryOpLog

- Service

  request
    forwardToLeader

  [LeaderOnly]
  onProcess:
    doWork
    broadcastStateChange
    
```