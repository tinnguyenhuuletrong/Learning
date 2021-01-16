# compact
# Guide https://www.linkedin.com/pulse/introduction-topic-log-compaction-apache-kafka-nihit-saxena

docker exec tools_kafka_1 sh /opt/kafka/bin/kafka-configs.sh --zookeeper localhost:2181 --alter \
--add-config "cleanup.policy=compact,delete.retention.ms=100,segment.ms=100,min.cleanable.dirty.ratio=0.01,segment.bytes=1073741824" \
--entity-name book_change_log --entity-type topics