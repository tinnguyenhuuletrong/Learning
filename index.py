import os
import asyncio
from aiortc.rtcicetransport import RTCIceCandidate
from aiortc.rtcpeerconnection import RTCPeerConnection
from aiortc.rtcsessiondescription import RTCSessionDescription
from aiortc.contrib.media import (MediaRelay)
from WSSignalling import WSSignalling
from util.FlagViewStreamTrack import FlagVideoStreamTrack
from util.ImageViewStreamTrack import ImageViewStreamTrack
from util.VideoTransformStreamTrack import VideoTransformStreamTrack

import argparse
import logging

BYE = object()


def channel_log(channel, t, message):
    print("channel(%s) %s %s" % (channel.label, t, message))


def channel_send(channel, message):
    channel_log(channel, ">", message)
    channel.send(message)


async def run(pc, signaling, mode):

    relay = MediaRelay()
    transform = VideoTransformStreamTrack(
        None, transform="cartoon"
    )

    def add_data_channel(channel):
        @channel.on("message")
        async def on_message(message):
            channel_log(channel, "<", message)
            VALID_MODE = ["cartoon", "edges", "rotate", 'none']
            if message in VALID_MODE:
                transform.transform = message
                channel_send(channel, 'update transform')
            else:
                channel_send(channel, "py echo %s" % message)

    # Event Handler
    # @pc.on("connectionstatechange")
    # async def on_connection_change_state():
    #     if pc.connectionState == "connected":
    #         await add_tracks()

    @pc.on("track")
    async def on_track(track):
        print("Receiving %s" % track.kind)
        await asyncio.sleep(1)
        transform.add_track(relay.subscribe(track))

    @pc.on("datachannel")
    def on_datachannel(channel):
        channel_log(channel, "-", "created by remote party")

        add_data_channel(channel)

    # Start
    # connect signaling
    await signaling.connect()
    await signaling.wait_for_ready()

    # Not yet support renegotiate
    # if mode == 'HOST':
    #     # send offer
    #     channel = pc.createDataChannel('chat')
    #     add_data_channel(channel)
    #     await add_tracks()

    pc.addTrack(transform)

    # consume signaling
    while signaling.is_connect():
        obj = await signaling.receive()

        if isinstance(obj, RTCSessionDescription):
            await pc.setRemoteDescription(obj)
            # await recorder.start()

            if obj.type == "offer":
                # send answer
                answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                await signaling.send(pc.localDescription)
        elif isinstance(obj, RTCIceCandidate):
            await pc.addIceCandidate(obj)
        elif obj is BYE:
            print("Exiting")
            break


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Python Webrtc client")

    # Not yet support renegotiate
    parser.add_argument("mode", choices=["PEER"])
    parser.add_argument("roomId", help="Room id")
    parser.add_argument("--verbose", "-v", action="count")

    # args = type('', (), {})()
    # args.mode = 'PEER'
    # args.roomId = 'ttin'
    # args.verbose = False

    args = parser.parse_args()
    mode = 'PEER'

    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    print("Connect to %s - %s" % (args.roomId, mode))
    signaling = WSSignalling(room_id=args.roomId)
    pc = RTCPeerConnection()

    # run event loop
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(
            run(
                pc=pc,
                signaling=signaling,
                mode=mode
            )
        )
    except KeyboardInterrupt:
        pass
    finally:
        # cleanup
        loop.run_until_complete(pc.close())
        loop.run_until_complete(signaling.close())
