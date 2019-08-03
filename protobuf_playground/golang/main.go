package main

import (
	"log"

	pb "play/messasing"

	b64 "encoding/base64"
	"encoding/json"

	"github.com/gogo/protobuf/proto"
	any "github.com/golang/protobuf/ptypes/any"
)

func main() {
	msg := pb.AwesomeMessage{
		Type: pb.MSG_TYPE_PING,
		Id:   1,
		Body: &pb.AwesomeMessage_PingBody{
			PingBody: &pb.PingBody{
				Nounce: 10,
			},
		},
	}
	msg.Extra = make(map[string]*any.Any, 0)
	msg.Extra["a"] = &any.Any{
		TypeUrl: "string",
		Value:   []byte("something"),
	}

	// Encode
	buffer, err := proto.Marshal(&msg)
	if err != nil {
		log.Fatalln("Failed to encode", err)
	}
	jsonVal, _ := json.Marshal(&msg)

	println("JSON", string(jsonVal))
	println("Encoded ", b64.StdEncoding.EncodeToString(buffer))

	// Decode
	var obj pb.AwesomeMessage
	err = proto.Unmarshal(buffer, &obj)
	if err != nil {
		log.Fatalln("Failed to encode", err)
	}
	println("Decoded", obj.String())
}
