import { identify } from "@libp2p/identify";
import { mdns } from "@libp2p/mdns";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { createLibp2p } from "libp2p";
import { webSockets } from "@libp2p/websockets";
import { pipe } from "it-pipe";

import { setTimeout as sleepMs } from "timers/promises";

const createNode = async () => {
  const node = await createLibp2p({
    addresses: {
      listen: ["/ip4/127.0.0.1/tcp/0/ws"],
    },
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    transports: [tcp(), webSockets()],
    peerDiscovery: [mdns()],
    services: {
      identify: identify(),
    },
  });

  return node;
};

// this is our protocol id
const ECHO_PROTOCOL = "/echo/1.0.0";

async function main() {
  const [node1, node2] = await Promise.all([createNode(), createNode()]);

  console.log("------------ SIMULATION INFO --------------------");
  console.log("Node1:", node1.getMultiaddrs());
  console.log("Node2:", node2.getMultiaddrs());
  console.log(`Detail: 
  N1 will connect with N2 with protocol ${ECHO_PROTOCOL}
    - N1 create a stream: msg* -> stream -> *print output
    - N2 create a stream: stream -> * wrap as eck(<content>)
  `);
  console.log("-------------------------------------------------");

  // the remote will handle incoming streams opened on the protocol
  await node2.handle(ECHO_PROTOCOL, ({ stream }) => {
    // pipe the stream output back to the stream input
    pipe(
      stream,

      // parse
      async function* (source) {
        const decoder = new TextDecoder();

        for await (const chunk of source) {
          const msg = decoder.decode(chunk.subarray());
          yield msg;
        }
      },

      // transform
      async function* (source) {
        const encoder = new TextEncoder();
        for await (const chunk of source) {
          yield encoder.encode(`ack(${chunk})`);
        }
      },
      stream
    );
  });

  node1.addEventListener("peer:discovery", async (evt) => {
    const remotePeerId = evt.detail.id;
    console.log("[Node1] Discovered:", remotePeerId.toString());
    try {
      // await node1.dial(evt.detail.multiaddrs);
      // console.log("\t con", con);

      const stream = await node1.dialProtocol(remotePeerId, ECHO_PROTOCOL);

      console.log("begin - stream opened");

      await pipe(
        async function* () {
          for (let i = 0; i < 10; i++) {
            const msg = `msg - ${i}`;
            const data = new TextEncoder().encode(msg);
            console.log("\t Echo-send:", msg);
            yield data;

            await sleepMs(500);
          }
        },
        stream,
        async (source) => {
          const decoder = new TextDecoder();
          const batchedMsg: string[] = [];

          for await (const buf of source) {
            // buf is a `Uint8ArrayList` so we must turn it into a `Uint8Array`
            // before decoding it
            const msg = decoder.decode(buf.subarray());
            console.log("\t Echo-response:", msg);
            batchedMsg.push(msg);
          }

          return batchedMsg;
        }
      );
      console.log("finished - stream closed");
      await stream.close();
    } catch (err) {
      console.error(err);
    }
  });

  node1.addEventListener("peer:connect", (evt) => {
    console.log("[Node1] Connected:", evt.detail.toString());
  });

  node2.addEventListener("peer:connect", (evt) => {
    console.log("[Node2] Connected:", evt.detail.toString());
  });

  node2.addEventListener("peer:discovery", (evt) =>
    console.log("[Node2] Discovered:", evt.detail.id.toString())
  );
}

main();
