import os
import asyncio
from aiortc.rtcicetransport import RTCIceCandidate
from aiortc.rtcpeerconnection import RTCPeerConnection
from aiortc.rtcsessiondescription import RTCSessionDescription
from WSSignalling import WSSignalling
from util.FlagViewStreamTrack import FlagVideoStreamTrack
from util.ImageViewStreamTrack import ImageViewStreamTrack
import argparse
import logging

BYE = object()


def channel_log(channel, t, message):
    print("channel(%s) %s %s" % (channel.label, t, message))


def channel_send(channel, message):
    channel_log(channel, ">", message)
    channel.send(message)


async def run(pc, signaling, mode):

    def add_data_channel(channel):
        @channel.on("message")
        async def on_message(message):
            channel_log(channel, "<", message)
            channel_send(channel, "py echo %s" % message)
            if message == "play":
                print('start video')
                await add_tracks()

    async def add_tracks():
        # if player and player.audio:
        #     pc.addTrack(player.audio)

        # if player and player.video:
        #     pc.addTrack(player.video)

        pc.addTrack(ImageViewStreamTrack(img_path='./avatar.jpg'))
        await pc.setLocalDescription(await pc.createOffer())
        await signaling.send(pc.localDescription)

    # Event Handler

    # @pc.on("connectionstatechange")
    # async def on_connection_change_state():
    #     if pc.connectionState == "connected":
    #         await add_tracks()

    @pc.on("track")
    async def on_track(track):
        print("Receiving %s" % track.kind)
        await asyncio.sleep(2)
        await add_tracks()

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
    # parser.add_argument("mode", choices=["PEER"])
    parser.add_argument("roomId", help="Room id")
    parser.add_argument("--verbose", "-v", action="count")

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
