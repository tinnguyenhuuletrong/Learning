import os
import asyncio
from WSSignalling import WSSignalling
from websockets import ConnectionClosedOK
import argparse
import logging


async def recv_loop(room):
    while room.is_connect():
        try:
            await room.receive()
        except ConnectionClosedOK:
            pass


async def run(room):
    await room.connect()
    print('connect')
    await recv_loop(room)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Test signalling room")
    parser.add_argument("roomId", help="Room id")
    parser.add_argument("--verbose", "-v", action="count")

    args = parser.parse_args()
    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    print("Connect to %s" % args.roomId)
    room = WSSignalling(room_id=args.roomId)

    # run event loop
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(
            run(
                room=room
            )
        )
    except KeyboardInterrupt:
        pass
    finally:
        # cleanup
        loop.run_until_complete(room.close())
