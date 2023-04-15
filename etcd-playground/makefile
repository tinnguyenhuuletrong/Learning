local:
	etcd --name s1 --data-dir ./_tmp/s1.etcd

sf-watch-leader:
	etcdctl elect election/stateFullApp -l

sf-list-member:
	etcdctl get election/stateFullApp --prefix