import websockets
import logging
import time
import json

from aiortc import RTCIceCandidate, RTCSessionDescription
from aiortc.sdp import candidate_from_sdp, candidate_to_sdp

logger = logging.getLogger(__name__)
DUMMY = object()


class WSSignalling:
    def __init__(self, room_id, url=None):
        self._url = url or "wss://secret-headland-20594.herokuapp.com"
        self._room_id = room_id
        self._websocket = None

    def is_connect(self):
        return self._websocket != None

    def _object_from_string(self, message_str):
        message = json.loads(message_str)
        if "type" in message and message["type"] in ["answer", "offer"]:
            return RTCSessionDescription(**message)
        elif "candidate" in message:
            message = message["candidate"]
            candidate = candidate_from_sdp(
                message["candidate"].split(":", 1)[1])
            candidate.sdpMid = message["sdpMid"]
            candidate.sdpMLineIndex = message["sdpMLineIndex"]
            return candidate

        return DUMMY

    def _object_to_string(self, obj):
        if isinstance(obj, RTCSessionDescription):
            message = {"sdp": obj.sdp, "type": obj.type}
        elif isinstance(obj, RTCIceCandidate):
            message = {
                "candidate": {
                    "candidate": "candidate:" + candidate_to_sdp(obj),
                    "sdpMid": obj.sdpMid,
                    "sdpMLineIndex": obj.sdpMLineIndex,
                    "type": "candidate",
                }
            }
        else:
            message = obj
        return json.dumps(message, sort_keys=True)

    async def connect(self):
        self._websocket = await websockets.connect(
            self._url
        )
        connect_msg = {
            "jsonrpc": "2.0",
            "id": str(time.time()),
            "method": "join",
            "params": {
                "roomId": self._room_id,
            },
        }
        await self._websocket.send(self._object_to_string(connect_msg))
        print(f"WSSignalling room is {self._room_id}")
        pass

    async def close(self):
        await self._websocket.close()
        self._websocket = None

    async def receive(self):
        message = await self._websocket.recv()
        logger.info("< " + message)
        message = json.loads(message)
        if "method" in message and message["method"] == "peer-info":
            return self._object_from_string(message["params"]["data"])

    async def send(self, descr):
        message = self._object_to_string({
            "jsonrpc": "2.0",
            "id": str(time.time()),
            "method": "send",
            "params": {
                "roomId": self._room_id,
                "data": json.dumps(descr),
            },
        })
        logger.info("> " + message)
        await self._websocket.send(message)
